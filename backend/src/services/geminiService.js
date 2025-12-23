import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config.js';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const SYSTEM_PROMPT = `You are an AI assistant for a university tuition payment system.
Parse the user's intent and extract parameters from their message.

Available intents:
1. QUERY_TUITION - Check tuition balance for a student
   Required: studentNo (8-digit student number like "20210001")

2. UNPAID_TUITION - List students with unpaid tuition (admin only)
   Required: term (format: "YYYY-Season" like "2024-Fall" or "2025-Spring")

3. PAY_TUITION - Make a tuition payment
   Required: studentNo, amount (number in TRY), term

4. GREETING - User is greeting or asking general questions
   No parameters needed

5. UNKNOWN - Cannot determine intent or missing information

IMPORTANT RULES:
- If student number is mentioned, extract it (8 digits starting with 20)
- If amount is mentioned (like "5000 TL" or "10000"), extract the number
- If term is mentioned (like "Fall 2024" or "2024-Fall"), format it as "YYYY-Season"
- Only return QUERY_TUITION if you have the student number
- Only return PAY_TUITION if you have studentNo, amount, and term
- Only return UNPAID_TUITION if you have the term

Respond ONLY with valid JSON in this exact format:
{
  "intent": "QUERY_TUITION" | "UNPAID_TUITION" | "PAY_TUITION" | "GREETING" | "UNKNOWN",
  "parameters": {},
  "confidence": 0.95,
  "missingParams": [],
  "clarification": "optional message if UNKNOWN or missing params"
}`;

/**
 * Parse user message to extract intent and parameters using Gemini
 * @param {string} userMessage - The user's message
 * @param {object} context - Conversation context (e.g., remembered studentNo)
 * @returns {Promise<object>} Parsed intent and parameters
 */
export async function parseIntent(userMessage, context = {}) {
  try {
    const contextInfo = Object.keys(context).length > 0
      ? `\n\nContext from previous messages: ${JSON.stringify(context)}`
      : '';

    const prompt = `${SYSTEM_PROMPT}${contextInfo}\n\nUser message: "${userMessage}"\n\nJSON response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (Gemini might wrap it in markdown)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Merge context parameters if available
    if (context.studentNo && !parsed.parameters.studentNo) {
      parsed.parameters.studentNo = context.studentNo;
    }
    if (context.term && !parsed.parameters.term) {
      parsed.parameters.term = context.term;
    }

    console.log('[Gemini] Parsed intent:', JSON.stringify(parsed, null, 2));
    return parsed;

  } catch (error) {
    console.error('[Gemini] Error parsing intent:', error);
    return {
      intent: 'UNKNOWN',
      parameters: {},
      confidence: 0,
      error: error.message,
      clarification: 'Sorry, I could not understand your request. Please try again.'
    };
  }
}

/**
 * Generate a conversational response based on API data
 * @param {string} intent - The intent that was executed
 * @param {object} apiResponse - Response from the API
 * @returns {Promise<string>} Human-friendly response
 */
export async function generateResponse(intent, apiResponse) {
  try {
    const prompt = `You are a friendly university tuition assistant.
Generate a concise, helpful response based on this data.

Intent: ${intent}
API Response: ${JSON.stringify(apiResponse, null, 2)}

Generate a short, friendly message (2-3 sentences max) that presents this information to the user.
For successful operations, be positive and clear.
For errors, be helpful and suggest next steps.

Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();

  } catch (error) {
    console.error('[Gemini] Error generating response:', error);
    return 'Operation completed. Please check the details above.';
  }
}
