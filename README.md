# SOP Training System v2.0

An AI-powered tool that transforms Standard Operating Procedure documents into complete, personalised training modules using **Gemini 2.5 Flash Lite** + **Google Text-to-Speech**.

---

## Features

- **PDF + Text support** — Upload `.pdf`, `.txt`, `.md` or paste directly
- **Specific, grounded output** — Gemini extracts actual tool names, timelines, thresholds from your SOP — zero generic filler
- **Trainee personalisation** — Optional role, experience level, and background fields; output marks personalised sections with ✦
- **4-section training output** — Executive Summary · Key Takeaways · Training Steps · Evaluation Quiz
- **Slide export** — Downloads a professional `.pptx` deck (Swiss design, one section per slide)- **Quiz with section references** — Every answer cites the SOP section it came from

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

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API keys

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

**Gemini API key** → https://aistudio.google.com/app/apikey (free tier available)



### 3. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Build for production

```bash
npm run build
```

---

## Deploy to Vercel

```bash
npm run build
npx vercel
```

Add both environment variables in Vercel → Project Settings → Environment Variables.

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
│   ├── gemini.js           # Gemini 1.5 Pro API + highly specific prompt
│   ├── pdfExtractor.js     # Browser-native PDF text extraction via pdfjs-dist
│   ├── pptxExport.js       # Full PPTX generation with Swiss design
│   └── tts.js              # Google TTS narration generation + download
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
