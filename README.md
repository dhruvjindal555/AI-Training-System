# SOP Training System v2.0

An AI-powered tool that transforms Standard Operating Procedure documents into complete, personalised training modules using **Gemini 2.5 Flash Lite**.

🔗 **Live Demo → [ai-training-system-iota.vercel.app](https://ai-training-system-iota.vercel.app/)**

---

## Features

- **PDF + Text support** — Upload `.pdf`, `.txt`, `.md` or paste directly
- **Specific, grounded output** — Gemini extracts actual tool names, timelines, thresholds from your SOP — zero generic filler
- **Trainee personalisation** — Optional role, experience level, and background fields; output marks personalised sections with ✦
- **4-section training output** — Executive Summary · Key Takeaways · Training Steps · Evaluation Quiz
- **Slide export** — Downloads a professional `.pptx` deck (Swiss design, one section per slide)
- **Quiz with section references** — Every answer cites the SOP section it came from

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 |
| AI | Gemini 2.5 Flash Lite (`@google/generative-ai`) |
| PDF Parsing | `pdfjs-dist` (browser-native, no backend) |
| Slides | `pptxgenjs` |
| Icons | Lucide React |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dhruvjindal555/AI-Training-System.git
cd AI-Training-System
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API key

Copy the example env file:

```bash
cp .env.example .env
```

Open `.env` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

Get your key at → https://aistudio.google.com/app/apikey (free tier available)

> ⚠️ Never commit your `.env` file. It's already in `.gitignore` so you're safe as long as you don't force-add it.

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 5. Build for production

```bash
npm run build
```

---

## Pushing to GitHub

If you cloned this repo and want to push it to your own GitHub account:

### First time setup

```bash
# 1. Create a new repo on github.com (don't initialise with README)

# 2. Remove the original remote
git remote remove origin

# 3. Add your own repo as the remote
git remote add origin https://github.com/your-username/AI-Training-System.git

# 4. Push
git push -u origin master
```

### If you downloaded the zip instead of cloning

```bash
cd AI-Training-System

# Initialise git
git init

# Add all files
git add .
 
# First commit
git commit -m "initial commit"

# Add your GitHub repo as remote (create it on github.com first)
git remote add origin https://github.com/your-username/AI-Training-System.git

# Push
git push -u origin master
```

### For future updates

```bash
git add .
git commit -m "your message here"
git push
```

---

## Deploy to Vercel

Easiest way — connect your GitHub repo directly to Vercel:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. In the **Environment Variables** section add:
   - `VITE_GEMINI_API_KEY` → your Gemini API key
4. Click Deploy

That's it. Every push to `main` will auto-deploy.

**Or deploy via CLI:**

```bash
npm run build
npx vercel
```

Then add `VITE_GEMINI_API_KEY` in Vercel → Project Settings → Environment Variables.

---

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Sticky header with live clock
│   ├── InputPanel.jsx      # File upload, paste, personalization, options
│   ├── LoadingPanel.jsx    # Animated 5-step progress tracker
│   ├── EmptyState.jsx      # Placeholder when no output yet
│   └── ResultPanel.jsx     # Full training output + all export buttons
├── hooks/
│   └── useTraining.js      # State machine: idle → loading → success/error
├── lib/
│   ├── gemini.js           # Gemini 2.5 Flash Lite API + highly specific prompt
│   ├── pdfExtractor.js     # Browser-native PDF text extraction via pdfjs-dist
│   └── pptxExport.js       # Full PPTX generation with Swiss design
├── App.jsx                 # Main layout and routing
├── main.jsx                # React entry point
└── index.css               # Tailwind directives + scrollbar styles
```

---

## How Personalisation Works

When a trainee fills in their **role**, **experience level**, or **background**:

1. Gemini receives the trainee profile alongside the SOP
2. It tailors language complexity, examples, and analogies to that person
3. Any section that was personalised gets `"personalized": true` in the JSON
4. The UI renders a ✦ **personalized** badge next to those specific sections

This means two people with different roles reading the same SOP get different training content from the same document.

---

## Common Issues

**`npm install` fails** — Make sure you're on Node.js 18 or higher. Run `node -v` to check.

**PDF text comes out blank** — Some PDFs are scanned images, not text-based. Try copy-pasting the content manually instead.

**Gemini returns a parse error** — Usually happens if the SOP is very short or has no clear structure. Add more content and try again.

**PPTX export fails** — Check the browser console for errors. If it's a memory issue, try with a shorter SOP first.
