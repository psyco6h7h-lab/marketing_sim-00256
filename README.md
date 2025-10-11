<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1iSWUE_Z_PVI3ifGXVCIMBdPzW2VlJr8Z

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your Groq API key:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
   Get your FREE API key from: https://console.groq.com/keys
   
   **Why Groq?** 10x faster AI responses with Llama 3.1 for natural conversations!

3. Run the app:
   ```bash
   npm run dev
   ```
