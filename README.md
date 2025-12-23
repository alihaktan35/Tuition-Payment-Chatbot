# Tuition-Payment-Chatbot
AI Agent chat application for University Tuition Payment System - SE 4458 Assignment 3 (Group 2)

**Student**: Ali Haktan SIĞIN
**Course**: SE 4458 - Software Architecture & Design of Modern Large Scale Systems
**Academic Year**: 2025-2026

---

## 🔗 Links
- **GitHub Repository**: [Tuition-Payment-Chatbot](https://github.com/alihaktan35/Tuition-Payment-Chatbot)
- **Video Demo**: [YouTube - Coming Soon](#)
- **Live Demo**: [Deployed App - Coming Soon](#)
- **API Gateway**: https://ahs-tuition-gateway.azurewebsites.net

---

## 📋 Project Overview

This is an AI-powered chatbot that interacts with the University Tuition Payment System APIs. Users can:
- 🔍 **Query tuition** information for students
- 💳 **Pay tuition** with partial payment support
- 📊 **View unpaid tuition** list (admin feature)

The chatbot uses **Google Gemini AI** for natural language understanding and intent parsing, providing a conversational interface for tuition management.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript + Tailwind CSS)              │
│  - Chat UI with message bubbles                            │
│  - Data cards for structured responses                     │
│  - Socket.io client for real-time communication            │
└─────────────────┬───────────────────────────────────────────┘
                  │ WebSocket (Socket.io)
                  ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend (Node.js + Express + Socket.io)                   │
│  - WebSocket server                                         │
│  - Gemini API integration (intent parsing)                 │
│  - Conversation context tracking                           │
│  - API Gateway client                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS
                  ↓
┌─────────────────────────────────────────────────────────────┐
│  Azure API Gateway (Previously deployed)                   │
│  - GET /api/v1/tuition/query/{studentNo}                   │
│  - GET /api/v1/banking/tuition/{studentNo}                 │
│  - POST /api/v1/banking/pay                                │
│  - GET /api/v1/admin/unpaid/{term}                         │
└─────────────────────────────────────────────────────────────┘
```

**Why this architecture?**
✅ Real-time bidirectional communication (WebSocket)
✅ Conversational AI with context tracking (Gemini)
✅ All API calls go through existing API Gateway
✅ Scalable and deployable to cloud
✅ Clean separation of concerns

---

## 💻 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 18 + TypeScript | Type-safe UI components |
| **Styling** | Tailwind CSS | Modern, responsive design |
| **Build Tool** | Vite | Fast development & build |
| **Real-time** | Socket.io (client) | WebSocket communication |
| **Backend** | Node.js + Express | Lightweight server |
| **WebSocket** | Socket.io (server) | Real-time messaging |
| **AI/LLM** | Google Gemini 1.5 Flash | Intent parsing & NLU |
| **HTTP Client** | Axios | API Gateway calls |
| **Deployment** | Netlify + Render | Cloud hosting (free tiers) |

---

## 📁 Project Structure

```
Tuition-Payment-Chatbot/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx      # Main chat UI
│   │   │   ├── MessageBubble.tsx      # Message display
│   │   │   └── TuitionCard.tsx        # Data cards
│   │   ├── services/
│   │   │   └── socketService.ts       # Socket.io client
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript types
│   │   ├── App.tsx
│   │   └── index.css
│   ├── netlify.toml                   # Netlify config
│   └── package.json
│
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── services/
│   │   │   ├── geminiService.js       # Gemini AI integration
│   │   │   └── apiGatewayClient.js    # API calls
│   │   ├── config/
│   │   │   └── config.js              # Environment config
│   │   └── server.js                  # Express + Socket.io
│   ├── render.yaml                    # Render deployment
│   └── package.json
│
└── README.md                    # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ and npm
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_api_key_here

# Start the server
npm start
```

Backend will run on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file (optional if using default)
cp .env.example .env

# Edit .env if backend is not on localhost:3001
# VITE_BACKEND_URL=http://localhost:3001

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🎯 Features & Capabilities

### 1. Natural Language Understanding
The chatbot uses Gemini AI to understand user intent from natural language:

**Examples:**
- "I want to check my tuition" → **QUERY_TUITION** intent
- "Check tuition for 20210001" → Extracts student number
- "Pay 5000 TL for Fall 2024" → **PAY_TUITION** with parameters
- "Show me unpaid students" → **UNPAID_TUITION** (admin)

### 2. Conversation Context
The chatbot remembers information across messages:
```
User: "Check tuition for 20210001"
Bot: [Shows tuition info]
User: "Pay 5000 TL"
Bot: [Uses remembered student number from context]
```

### 3. Intent Parsing
Supported intents:
- `QUERY_TUITION` - Check student tuition balance
- `PAY_TUITION` - Make a tuition payment
- `UNPAID_TUITION` - View unpaid students (admin)
- `GREETING` - Welcome and help messages
- `UNKNOWN` - Ask for clarification

### 4. Real-time Updates
- Instant message delivery via WebSocket
- Typing indicators
- Online/offline status
- Auto-scroll to latest message

### 5. Beautiful UI
- Chat bubbles for messages
- Data cards for structured information
- Quick action buttons
- Responsive design (mobile & desktop)
- Loading states and animations

---

## 🧪 Testing

### Test Student Data
```
Student: 20210001 (Ahmet Yılmaz) - UNPAID - 50,000 TRY
Student: 20210002 (Ayşe Demir) - PARTIAL - 25,000 TRY balance
Student: 20210003 (Mehmet Kaya) - PAID - 0 TRY balance
```

### Example Conversations

**Query Tuition:**
```
User: Hello!
Bot: [Welcome message]
User: I want to check my tuition for student 20210001
Bot: [Shows tuition card with balance, status, etc.]
```

**Pay Tuition:**
```
User: I want to pay 10000 TL for student 20210001, term 2024-Fall
Bot: [Processes payment]
Bot: [Shows payment success card with new balance]
```

**Unpaid List:**
```
User: Show me unpaid students for 2024-Fall
Bot: [Shows table of unpaid students]
```

---

## 🌐 Deployment

### Frontend (Netlify)
1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_BACKEND_URL`

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `CORS_ORIGIN` (frontend URL)
5. Deploy

---

## 📝 Design Decisions & Assumptions

### Architecture Choice
- **WebSocket over Firestore**: Simpler setup, full control, works locally
- **Gemini over OpenAI**: Free tier, fast, excellent for intent parsing
- **React + TypeScript**: Type safety, industry standard, rich ecosystem

### Conversation Flow
- Bot remembers `studentNo` and `term` across conversation
- Missing parameters trigger clarification requests
- Context resets on disconnect

### Authentication
- Uses hardcoded admin credentials for admin endpoints
- No user login required (as per assignment guidelines)

### API Rate Limiting
- The mobile endpoint (`/api/v1/tuition/query/{studentNo}`) has rate limiting (3/day)
- May get 429 error if testing frequently
- Use banking endpoint as fallback (requires auth)

---

## 🐛 Issues & Solutions

### Issue 1: Rate Limiting on Mobile Endpoint
**Problem**: API Gateway rate limits mobile endpoint to 3 requests/day
**Solution**: Backend can fallback to banking endpoint with authentication

### Issue 2: CORS in Development
**Problem**: Frontend and backend on different ports
**Solution**: Configured CORS in backend to allow frontend origin

### Issue 3: WebSocket Connection Timeout
**Problem**: Socket disconnects after inactivity
**Solution**: Auto-reconnection enabled in Socket.io client

---

## 🎬 Demo Video

[Video demonstration link will be added here]

**Video includes:**
- Architecture overview
- Local development demo
- All three intents (Query, Pay, Unpaid)
- Conversation context demonstration
- UI/UX walkthrough

---

## ✅ Assignment Requirements Checklist

- ✅ Web frontend framework (React)
- ✅ API Gateway integration (all calls go through Azure gateway)
- ✅ Real-time messaging (WebSocket/Socket.io)
- ✅ LLM integration (Google Gemini for intent parsing)
- ✅ All required APIs implemented (Query, Pay, Unpaid)
- ✅ Clean, professional UI
- ✅ Cloud deployment ready (Netlify + Render)
- ✅ GitHub repository
- ✅ Comprehensive README
- ✅ Video presentation (coming soon)

---

## 🎓 Academic Information

**Course**: SE 4458 - Software Architecture & Design of Modern Large Scale Systems
**Project**: Assignment 3 - AI Agent Chat Application (Group 2)
**Student**: Ali Haktan SIĞIN
**Academic Year**: 2025-2026
**Submission Date**: December 2025

---

## Progress Log (for AI Agents)
```
[2025-12-23] Project completed & tested
✅ Backend: Node.js + Express + Socket.io + Gemini AI
✅ Frontend: React + TypeScript + Tailwind CSS
✅ WebSocket real-time communication
✅ Smart context tracking (remembers term from API response)
✅ Intent parsing with conversation context
✅ API Gateway integration for all 4 endpoints
✅ Currency: Turkish Lira (TRY) throughout
✅ Deployment configurations (Netlify + Render)
✅ Comprehensive documentation
✅ Fully tested with all features working
⏳ Video demo pending
```

---

**Built with ❤️ using React, Node.js, Socket.io, and Google Gemini**
