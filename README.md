# Tuition-Payment-Chatbot
AI Agent chat application for University Tuition Payment System - SE 4458 Assignment 3 (Group 2)

---

## 🎓 Academic Information

**Course**: SE 4458 - Software Architecture & Design of Modern Large Scale Systems

**Assignment**: Assignment 3 - AI Agent Chat Application (Group 2)

**Student**: Ali Haktan SIĞIN

**Academic Year**: 2025-2026

**Submission Date**: December 2025

---

## 🔗 Links

- **Live Application**: https://ahs-tuition-chatbot.netlify.app/
- **Backend API**: https://tuition-payment-chatbot-backend.onrender.com/
- **GitHub Repository**: [Tuition-Payment-Chatbot](https://github.com/alihaktan35/Tuition-Payment-Chatbot)
- **API Gateway**: https://ahs-tuition-gateway.azurewebsites.net
- **Video Demo**: [YouTube - Coming Soon](#)

---

## 📋 Project Overview

A production-ready AI-powered chatbot that provides a conversational interface to the University Tuition Payment System. The application is **fully deployed and operational** on cloud platforms using modern web technologies.

**Core Features:**
- 🔍 **Query tuition** information for any student
- 💳 **Process tuition payments** with partial payment support
- 📊 **View unpaid tuition** list (admin feature)
- 🤖 **Natural language understanding** powered by Google Gemini AI
- ⚡ **Real-time communication** via WebSocket

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript + Tailwind CSS)              │
│  Deployed on Netlify                                        │
│  https://ahs-tuition-chatbot.netlify.app                   │
└─────────────────┬───────────────────────────────────────────┘
                  │ WebSocket (Socket.io)
                  ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend (Node.js + Express + Socket.io)                   │
│  Deployed on Render                                         │
│  https://tuition-payment-chatbot-backend.onrender.com      │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS
                  ↓
┌─────────────────────────────────────────────────────────────┐
│  Azure API Gateway                                          │
│  https://ahs-tuition-gateway.azurewebsites.net             │
└─────────────────────────────────────────────────────────────┘
```

**Architecture Highlights:**
- ✅ **Real-time bidirectional communication** for instant message delivery
- ✅ **Conversational AI with context tracking** - remembers information across messages
- ✅ **All API calls routed through Azure API Gateway** as required
- ✅ **Cloud-deployed and scalable** - zero infrastructure management
- ✅ **Clean separation of concerns** - frontend, backend, AI, and API gateway

---

## 💻 Technology Stack & Rationale

| Component | Technology | Why This Choice |
|-----------|-----------|-----------------|
| **Frontend** | React 18 + TypeScript | Industry-standard framework with type safety, component reusability, and excellent developer experience |
| **Styling** | Tailwind CSS | Modern utility-first CSS framework for rapid UI development and consistent design system |
| **Build Tool** | Vite | Lightning-fast development server and optimized production builds |
| **Real-time** | Socket.io | Robust WebSocket library with automatic reconnection and fallback mechanisms |
| **Backend** | Node.js + Express | Lightweight, proven stack for building scalable APIs |
| **AI/LLM** | Google Gemini 2.0 Flash Lite | **Free tier with generous limits**, excellent intent parsing, and fast response times |
| **HTTP Client** | Axios | Clean API for HTTP requests with interceptors and error handling |
| **Frontend Hosting** | Netlify | **Free tier**, automatic deployments from Git, CDN distribution, excellent DX |
| **Backend Hosting** | Render | **Free tier**, supports WebSocket, automatic SSL, easy environment management |

**Total Monthly Cost**: **$0** (using free tiers on all platforms)

---

## 📁 Project Structure

```
Tuition-Payment-Chatbot/
├── frontend/                    # React TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx      # Main chat UI with real-time messaging
│   │   │   ├── MessageBubble.tsx      # Message display components
│   │   │   └── TuitionCard.tsx        # Data visualization cards
│   │   ├── services/
│   │   │   └── socketService.ts       # Socket.io client configuration
│   │   ├── types/
│   │   │   └── index.ts               # TypeScript interfaces & types
│   │   ├── App.tsx
│   │   └── index.css
│   ├── netlify.toml                   # Netlify deployment config
│   └── package.json
│
├── backend/                     # Node.js Express application
│   ├── src/
│   │   ├── services/
│   │   │   ├── geminiService.js       # Gemini AI integration & intent parsing
│   │   │   └── apiGatewayClient.js    # Azure API Gateway client
│   │   ├── config/
│   │   │   └── config.js              # Environment configuration
│   │   └── server.js                  # Express + Socket.io server
│   ├── render.yaml                    # Render deployment config
│   └── package.json
│
└── README.md
```

---

## 🎯 Key Features & Implementation

### 1. Natural Language Understanding
The chatbot uses **Google Gemini AI** to parse user intent from natural language, making it accessible to non-technical users.

**Examples:**
```
"I want to check my tuition" → QUERY_TUITION intent
"Check tuition for 20210001" → Extracts student number automatically
"Pay 5000 TL for Fall 2024" → PAY_TUITION with all parameters
"Show me unpaid students" → UNPAID_TUITION (admin feature)
```

### 2. Smart Conversation Context
The backend maintains conversation state, remembering critical information:
```
User: "Check tuition for 20210001"
Bot: [Shows tuition info for Fall 2024]
User: "Pay 5000 TL"
Bot: [Uses remembered student number and term from context]
```

### 3. Comprehensive Intent Parsing
- **QUERY_TUITION** - Check student tuition balance and status
- **PAY_TUITION** - Process tuition payments with validation
- **UNPAID_TUITION** - Admin feature to view unpaid students by term
- **GREETING** - Welcome messages and help information
- **UNKNOWN** - Intelligent clarification requests

### 4. Real-time WebSocket Communication
- Instant message delivery (no polling, no delays)
- Connection status indicators
- Automatic reconnection on network issues
- Typing indicators for better UX

### 5. Professional UI/UX
- Modern chat interface with message bubbles
- Structured data cards for tuition/payment information
- Quick action buttons for common tasks
- Fully responsive (mobile, tablet, desktop)
- Loading states and smooth animations
- Auto-scroll to latest messages

---

## 🚀 Production Deployment

### Live URLs
- **Frontend**: https://ahs-tuition-chatbot.netlify.app/
- **Backend**: https://tuition-payment-chatbot-backend.onrender.com/

### Deployment Highlights
- ✅ **Fully operational** - All features working in production
- ✅ **Free hosting** - Netlify and Render free tiers
- ✅ **Automatic SSL/HTTPS** - Secure communication
- ✅ **CDN distribution** - Fast global access
- ✅ **Environment variables** - Secure API key management
- ✅ **Git-based deployments** - Automatic updates on push
- ✅ **WebSocket support** - Real-time functionality maintained

---

## 🧪 Test Data & Examples

### Test Students
```
Student: 20210001 (Ahmet Yılmaz)   - Balance: 50,000 TRY (Unpaid)
Student: 20210002 (Ayşe Demir)     - Balance: 25,000 TRY (Partial)
Student: 20210003 (Mehmet Kaya)    - Balance: 0 TRY (Paid)
```

### Example Conversations

**Query Tuition:**
```
User: Hello!
Bot: Welcome! I can help you with tuition queries, payments, and more.
User: Check tuition for student 20210001
Bot: [Displays tuition card with student name, term, balance, status]
```

**Pay Tuition:**
```
User: I want to pay 10000 TL for student 20210001
Bot: [Processes payment through API Gateway]
Bot: [Shows payment confirmation with updated balance]
```

**Admin - Unpaid List:**
```
User: Show me unpaid students for 2024-Fall
Bot: [Displays table of all unpaid students with balances]
```

---

## 📝 Design Decisions

### Why React + TypeScript?
- **Type safety** prevents runtime errors and improves code quality
- **Component architecture** enables reusability and maintainability
- **Rich ecosystem** with extensive libraries and tooling
- **Industry standard** with excellent documentation and community support

### Why Tailwind CSS?
- **Rapid development** with utility classes
- **Consistent design** system out of the box
- **Small bundle size** with automatic purging of unused styles
- **Responsive by default** with mobile-first approach

### Why Socket.io?
- **Reliable real-time communication** with automatic reconnection
- **Fallback mechanisms** (WebSocket → polling) for compatibility
- **Room support** for potential multi-user features
- **Event-based API** makes code clean and intuitive

### Why Google Gemini?
- **Free tier** with generous rate limits (perfect for academic project)
- **Fast response times** (< 1 second for intent parsing)
- **Excellent at structured output** - returns JSON-formatted intents
- **Conversation context** - can reference previous messages
- **No credit card required** for API access

### Why Netlify + Render?
- **Free tiers** - Zero infrastructure cost
- **Automatic deployments** - Push to Git and it deploys
- **CDN + Edge network** - Fast global performance
- **WebSocket support** - Render maintains persistent connections
- **Easy environment management** - Secure API key storage

### Authentication Strategy
- Uses admin credentials for admin-only endpoints (unpaid list)
- No user authentication required (as per assignment scope)
- Credentials configured via environment variables

---

## 🐛 Known Considerations

### API Rate Limiting
The mobile endpoint (`/api/v1/tuition/query/{studentNo}`) has rate limiting (3 requests/day). The backend can fallback to the banking endpoint with authentication if needed.

### CORS Configuration
Backend properly configured to accept requests from the Netlify frontend domain, ensuring secure cross-origin communication.

### WebSocket Connection
Socket.io handles reconnection automatically if the connection drops, maintaining a seamless user experience.

---

## ✅ Assignment Requirements Coverage

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Web frontend framework | React 18 + TypeScript | ✅ |
| API Gateway integration | All API calls routed through Azure Gateway | ✅ |
| Real-time messaging | Socket.io WebSocket | ✅ |
| LLM integration | Google Gemini for intent parsing & context | ✅ |
| Query tuition API | Implemented with data cards | ✅ |
| Pay tuition API | Implemented with validation & confirmation | ✅ |
| Unpaid list API | Admin feature with table view | ✅ |
| Professional UI | Modern chat interface with Tailwind CSS | ✅ |
| Cloud deployment | Netlify (frontend) + Render (backend) | ✅ |
| Documentation | Comprehensive README | ✅ |
| GitHub repository | Public repository with clean structure | ✅ |
| Video presentation | Coming soon | ⏳ |

---

**Built with React, Node.js, Socket.io, and Google Gemini**
