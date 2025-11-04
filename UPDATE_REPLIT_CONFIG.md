# ⚙️ Update .replit Configuration for Production Deployment

## Quick Fix (1 Minute)

To enable production deployment, you need to update your `.replit` file to use the production start script.

### Step 1: Open .replit File

Click on the `.replit` file in your file explorer on the left side of Replit.

### Step 2: Find the Deployment Section

Look for this section around line 9:

```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]
```

### Step 3: Change the Run Command

Replace:
```toml
run = ["npm", "run", "start"]
```

With:
```toml
run = ["node", "start-production.js"]
```

### Step 4: Add Environment Variable (Optional but Recommended)

Add this new section right after the `[deployment]` section:

```toml
[deployment.env]
NODE_ENV = "production"
```

### Complete Updated Section Should Look Like:

```toml
[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["node", "start-production.js"]

[deployment.env]
NODE_ENV = "production"
```

### Step 5: Save the File

Press `Ctrl+S` (or `Cmd+S` on Mac) to save the file.

### Step 6: Deploy!

Click the "Deploy" button in Replit and your app will:
1. Build automatically (`npm run build`)
2. Use the production start script
3. Run in production mode ✅
4. Serve static files correctly ✅

---

## Verification

After deployment, check the logs for:

```
🚀 RapBots AI - Production Startup Script
🔧 NODE_ENV: production
🏭 Production mode: Serving pre-built static files from dist/public
```

If you see this, **deployment is successful!** 🎉

---

## Full .replit File Reference

For reference, here's what your complete `.replit` file should look like:

```toml
modules = ["nodejs-20", "web", "postgresql-16", "python-3.11"]
run = "npm run dev"
hidden = [".config", ".git", "generated-icon.png", "node_modules", "dist"]

[nix]
channel = "stable-24_05"
packages = ["antlr", "ffmpeg", "ffmpeg-full", "imagemagickBig", "jq", "jre", "libGL", "libGLU", "libjpeg_turbo", "libpng", "libsndfile", "libxcrypt", "pkg-config", "which", "xsimd", "python311Packages.numpy", "python311Packages.scipy", "python311Packages.torch", "python311Packages.torchaudio", "python311Packages.transformers", "python311Packages.huggingface-hub", "gcc-unwrapped", "glibc"]

[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["node", "start-production.js"]

[deployment.env]
NODE_ENV = "production"

[env]
PORT = "5000"

[workflows]
runButton = "Project"

[[workflows.workflow]]
name = "Project"
mode = "parallel"
author = "agent"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "Start application"

[[workflows.workflow]]
name = "Start application"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 5000

[[workflows.workflow]]
name = "Restart Application"
author = 23051396
mode = "sequential"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "pkill -f \"tsx server/index.ts\" || true"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "sleep 2"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "NODE_OPTIONS=\"--max-old-space-size=4096\" npm run dev"

[agent]
integrations = ["javascript_log_in_with_replit:1.0.0"]

[[ports]]
localPort = 5000
externalPort = 80

[[ports]]
localPort = 36301
externalPort = 3000

[[ports]]
localPort = 36817
externalPort = 3002

[[ports]]
localPort = 44085
externalPort = 3001
```

**Key changes from original:**
- Line 11-12: `run = ["node", "start-production.js"]`
- Line 14-15: New `[deployment.env]` section with `NODE_ENV = "production"`

---

That's it! Your deployment will now work correctly. 🚀
