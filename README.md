# Experience Density Index

Concept phase evaluation tool for ultra-luxury hospitality design.

## Deploy to Vercel (10 minutes)

### Prerequisites
- A GitHub account (free): https://github.com
- A Vercel account (free): https://vercel.com (sign up with GitHub)

### Step-by-step

**1. Install Node.js** (if you don't have it)
- Download from https://nodejs.org (LTS version)
- Verify: open Terminal, type `node --version`

**2. Test locally first**
```bash
cd edi-deploy
npm install
npm run dev
```
Open http://localhost:5173 in your browser. You should see the tool.

**3. Push to GitHub**
- Go to https://github.com/new
- Name it `experience-density-index` (or whatever you want)
- Keep it Private if you prefer
- Don't initialize with README (we already have one)
- Then in Terminal:

```bash
cd edi-deploy
git init
git add .
git commit -m "EDI v1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/experience-density-index.git
git push -u origin main
```

**4. Deploy on Vercel**
- Go to https://vercel.com/new
- Click "Import Git Repository"
- Select your `experience-density-index` repo
- Framework: Vite (auto-detected)
- Click "Deploy"
- Wait ~60 seconds
- Done. You get a URL like `experience-density-index.vercel.app`

### Sharing
- Anyone with the link can use it
- To use a custom domain (like edi.yourdomain.com), add it in Vercel → Settings → Domains

### Updating
Every time you push changes to GitHub, Vercel auto-deploys. Edit `src/App.jsx` for any changes to the tool.
