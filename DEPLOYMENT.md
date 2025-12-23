# 🚀 Deployment Guide

Complete guide to deploy the Tuition Payment Chatbot to production using free cloud services.

**Stack:**
- **Frontend**: Netlify (Free tier)
- **Backend**: Render (Free tier)

**Estimated time**: 15-20 minutes

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account
- ✅ Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- ✅ Project code pushed to GitHub repository
- ✅ All code tested locally and working

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended for easy deployment)
4. Authorize Render to access your GitHub repositories

### Step 2: Create New Web Service

1. From Render Dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository:
   - Click **"Connect account"** if not already connected
   - Find your repository: `Tuition-Payment-Chatbot`
   - Click **"Connect"**

### Step 3: Configure Web Service

Fill in the following settings:

**Basic Settings:**
```
Name: tuition-chatbot-backend
Region: Choose closest to you (e.g., Frankfurt for Europe)
Branch: main
Root Directory: backend
Runtime: Node
```

**Build & Deploy Settings:**
```
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
```
Select: Free ($0/month)
```

### Step 4: Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Production mode |
| `GEMINI_API_KEY` | `your_gemini_api_key_here` | Your actual Gemini API key |
| `API_GATEWAY_URL` | `https://ahs-tuition-gateway.azurewebsites.net` | Your Azure API Gateway |
| `ADMIN_USERNAME` | `admin` | Admin username |
| `ADMIN_PASSWORD` | `Admin123!` | Admin password |
| `PORT` | `3001` | Port (Render will override this) |
| `CORS_ORIGIN` | `https://your-app-name.netlify.app` | Will update after frontend deploy |

**Important:** Don't deploy yet! We need the frontend URL first.

### Step 5: Save Configuration

