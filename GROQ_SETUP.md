# 🚀 Groq API Setup Instructions

## Quick Setup (2 minutes)

### 1. Create `.env` file in project root
Create a new file called `.env` in the same folder as `package.json`

### 2. Add your Groq API key
```env
VITE_GROQ_API_KEY=your_api_key_here
```

### 3. Get your Groq API key
- Go to: https://console.groq.com/keys
- Sign up/login (it's free!)
- Click "Create API Key"
- Copy the key
- Paste it into your `.env` file

### 4. Restart the dev server
```bash
npm run dev
```

## That's it! 🎉

Your AI Sales Challenge now uses **Groq with Llama 3.1** for:
- ⚡ **10x faster responses** (< 1 second)
- 💬 **More natural conversations**
- 🎭 **Better buyer personalities**
- 🚫 **No more "..." errors**

## Example `.env` file
```env
VITE_GROQ_API_KEY=gsk_1234567890abcdefghijklmnopqrstuvwxyz
```

## Troubleshooting

**"API key not found" error?**
- Make sure the file is named exactly `.env` (with the dot)
- Make sure it's in the root folder (next to package.json)
- Restart the dev server after creating .env

**Still not working?**
- Check console for errors (F12)
- Make sure your API key is valid
- Try regenerating a new API key from Groq console

