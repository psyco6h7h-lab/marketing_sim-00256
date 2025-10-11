# 🔧 Netlify Blank Screen Fix

## **Issue Identified:**
Your site at https://marketingsm.netlify.app/ shows a blank screen because the CSS isn't loading properly in production.

---

## **Root Cause:**
The app uses Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`), which works in development but can cause issues in production, especially with CSP (Content Security Policy) headers.

---

## **Immediate Fix for Netlify:**

### **Option 1: Check Environment Variable (Most Likely Issue)**

Your API key might not be set correctly in Netlify:

1. **Go to Netlify Dashboard:**
   - Site settings → Environment variables

2. **Verify you have:**
   - **Key:** `VITE_GROQ_API_KEY`
   - **Value:** Your actual Groq API key (not "your_groq_api_key_here")

3. **After adding/fixing, redeploy:**
   - Deploys → Trigger deploy → **Clear cache and deploy site**

---

### **Option 2: Check Build Logs**

1. Go to your Netlify dashboard
2. Click on "Deploys"
3. Click on the latest deploy
4. Check the build logs for errors

**Common issues:**
- Missing dependencies
- Build command failed
- Environment variable not found
- Asset loading errors

---

### **Option 3: Add Error Logging**

To see what's actually happening, we need to check the browser console:

1. **Open your site:** https://marketingsm.netlify.app/
2. **Open browser DevTools:**
   - Chrome/Edge: Press `F12` or `Ctrl+Shift+I`
   - Firefox: Press `F12`
   - Safari: Enable Developer menu, then press `Cmd+Option+I`
3. **Go to "Console" tab**
4. **Look for errors** (they'll be in red)

**Common errors you might see:**
- `Failed to load module` - Build issue
- `[API key error]` - Environment variable missing
- `Cannot read property of undefined` - JavaScript error
- `Refused to load script` - CSP/CORS issue

---

## **Quick Diagnostic Checklist:**

Check these in order:

### ✅ **1. Build Settings in Netlify:**
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 or higher

### ✅ **2. Environment Variables:**
- **VITE_GROQ_API_KEY** is set with your actual key
- No extra spaces in the key
- Redeployed after adding the variable

### ✅ **3. _redirects File:**
- File exists in repository
- Contains: `/*    /index.html   200`

### ✅ **4. Browser Console:**
- No red error messages
- No "404 Not Found" for assets
- No "Failed to fetch" errors

---

## **Most Common Fixes:**

### **Fix 1: Environment Variable Not Set**
**Symptoms:** Blank page, no console errors, or "API key not configured" error

**Solution:**
1. Netlify Dashboard → Site settings → Environment variables
2. Add: `VITE_GROQ_API_KEY` = `[your actual key]`
3. Deploys → Trigger deploy → Clear cache and deploy site

---

### **Fix 2: Build Failed**
**Symptoms:** Site shows old version or "Page not found"

**Solution:**
1. Check deploy logs for errors
2. Common issues:
   - Missing `package-lock.json` - Run `npm install` locally
   - Node version mismatch - Set in netlify.toml
   - TypeScript errors - Run `npm run build` locally to fix

---

### **Fix 3: Routing Issues**
**Symptoms:** Home page works but other pages show 404

**Solution:**
1. Ensure `_redirects` file exists
2. Content should be: `/*    /index.html   200`
3. Or ensure `netlify.toml` has redirect rules

---

### **Fix 4: CSP/CORS Issues**
**Symptoms:** Console shows "Refused to load" or "CORS policy" errors

**Solution:**
The Tailwind CDN might be blocked. This is fixed by using the built-in configuration in `netlify.toml`.

---

## **Debugging Steps:**

### **Step 1: Check if Build is Successful**
```bash
# Run locally
npm run build

# Check if dist/ folder is created
# Check if dist/index.html exists
# Check if dist/assets/ has JS files
```

### **Step 2: Test Build Locally**
```bash
# Install serve globally
npm install -g serve

# Serve the built files
serve -s dist

# Open http://localhost:3000
# If it works locally but not on Netlify, it's a deployment issue
```

### **Step 3: Check Netlify Deploy**
1. Go to: https://app.netlify.com/sites/marketingsm/deploys
2. Click latest deploy
3. Look for:
   - ✅ "Site is live" message
   - ❌ Any errors in build log
   - ✅ All assets uploaded

---

## **What to Share for Help:**

If the issue persists, share:
1. **Browser console errors** (screenshot or text)
2. **Netlify build log** (last 50 lines)
3. **Network tab** showing failed requests
4. **Environment variables** (just confirm they're set, don't share the actual key)

---

## **Expected Working State:**

When working correctly:
- ✅ Homepage loads with Dashboard
- ✅ Sidebar visible on the left
- ✅ Can navigate to different pages
- ✅ Dark mode toggle works
- ✅ No console errors (except Tailwind CDN warning, which is okay)

---

## **Emergency Workaround:**

If nothing works, try this:

1. **Fork the repository** to create a clean copy
2. **Delete the Netlify site** and create a new one
3. **Connect the new repository**
4. **Set environment variables** immediately
5. **Deploy**

Sometimes a fresh deployment fixes mysterious issues!

---

## **Contact Points:**

- **Netlify Support:** https://answers.netlify.com/
- **Netlify Status:** https://www.netlifystatus.com/
- **Vite Docs:** https://vitejs.dev/guide/static-deploy.html#netlify

---

## **Next Steps:**

1. Check browser console for errors
2. Verify environment variable is set
3. Trigger a fresh deploy with "Clear cache"
4. Share any error messages you see

The app works perfectly locally, so it's definitely a deployment configuration issue that we can fix! 🔧