Click **"Create Web Service"** (don't worry, it will fail first time - this is expected)

**Copy the Backend URL:**
- After creation, you'll see: `https://tuition-chatbot-backend.onrender.com`
- **Save this URL** - you'll need it for frontend deployment

---

## 🎨 Part 2: Deploy Frontend to Netlify

### Step 1: Create Netlify Account

1. Go to [netlify.com](https://www.netlify.com)
2. Click **"Sign up"**
3. Sign up with GitHub
4. Authorize Netlify to access your repositories

### Step 2: Create New Site

1. From Netlify Dashboard, click **"Add new site"**
2. Select **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Find and select your repository: `Tuition-Payment-Chatbot`

### Step 3: Configure Build Settings

Fill in the following:

**Site Settings:**
```
Branch to deploy: main
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

**Advanced:** Click **"Show advanced"** and add environment variable:

| Key | Value |
|-----|-------|
| `VITE_BACKEND_URL` | `https://tuition-chatbot-backend.onrender.com` |

(Use the backend URL from Part 1, Step 5)

### Step 4: Deploy Site

1. Click **"Deploy site"**
2. Wait 2-3 minutes for build to complete
3. Once deployed, you'll see: `https://random-name-12345.netlify.app`

### Step 5: Change Site Name (Optional)

1. Go to **Site settings** → **General** → **Site details**
2. Click **"Change site name"**
3. Enter a custom name: `tuition-chatbot` (if available)
4. Your site will be: `https://tuition-chatbot.netlify.app`

**Copy the Frontend URL** - you'll need it for the next step!

---

## 🔄 Part 3: Update Backend CORS

Now that you have the frontend URL, update the backend:

### Update Backend Environment Variable on Render

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click on your **"tuition-chatbot-backend"** service
3. Go to **"Environment"** tab
4. Find `CORS_ORIGIN` variable
5. Update value to your Netlify URL: `https://tuition-chatbot.netlify.app`
6. Click **"Save Changes"**
7. Render will automatically redeploy (takes 1-2 minutes)

---

## ✅ Part 4: Test Deployment

### Step 1: Check Backend Health

Visit: `https://tuition-chatbot-backend.onrender.com/health`

**Expected response:**
```json
{
  "status": "ok",
  "message": "Tuition Chatbot Backend is running"
}
```

If you see this, backend is working! ✅

### Step 2: Test Frontend

1. Visit your Netlify URL: `https://tuition-chatbot.netlify.app`
2. You should see the chatbot interface
3. Check connection status - should show **"Online"** (green dot)

### Step 3: Test Chatbot

Try these commands:

```
1. "Hello" → Should get greeting
2. "Check tuition for 20210001" → Should show tuition info
3. "Pay 5000 TRY" → Should process payment
4. "Show unpaid students for 2024-Fall" → Should show list
```

If all work, **deployment successful!** 🎉

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: "Application failed to respond"**
- **Solution**: Check Render logs:
  1. Go to Render Dashboard → Your service
  2. Click **"Logs"** tab
  3. Look for errors (usually GEMINI_API_KEY missing)

**Problem: "Error connecting to backend"**
- **Solution**: Check CORS_ORIGIN is set correctly
- Verify frontend URL matches exactly (no trailing slash)

**Problem: "Too many requests" from Gemini**
- **Solution**: Wait a few minutes, or upgrade Gemini model to `gemma-3-12b`

### Frontend Issues

**Problem: "Failed to load resource" or blank page**
- **Solution**: Check browser console:
  1. Press F12 → Console tab
  2. Look for CORS errors
  3. Verify `VITE_BACKEND_URL` is set correctly in Netlify

**Problem: WebSocket connection failed**
- **Solution**:
  1. Check backend is running (visit /health endpoint)
  2. Verify `VITE_BACKEND_URL` doesn't have trailing slash
  3. Wait 30 seconds for Render free tier to wake up

**Problem: Build failed on Netlify**
- **Solution**: Check build logs:
  1. Netlify Dashboard → Site → Deploys
  2. Click failed deploy → View logs
  3. Usually: missing dependencies or wrong build command

### Common Fixes

**Clear Cache and Redeploy:**

**On Netlify:**
1. Deploys → Trigger deploy → Clear cache and deploy site

**On Render:**
1. Manual Deploy → Clear build cache & deploy

**Check Environment Variables:**
- All variables should have NO quotes
- No extra spaces
- URLs should not end with `/`

---

## 💰 Cost Breakdown

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **Netlify** | Free | $0/month | 100GB bandwidth, 300 build minutes |
| **Render** | Free | $0/month | 750 hours/month, sleeps after 15min inactivity |
| **Gemini API** | Free tier | $0/month | See rate limits in Google AI Studio |
| **Azure API Gateway** | Already deployed | - | From previous assignment |

**Total: $0/month** ✅

**Free tier limitations:**
- Render free tier: Backend sleeps after 15 minutes of inactivity (wakes up in 30 seconds on first request)
- Gemini: Rate limits apply (use gemini-2.5-flash-lite for better limits)

---

## 🔒 Security Checklist

Before going live:

- [ ] ✅ Gemini API key is in environment variables (NOT in code)
- [ ] ✅ `.env` files are in `.gitignore`
- [ ] ✅ Admin credentials are secure
- [ ] ✅ CORS is configured to allow only your frontend URL
- [ ] ✅ No secrets committed to GitHub

---

## 📊 Monitoring

### Check Deployment Status

**Netlify:**
- Dashboard: [app.netlify.com](https://app.netlify.com)
- Build status, deploy logs, analytics

**Render:**
- Dashboard: [dashboard.render.com](https://dashboard.render.com)
- Service metrics, logs, events

### View Logs

**Backend Logs (Render):**
1. Render Dashboard → tuition-chatbot-backend
2. Click **"Logs"** tab
3. Real-time logs of all requests

**Frontend Logs (Netlify):**
1. Netlify Dashboard → Your site
2. Click **"Deploys"** → Latest deploy
3. View build logs

---

## 🔄 Updating Your App

### Update Backend

**Method 1: Push to GitHub**
```bash
# Make changes to backend code
git add backend/
git commit -m "Update backend"
git push origin main
```
Render automatically redeploys! ✅

**Method 2: Manual Deploy**
1. Render Dashboard → Service
2. Click **"Manual Deploy"** → Deploy latest commit

### Update Frontend

**Method 1: Push to GitHub**
```bash
# Make changes to frontend code
git add frontend/
git commit -m "Update frontend"
git push origin main
```
Netlify automatically rebuilds and deploys! ✅

**Method 2: Manual Deploy**
1. Netlify Dashboard → Site
2. Click **"Trigger deploy"** → Deploy site

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain to Netlify

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. Netlify Dashboard → Domain settings
3. Click **"Add custom domain"**
4. Follow instructions to update DNS records
5. Netlify provides free SSL certificate

### Add Custom Domain to Render

1. Render Dashboard → Service → Settings
2. Click **"Custom Domain"**
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update DNS records as instructed
5. Free SSL included

---

## 📝 Environment Variables Reference

### Backend (.env for local)
```bash
GEMINI_API_KEY=your_gemini_api_key
API_GATEWAY_URL=https://ahs-tuition-gateway.azurewebsites.net
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin123!
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local for local)
```bash
VITE_BACKEND_URL=http://localhost:3001
```

### Render Environment Variables (Production)
```
NODE_ENV=production
GEMINI_API_KEY=your_actual_key
API_GATEWAY_URL=https://ahs-tuition-gateway.azurewebsites.net
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin123!
PORT=3001
CORS_ORIGIN=https://tuition-chatbot.netlify.app
```

### Netlify Environment Variables (Production)
```
VITE_BACKEND_URL=https://tuition-chatbot-backend.onrender.com
```

---

## 🎯 Final Checklist

Before submitting your assignment:

- [ ] ✅ Backend deployed to Render
- [ ] ✅ Frontend deployed to Netlify
- [ ] ✅ Backend health endpoint returns OK
- [ ] ✅ Frontend shows "Online" status
- [ ] ✅ All 3 features tested and working:
  - [ ] Query Tuition
  - [ ] Pay Tuition
  - [ ] Unpaid Tuition List
- [ ] ✅ Smart context working (term tracking)
- [ ] ✅ Currency showing as TRY (not $)
- [ ] ✅ Error messages are helpful
- [ ] ✅ URLs added to README.md
- [ ] ✅ Demo video recorded and uploaded
- [ ] ✅ All environment variables secured

---

## 🆘 Support Resources

**Netlify:**
- Docs: https://docs.netlify.com
- Community: https://answers.netlify.com

**Render:**
- Docs: https://render.com/docs
- Community: https://community.render.com

**Gemini:**
- Docs: https://ai.google.dev/docs
- Rate limits: https://ai.google.dev/pricing

---

## 🎉 Success!

Your chatbot is now live and accessible worldwide!

**Share your links:**
- Frontend: `https://tuition-chatbot.netlify.app`
- Backend: `https://tuition-chatbot-backend.onrender.com`
- API Docs: `https://tuition-chatbot-backend.onrender.com/health`

**Next steps:**
1. Test thoroughly
2. Record demo video
3. Update README with live URLs
4. Submit assignment

**Congratulations on deploying your AI chatbot!** 🎊
