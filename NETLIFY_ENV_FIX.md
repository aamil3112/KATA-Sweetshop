# 🔧 Fix: Frontend Still Using Localhost

## Problem
The frontend is trying to connect to `http://localhost:3001/api` instead of your Render backend URL.

## Solution: Set Netlify Environment Variable

### Step 1: Set Environment Variable in Netlify

1. Go to **Netlify Dashboard** → Your site
2. Click **Site settings** (gear icon)
3. Click **Environment variables** in the left sidebar
4. Click **Add variable**
5. Set:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://kata-sweetshop.onrender.com/api`
6. Click **Save**

⚠️ **Important**: 
- Include `/api` at the end
- Use `https://` (not `http://`)
- No trailing slash after `/api`

### Step 2: Redeploy the Site

**This is critical!** Vite environment variables are baked into the build at build time. You MUST redeploy after setting the variable.

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete (2-5 minutes)

### Step 3: Verify

After redeploy, open your site and check the browser console (F12):
- You should see: `🔗 API Base URL: https://kata-sweetshop.onrender.com/api`
- If you still see `localhost:3001`, the env var wasn't set correctly or the site wasn't redeployed

### Alternative: Quick Test

To verify the environment variable is working, you can temporarily add this to your code:

```typescript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

After redeploy, check the browser console to see what URL is being used.

## Common Mistakes

❌ **Wrong**: `VITE_API_URL = https://kata-sweetshop.onrender.com` (missing `/api`)
❌ **Wrong**: `VITE_API_URL = https://kata-sweetshop.onrender.com/api/` (trailing slash)
❌ **Wrong**: Setting the variable but not redeploying
✅ **Correct**: `VITE_API_URL = https://kata-sweetshop.onrender.com/api`

## Still Not Working?

1. **Double-check the variable name**: Must be exactly `VITE_API_URL` (case-sensitive)
2. **Check for typos**: Make sure the Render URL is correct
3. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Check build logs**: In Netlify Deploys, check if the build succeeded
5. **Verify Render is running**: Visit `https://kata-sweetshop.onrender.com/health`

