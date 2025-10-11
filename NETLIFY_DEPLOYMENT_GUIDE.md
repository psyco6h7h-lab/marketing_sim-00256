# 🚀 Netlify Deployment Guide - Marketing Basics Simulator

## **Complete Step-by-Step Deployment Instructions**

---

## **📋 Prerequisites**

Before deploying to Netlify, ensure you have:
- ✅ A Netlify account (free at [netlify.com](https://netlify.com))
- ✅ A Groq API key (get one at [console.groq.com](https://console.groq.com/keys))
- ✅ This repository pushed to GitHub

---

## **🎯 Method 1: Deploy via Netlify Dashboard (Recommended)**

### **Step 1: Connect to Netlify**

1. **Log in to Netlify:**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Sign in with your GitHub account

2. **Create New Site:**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"

3. **Select Repository:**
   - Find and select `psyco6h7h-lab/marketing_sim`
   - Click "Install Netlify" if prompted

### **Step 2: Configure Build Settings**

Netlify should auto-detect these settings (verify they're correct):

```
Build command: npm run build
Publish directory: dist
```

### **Step 3: Add Environment Variables**

**CRITICAL:** Add your Groq API key:

1. Before clicking "Deploy site", scroll down to "Site settings"
2. Or after deployment, go to: **Site settings → Environment variables**
3. Click "Add a variable"
4. Add:
   ```
   Key: VITE_GROQ_API_KEY
   Value: [paste your Groq API key here]
   ```
5. Click "Create variable"

### **Step 4: Deploy!**

1. Click "Deploy site"
2. Wait 2-3 minutes for the build to complete
3. Your site will be live at: `https://[random-name].netlify.app`

### **Step 5: Custom Domain (Optional)**

1. Go to **Site settings → Domain management**
2. Click "Add custom domain"
3. Follow the instructions to connect your domain

---

## **🎯 Method 2: Deploy via Netlify CLI**

### **Step 1: Install Netlify CLI**

```bash
npm install -g netlify-cli
```

### **Step 2: Login to Netlify**

```bash
netlify login
```

### **Step 3: Initialize Site**

```bash
netlify init
```

Follow the prompts:
- Create & configure a new site
- Choose your team
- Enter site name (or leave blank for random name)

### **Step 4: Set Environment Variable**

```bash
netlify env:set VITE_GROQ_API_KEY "your_groq_api_key_here"
```

### **Step 5: Deploy**

```bash
netlify deploy --prod
```

---

## **🔧 Configuration Files Included**

### **1. `netlify.toml`**
- Build settings
- Redirect rules for SPA routing
- Security headers
- Cache optimization
- Performance settings

### **2. `_redirects`**
- Ensures all routes work with React Router
- Prevents 404 errors on page refresh

### **3. `env.example`**
- Template for environment variables
- Instructions for Groq API key

---

## **✅ Post-Deployment Checklist**

After deployment, verify:

1. **✅ Site is live** - Visit your Netlify URL
2. **✅ All pages load** - Test navigation:
   - Dashboard
   - Learn Marketing
   - Marketing Quiz
   - All 6 Labs (Segmentation, Targeting, Positioning, Product, Pricing, Promotion)
   - Sales Challenge
3. **✅ AI features work** - Test:
   - Analyze button in Segmentation Lab
   - AI Persona Generator
   - Sales Challenge conversations
   - Quiz generation
4. **✅ Dark mode works** - Toggle theme
5. **✅ Mobile responsive** - Check on mobile devices
6. **✅ No console errors** - Open browser DevTools

---

## **🔍 Troubleshooting**

### **Issue: "AI features not working"**

**Solution:**
1. Verify `VITE_GROQ_API_KEY` is set in Netlify
2. Go to: Site settings → Environment variables
3. Check the key is correct (no extra spaces)
4. Redeploy: Deploys → Trigger deploy → Clear cache and deploy site

### **Issue: "404 on page refresh"**

**Solution:**
- The `netlify.toml` and `_redirects` files should handle this
- Verify they exist in your repository
- Redeploy if needed

### **Issue: "Build failed"**

**Solution:**
1. Check the build logs in Netlify
2. Common fixes:
   - Ensure Node version is 18+ (set in `netlify.toml`)
   - Run `npm install` locally to verify dependencies
   - Check for TypeScript errors: `npm run build`

### **Issue: "Environment variable not found"**

**Solution:**
1. Environment variables must start with `VITE_` for Vite apps
2. After adding variables, trigger a new deploy
3. Don't use `.env` file on Netlify (use dashboard instead)

---

## **⚡ Performance Optimization**

The app is already optimized with:

- ✅ **Code splitting** - Smaller bundle sizes
- ✅ **Lazy loading** - Faster initial load
- ✅ **Asset caching** - CDN acceleration
- ✅ **Compression** - Gzip/Brotli enabled
- ✅ **Tree shaking** - Remove unused code
- ✅ **Minification** - Smaller file sizes

### **Expected Performance:**
- **Load time:** < 3 seconds
- **Lighthouse score:** 90+
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s

---

## **🔒 Security Features**

Included security headers:
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: enabled
- ✅ Referrer-Policy: strict-origin
- ✅ Permissions-Policy: restricted

---

## **💰 Netlify Free Tier Limits**

Perfect for this app:
- ✅ **Bandwidth:** 100 GB/month
- ✅ **Build minutes:** 300 minutes/month
- ✅ **Sites:** Unlimited
- ✅ **Concurrent builds:** 1
- ✅ **Deploy previews:** Unlimited

This should be more than enough for educational use!

---

## **🎓 Student Access**

Once deployed, share your Netlify URL with students:

```
https://your-site-name.netlify.app
```

Or with a custom domain:
```
https://marketing-simulator.yourdomain.com
```

Students can:
- Access all features without setup
- No API key needed (it's server-side)
- Works on any device
- No installation required

---

## **🔄 Continuous Deployment**

Netlify automatically redeploys when you push to GitHub:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. Netlify automatically:
   - Detects the push
   - Runs the build
   - Deploys the new version
   - Takes ~2-3 minutes

---

## **📊 Monitoring & Analytics**

### **Built-in Netlify Analytics:**
- Pageviews
- Unique visitors
- Top pages
- Geographic data
- Bandwidth usage

### **Enable Analytics:**
1. Go to Site settings → Analytics
2. Enable Netlify Analytics ($9/month)
3. Or integrate free Google Analytics

---

## **🆘 Support Resources**

- **Netlify Docs:** https://docs.netlify.com
- **Groq API Docs:** https://console.groq.com/docs
- **Vite Docs:** https://vitejs.dev
- **React Router Docs:** https://reactrouter.com

---

## **✨ Your Site is Production-Ready!**

The Marketing Basics Simulator is now:
- ✅ **Fast** - Optimized for performance
- ✅ **Secure** - Protected with security headers
- ✅ **Reliable** - Hosted on Netlify's global CDN
- ✅ **Scalable** - Handles thousands of users
- ✅ **Professional** - Custom domain ready
- ✅ **Automated** - Continuous deployment from GitHub

**🎉 Happy teaching and learning!**
