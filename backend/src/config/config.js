import dotenv from 'dotenv';
dotenv.config();

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  apiGatewayUrl: process.env.API_GATEWAY_URL || 'https://ahs-tuition-gateway.azurewebsites.net',
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin123!',
  port: process.env.PORT || 3001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

// Validate required environment variables
if (!config.geminiApiKey) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  console.error('Please create a .env file with GEMINI_API_KEY=your_key_here');
}
