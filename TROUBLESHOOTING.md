# 🔧 Troubleshooting "Cannot GET" Error

## Issue
Getting "cannot GET" error when trying to access the backend API.

## Quick Checks

### 1. Verify Backend is Running
Visit: `https://kata-sweetshop.onrender.com/health`

You should see:
```json
{"status":"ok","message":"Sweet Shop API is running"}
```

If you get an error or timeout:
- **Free tier on Render**: The service spins down after 15 minutes of inactivity
- **First request takes 30-50 seconds** to wake up the service
- Wait 30-60 seconds and try again

### 2. Check Netlify Environment Variable

In Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Verify `VITE_API_URL` is set to:
   ```
   https://kata-sweetshop.onrender.com/api
   ```
   ⚠️ **Important**: Include `/api` at the end, but **NOT** `/api/api`

3. **Redeploy** the frontend after changing environment variables:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

### 3. Check Render Environment Variables

In Render Dashboard:
1. Go to your service → **Environment** tab
2. Verify these are set:
   ```
   MONGODB_URI = mongodb+srv://sweetshop:Aamil%403112@cluster0.o9kgphp.mongodb.net/sweet_shop?retryWrites=true&w=majority
   JWT_SECRET = (any secure random string, 32+ characters)
   PORT = 10000
   NODE_ENV = production
   FRONTEND_URL = https://incubyte-sweetshop.netlify.app
   ```

### 4. Test API Endpoints Directly

Open browser console on your Netlify site and run:

```javascript
// Test health check
fetch('https://kata-sweetshop.onrender.com/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test API endpoint
fetch('https://kata-sweetshop.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### 5. Check Browser Console

Open browser DevTools (F12) → **Console** tab:
- Look for CORS errors
- Look for network errors
- Check the actual URL being called

### 6. Common Issues

#### Issue: Backend is sleeping (free tier)
**Solution**: Wait 30-60 seconds for first request, or upgrade Render plan

#### Issue: CORS error
**Solution**: Make sure `FRONTEND_URL` in Render includes your Netlify URL

#### Issue: Wrong API URL
**Solution**: 
- Netlify `VITE_API_URL` should be: `https://kata-sweetshop.onrender.com/api`
- Frontend will call: `https://kata-sweetshop.onrender.com/api/auth/register` ✅

#### Issue: Environment variable not loaded
**Solution**: 
- Netlify requires a **redeploy** after changing environment variables
- Go to Deploys → Trigger deploy

### 7. Verify Build Logs

**Render**:
- Check **Logs** tab for errors
- Look for MongoDB connection errors
- Check if build completed successfully

**Netlify**:
- Check **Deploy logs** for build errors
- Verify `VITE_API_URL` is being used correctly

## Still Not Working?

1. **Check Render service status**: Is it "Live" or "Sleeping"?
2. **Check Render logs**: Any errors in the logs?
3. **Test backend directly**: Visit `https://kata-sweetshop.onrender.com/health`
4. **Check browser network tab**: What's the actual error response?

