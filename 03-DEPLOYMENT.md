# Deployment Guide

This guide explains what you need to deploy CoG to your own website or hosting platform.

## Required Information

### 1. Environment Variables

You need **one environment variable**:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

**How to get it:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and use it in your environment variables

**Important:** Never commit this key to Git! Always use environment variables.

### 2. Dependencies

All dependencies are listed in `package.json`. Run:
```bash
npm install
```

This installs:
- Next.js 16
- React 19
- TypeScript
- Google Gemini SDK
- SheetJS (Excel export)
- Tailwind CSS

### 3. Node.js Version

Requires **Node.js 18 or higher**.

Check your version:
```bash
node --version
```

## Deployment Steps

### Option 1: Vercel (Recommended - Easiest)

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your GitHub repository

3. **Add Environment Variable**
   - In Vercel project settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_api_key`
   - Click "Deploy"

4. **Done!** Vercel will automatically:
   - Install dependencies
   - Build the project
   - Deploy to a URL like `your-project.vercel.app`

### Option 2: Other Platforms

#### Netlify

1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variable: `GEMINI_API_KEY`

#### Railway / Render

1. Connect GitHub repository
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Add environment variable: `GEMINI_API_KEY`

#### Self-Hosted (VPS/Server)

1. **Clone repository:**
   ```bash
   git clone https://github.com/haomengqi00709/CoG.git
   cd CoG
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local`:**
   ```bash
   echo "GEMINI_API_KEY=your_api_key" > .env.local
   ```

4. **Build:**
   ```bash
   npm run build
   ```

5. **Start:**
   ```bash
   npm start
   ```

6. **Use a process manager** (PM2, systemd, etc.) to keep it running

## Configuration Files

No additional configuration needed! The project uses:
- `next.config.js` - Minimal (defaults work)
- `tsconfig.json` - Already configured
- `package.json` - All dependencies listed

## What Works Out of the Box

✅ **PDF Upload & Analysis** - Works immediately  
✅ **PMC Search** - Uses public NCBI API (no key needed)  
✅ **PMC Paper Analysis** - Works with Gemini API key  
✅ **Excel Export** - Client-side, no server needed  
✅ **All UI Features** - Fully functional

## External Services Used

| Service | API Key Required? | Free Tier? |
|---------|-------------------|------------|
| Google Gemini | ✅ Yes | ✅ Yes (with limits) |
| NCBI PMC | ❌ No | ✅ Yes (public API) |

## Cost Considerations

- **Google Gemini API:** Free tier available, pay-per-use after limits
- **Hosting:** Vercel/Netlify free tier is sufficient for small projects
- **NCBI PMC:** Completely free (public API)

## Troubleshooting

### "GEMINI_API_KEY is missing"
- Make sure environment variable is set in your hosting platform
- For local: Create `.env.local` file
- Restart server after adding environment variable

### Build fails
- Check Node.js version (need 18+)
- Run `npm install` to ensure dependencies are installed
- Check build logs for specific errors

### API errors
- Verify Gemini API key is valid
- Check API quota/limits in Google AI Studio
- Ensure key has proper permissions

## Security Notes

1. **Never commit API keys** to Git
2. **Use environment variables** for all secrets
3. **`.env.local` is in `.gitignore`** - don't remove it
4. **Rotate API keys** if accidentally exposed

## Next Steps After Deployment

1. Test PDF upload functionality
2. Test PMC search functionality
3. Verify Excel export works
4. Check mobile responsiveness
5. Monitor API usage in Google AI Studio

---

**Need help?** Open an issue: https://github.com/haomengqi00709/CoG

