import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { config } from './config/config.js';
import { parseIntent, generateResponse } from './services/geminiService.js';
import { queryTuition, payTuition, getUnpaidTuition } from './services/apiGatewayClient.js';

const app = express();
const httpServer = createServer(app);

// Configure CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tuition Chatbot Backend is running' });
});

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Store conversation context for each socket connection
const conversationContexts = new Map();

/**
 * Handle intent execution and call appropriate API
 */
async function handleIntent(intent, parameters, context, clarification = null) {
  console.log(`[Intent Handler] Processing: ${intent}`, parameters);

  try {
    switch (intent) {
      case 'QUERY_TUITION': {
        if (!parameters.studentNo) {
          return {
            type: 'clarification',
            message: 'Please provide your student number to check tuition.',
          };
        }
        const result = await queryTuition(parameters.studentNo);

        if (result.success) {
          // Update context with student number AND term from API response
          context.studentNo = parameters.studentNo;
          // Save the actual term returned by the API
          if (result.data.term) {
            context.term = result.data.term;
          }
          const responseText = await generateResponse('QUERY_TUITION', result.data);

          return {
            type: 'tuition_info',
            data: result.data,
            message: responseText,
          };
        } else {
          return {
            type: 'error',
            message: result.error || 'Failed to query tuition. Please check the student number and try again.',
          };
        }
      }

      case 'PAY_TUITION': {
        let { studentNo, term, amount } = parameters;

        // Use context if not provided
        if (!studentNo && context.studentNo) {
          studentNo = context.studentNo;
        }
        if (!term && context.term) {
          term = context.term;
        }

        if (!studentNo || !term || !amount) {
          const missing = [];
          if (!studentNo) missing.push('student number');
          if (!term) missing.push('term (e.g., 2024-Fall)');
          if (!amount) missing.push('amount');

          return {
            type: 'clarification',
            message: `To process a payment, I need: ${missing.join(', ')}. Please provide the missing information.`,
          };
        }

        const result = await payTuition(studentNo, term, amount);

        if (result.success) {
          // Update context
          context.studentNo = studentNo;
          context.term = term;

          const responseText = await generateResponse('PAY_TUITION', result.data);

          return {
            type: 'payment_success',
            data: result.data,
            message: responseText,
          };
        } else {
          return {
            type: 'error',
            message: result.error || 'Payment failed. Please try again.',
          };
        }
      }

      case 'UNPAID_TUITION': {
        if (!parameters.term) {
          return {
            type: 'clarification',
            message: 'Please specify the term (e.g., "2024-Fall" or "2025-Spring") to view unpaid tuition.',
          };
        }

        const result = await getUnpaidTuition(parameters.term);

        if (result.success) {
          context.term = parameters.term;
          const responseText = await generateResponse('UNPAID_TUITION', result.data);

          return {
            type: 'unpaid_list',
            data: result.data,
            message: responseText,
          };
        } else {
          return {
            type: 'error',
            message: result.error || 'Failed to retrieve unpaid tuition list.',
          };
        }
      }

      case 'GREETING': {
        return {
          type: 'greeting',
          message: "Hello! I'm your tuition assistant. I can help you:\n• Check tuition balance\n• Make tuition payments\n• View unpaid tuition (admin)\n\nHow can I help you today?",
        };
      }

      case 'UNKNOWN':
      default: {
        return {
          type: 'clarification',
          message: clarification || "I'm not sure what you're asking. I can help you check tuition, make payments, or view unpaid tuition. What would you like to do?",
        };
      }
    }
  } catch (error) {
    console.error('[Intent Handler] Error:', error);
    return {
      type: 'error',
      message: 'An error occurred while processing your request. Please try again.',
    };
  }
}

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Initialize conversation context for this socket
  conversationContexts.set(socket.id, {});

  // Send welcome message
  socket.emit('message', {
    type: 'greeting',
    message: "Hello! I'm your tuition assistant. I can help you check tuition, make payments, or view unpaid tuition. How can I assist you today?",
    timestamp: new Date().toISOString(),
  });

  // Handle incoming messages
  socket.on('user_message', async (data) => {
    const { message } = data;
    console.log(`[Socket.io] Received from ${socket.id}:`, message);

    try {
      // Get conversation context
      const context = conversationContexts.get(socket.id) || {};

      // Parse intent using Gemini
      const parsed = await parseIntent(message, context);

      // Handle the intent (pass clarification from Gemini)
      const result = await handleIntent(parsed.intent, parsed.parameters, context, parsed.clarification);

      // Update context
      conversationContexts.set(socket.id, context);

      // Send response back to client
      socket.emit('message', {
        ...result,
        intent: parsed.intent,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('[Socket.io] Error handling message:', error);
      socket.emit('message', {
        type: 'error',
        message: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    conversationContexts.delete(socket.id);
  });
});

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Tuition Chatbot Backend running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🔑 Gemini API configured: ${config.geminiApiKey ? 'YES' : 'NO'}`);
  console.log(`🌐 API Gateway: ${config.apiGatewayUrl}`);
  console.log(`\n✅ Ready to accept connections\n`);
});
