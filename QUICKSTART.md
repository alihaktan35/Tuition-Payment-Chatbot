# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1️⃣ Prerequisites
- Install Node.js 18+ from https://nodejs.org
- Get Gemini API key from https://aistudio.google.com/app/apikey

### 2️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_key_here
npm start
```
✅ Backend running on http://localhost:3001

### 3️⃣ Frontend Setup (New Terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend running on http://localhost:5173

### 4️⃣ Test the Chatbot
Open http://localhost:5173 in your browser and try:
- "Check tuition for 20210001"
- "I want to pay 5000 TL for student 20210001, term 2024-Fall"
- "Show unpaid students for 2024-Fall"

## 📌 Test Data
- Student 20210001: UNPAID, 50,000 TRY balance
- Student 20210002: PARTIAL, 25,000 TRY balance
- Student 20210003: PAID, 0 TRY balance

## 🐛 Troubleshooting

**Backend won't start?**
- Check if GEMINI_API_KEY is set in backend/.env

**Frontend can't connect?**
- Make sure backend is running on port 3001
- Check browser console for errors

**Rate limit error?**
- API Gateway limits mobile endpoint to 3 calls/day
- Wait or use different student number

## 📚 Full Documentation
See [README.md](README.md) for complete documentation.
