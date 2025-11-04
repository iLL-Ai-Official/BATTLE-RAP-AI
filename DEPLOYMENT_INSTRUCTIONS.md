# 🚀 Production Deployment Instructions - RapBots AI

## ✅ DEPLOYMENT FIX COMPLETE

The production deployment crash has been **FIXED**. The server now correctly detects production mode and serves static files instead of trying to run Vite dev server.

---

## 📋 What Was Fixed

### Problem
- Server was starting in development mode in production
- Vite tried to find `/src/main.tsx` (doesn't exist after build)
- Health checks failed because server crashed immediately
- Result: Crash loop

### Solution
1. ✅ **Fixed production detection in `server/index.ts`**
   - Now uses `process.env.NODE_ENV === "production"` directly
   - Logs show: `🏭 Production mode: Serving pre-built static files from dist/public`

2. ✅ **Created `start-production.js` wrapper script**
   - Forces `NODE_ENV=production` before starting server
   - Pre-flight checks verify build exists
   - Clear logging shows environment status

3. ✅ **Rebuilt application with fixes**
   - Production detection compiled into `dist/index.js` (line 13075)
   - Static files ready in `dist/public/`

---

## 🎯 How to Deploy on Replit

### Option 1: Update .replit File (Recommended)

**File:** `.replit`

Change the deployment section from:
```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]
```

To:
```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["node", "start-production.js"]

[deployment.env]
NODE_ENV = "production"
```

**How to edit .replit:**
1. Click on `.replit` file in file explorer
2. Find the `[deployment]` section (around line 9)
3. Change `run = ["npm", "run", "start"]` to `run = ["node", "start-production.js"]`
4. Add the `[deployment.env]` section at the end
5. Save the file

### Option 2: Set Environment Variable in Replit Deployment

If you can't edit .replit, set NODE_ENV in deployment settings:

1. Open your Replit project
2. Click "Deploy" button
3. Go to deployment settings/environment variables
4. Add new variable:
   - **Name:** `NODE_ENV`
   - **Value:** `production`
5. Deploy again

---

## 🔍 Verification Steps

### 1. Check Deployment Logs

After deploying, check the logs. You should see:

```
🚀 RapBots AI - Production Startup Script
============================================================
🔧 NODE_ENV: production

🔍 Pre-flight Checks:
✅ dist/ directory exists
✅ dist/index.js exists
✅ dist/public/ exists
✅ dist/public/index.html exists

🏭 Production mode: Serving pre-built static files from dist/public
```

### 2. Test Health Check

The `/` endpoint should respond quickly with 200 status:

```bash
curl -I https://rap-bots-illaiservices.replit.app/
```

Expected response:
```
HTTP/2 200 
content-type: text/html; charset=UTF-8
```

### 3. Test API Endpoints

```bash
curl https://rap-bots-illaiservices.replit.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-04T..."
}
```

### 4. Load App in Browser

Visit: https://rap-bots-illaiservices.replit.app/

You should see:
- ✅ Homepage loads with React app
- ✅ No "Cannot GET /" error
- ✅ No Vite client errors in console
- ✅ App is fully interactive

---

## 🛠️ Development vs Production

### Development Mode (`npm run dev`)
```bash
npm run dev
```

**What happens:**
- Runs `tsx server/index.ts` directly
- Starts Vite dev server with HMR
- Serves source files from `/src`
- Hot module replacement for instant updates
- Console shows: `🔧 Development mode: Starting Vite dev server`

**Use for:**
- Local development
- Testing changes
- Debugging

### Production Mode (`node start-production.js`)
```bash
node start-production.js
```

**What happens:**
- Forces `NODE_ENV=production`
- Runs compiled `dist/index.js`
- Serves pre-built static files from `dist/public`
- Optimized bundles, minified code
- Console shows: `🏭 Production mode: Serving pre-built static files from dist/public`

**Use for:**
- Replit deployments
- Production testing locally
- Performance benchmarking

---

## 📊 Build Process

The build creates this structure:

```
dist/
├── index.js (507KB backend bundle)
│   └── Contains compiled server code with production detection
└── public/ (frontend static files)
    ├── index.html (5.6KB)
    ├── sw.js (1.1KB service worker)
    ├── assets/
    │   ├── index-CJbFyBQi.js (721.53 KB minified React app)
    │   └── index-gJDWvKy2.css (95.79 KB styles)
    └── images/
        └── (battle arena assets)
```

### Running a Build

```bash
npm run build
```

This will:
1. Run `vite build` to create frontend bundle in `dist/public/`
2. Run `esbuild` to bundle backend into `dist/index.js`
3. Take ~15 seconds
4. Output bundle sizes

**Expected output:**
```
vite v5.4.21 building for production...
✓ 2135 modules transformed.
../dist/public/index.html                   5.65 kB │ gzip:   2.10 kB
../dist/public/assets/index-gJDWvKy2.css   95.79 kB │ gzip:  16.05 kB
../dist/public/assets/index-CJbFyBQi.js   721.53 kB │ gzip: 213.78 kB
✓ built in 14.43s

  dist/index.js  507.7kb

⚡ Done in 83ms
```

---

## 🚨 Troubleshooting

### Problem: "Cannot find module '/src/main.tsx'"

**Cause:** Server is running in development mode in production

**Fix:**
1. Check `NODE_ENV` is set to `production`
2. Use `node start-production.js` instead of `node dist/index.js`
3. Verify logs show: `🏭 Production mode: Serving pre-built static files`

### Problem: "Could not find the build directory"

**Cause:** Build hasn't been run or failed

**Fix:**
1. Run `npm run build`
2. Verify `dist/` folder exists with `dist/public/index.html`
3. Check build logs for errors

### Problem: Health check timeout

**Cause:** Server taking too long to start or respond

**Fix:**
1. Reduce expensive operations on server startup
2. Move AI service initialization to lazy-load
3. Ensure DATABASE_URL is set correctly
4. Check logs for hung processes

### Problem: "listen EADDRINUSE: address already in use"

**Cause:** Port 5000 is already in use (dev server running)

**Fix:**
1. Stop the dev server first
2. Or use different port for testing
3. In production, Replit handles port management

### Problem: Logs show "Development mode" in deployment

**Cause:** NODE_ENV not set to production

**Fix:**
1. Add `NODE_ENV=production` to deployment environment variables
2. Or update `.replit` file to use `start-production.js`
3. Verify with: `echo $NODE_ENV` in deployment shell

---

## 📝 Environment Variables

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PORT` | Server port (auto-set by Replit) | `5000` |

### Optional API Keys

| Variable | Service | Purpose |
|----------|---------|---------|
| `GROQ_API_KEY` | Groq Cloud | AI rap generation, transcription |
| `ELEVENLABS_API_KEY` | ElevenLabs | Premium TTS (Turbo models) |
| `OPENAI_API_KEY` | OpenAI | Fallback TTS |
| `CIRCLE_API_KEY` | Circle | Production Arc blockchain |
| `CIRCLE_ENTITY_SECRET` | Circle | Arc wallet management |

### How to Set in Replit Deployment

1. Open deployment settings
2. Navigate to "Environment Variables"
3. Click "Add Variable"
4. Enter name and value
5. Save and redeploy

---

## ✅ Deployment Checklist

Before deploying, verify:

- [ ] `npm run build` completes successfully
- [ ] `dist/index.js` exists (507KB backend bundle)
- [ ] `dist/public/index.html` exists (5.6KB)
- [ ] `dist/public/assets/` contains JS and CSS bundles
- [ ] `.replit` file updated to use `start-production.js`
- [ ] `NODE_ENV=production` set in deployment environment
- [ ] `DATABASE_URL` configured
- [ ] At least one AI service key configured (`GROQ_API_KEY` recommended)

---

## 🎉 Success Indicators

Your deployment is successful when you see:

**In Logs:**
```
🏭 Production mode: Serving pre-built static files from dist/public
✅ Required environment variables present
🤖 AI Services: Groq ✅
serving on 0.0.0.0:5000
```

**In Browser:**
- App loads without errors
- React app is fully interactive
- No Vite client references in console
- All features work correctly

**Health Check:**
- GET `/` returns 200 status
- GET `/api/health` returns healthy status
- Response time < 1 second

---

## 📞 Support

If you continue to have deployment issues:

1. **Check the logs** - Look for error messages and stack traces
2. **Verify environment** - Ensure NODE_ENV=production is set
3. **Test locally** - Run `node start-production.js` to test production mode
4. **Check build** - Make sure `npm run build` completes without errors

---

**Deployment Status:** ✅ READY FOR PRODUCTION

**Last Updated:** November 4, 2025

**Built for:** AI Agents on Arc with USDC Hackathon
