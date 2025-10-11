# API Setup Guide - Fresh Start

## 🔑 Setting Up Your Groq API Key

### Step 1: Get Your Free API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up for a free account (if you don't have one)
3. Create a new API key
4. Copy the API key

### Step 2: Create Environment File
1. Create a new file called `.env` in the project root
2. Add your API key to the file:

```bash
VITE_GROQ_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your real API key from Groq.

### Step 3: Restart the Development Server
1. Stop the current server (Ctrl+C)
2. Run `npm run dev` again
3. The app will now use your fresh API key

## 🚀 What's Fixed

- ✅ **Removed all old API keys** from the app
- ✅ **Fixed AI analysis error** messages
- ✅ **Improved error handling** for better user feedback
- ✅ **Clean setup** for fresh API key integration

## 🔧 Error Messages Now Show:

- **No API key**: "API key not configured. Please add your Groq API key to the .env file."
- **Invalid API key**: "API key not configured. Please add your Groq API key to the .env file."
- **Rate limit**: "Rate limit exceeded. Please wait a moment and try again."
- **Timeout**: "Request timed out. Please try again."
- **JSON error**: "AI response format error. Please try again."

## 📝 Example .env File

```bash
# Marketing Simulator - Environment Variables
VITE_GROQ_API_KEY=gsk_your_actual_groq_api_key_here
```

## ⚠️ Security Notes

- Never commit your `.env` file to version control
- Keep your API key private
- The `.env` file is already in `.gitignore`

## 🎯 Ready to Use

Once you add your API key:
1. All marketing labs will work perfectly
2. AI persona generation will work
3. AI analysis will work
4. Sales Challenge will work

**Your marketing simulator is ready for students!** 🎓✨
