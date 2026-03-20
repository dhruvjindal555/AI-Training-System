import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export async function generateTrainingContent({ sopText, role, experienceLevel, background, depth, quizCount }) {
  if (!API_KEY || API_KEY === 'your-gemini-api-key-here') {
    throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.')
  }

  const genAI = new GoogleGenerativeAI(API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

  const hasPersonalization = role || experienceLevel || background

  const personalizationBlock = hasPersonalization ? `
TRAINEE PROFILE (use this to personalize ALL content):
${role ? `- Role/Job Title: ${role}` : ''}
${experienceLevel ? `- Experience Level: ${experienceLevel}` : ''}
${background ? `- Background/Prior Knowledge: ${background}` : ''}

Personalization rules:
- Tailor examples to the trainee's role where applicable
- Adjust language complexity to experience level (beginner = simple language + more context; expert = concise + technical)
- Reference their background when making analogies
- In each trainingStep, if you used their profile to personalize it, set "personalized": true
- In the summary, if you tailored it, set "personalizedSummary": true
` : 'No trainee profile provided — write for a general audience.'

  const prompt = `You are a senior instructional designer creating a professional training module from an SOP document.

Your output must be SPECIFIC to this exact document. Do not write generic filler. Every point, step, and question must reference actual content from the SOP — real procedure names, real timelines, real tools, real role names, real thresholds mentioned in the document.

${personalizationBlock}

SOP DOCUMENT:
---
${sopText}
---

INSTRUCTIONS:
- Detail level: ${depth} (standard = 4-6 steps, detailed = 6-8 steps)
- Quiz questions: exactly ${quizCount}
- quizCount for narration: generate a spoken narration script per slide (2-4 sentences, natural speech, like a trainer speaking)

Respond ONLY with a single valid JSON object. No markdown fences. No explanation. No preamble.

{
  "title": "Specific title derived from the SOP title or topic — not generic",
  "department": "Exact department name from the document or clearly inferred",
  "sopNumber": "SOP number if present in doc, else null",
  "version": "Version number if present, else null",
  "personalizedSummary": false,
  "summary": "3-4 sentences. Must name the specific process, who it applies to, what the key outcomes are, and why it matters to the organization. Zero generic statements.",
  "summaryNarration": "Spoken version of the summary for audio narration. 3-4 natural sentences a trainer would say out loud.",
  "keyPoints": [
    {
      "point": "Single sentence. Must reference a specific rule, threshold, tool, or requirement from the document.",
      "personalized": false
    }
  ],
  "trainingSteps": [
    {
      "title": "Action-oriented title using the actual terminology from the SOP",
      "description": "2-3 sentences. Must include: what exactly to do, specific tools/systems/forms named in the SOP, any time limits or thresholds, who is responsible. No vague language.",
      "tag": "One word from: Setup | Execute | Review | Verify | Approve | Escalate | Communicate | Document",
      "narration": "2-4 sentences spoken by a trainer explaining this step. Conversational tone. Reference specific details.",
      "personalized": false
    }
  ],
  "quizQuestions": [
    {
      "question": "Question that tests a specific fact, threshold, or procedure from the SOP. Not a general question.",
      "answer": "Direct, specific answer. Include the exact value/name/timeframe from the document.",
      "difficulty": "easy | medium | hard",
      "referencedSection": "Section or clause number from the SOP this question is based on"
    }
  ],
  "slideNarrations": {
    "intro": "Opening narration for the title slide. Welcome the trainee, state the SOP name, and what they will learn.",
    "keyPoints": "Narration for the key takeaways slide.",
    "steps": "Narration introducing the training steps section.",
    "quiz": "Narration introducing the evaluation section.",
    "close": "Closing narration. Summarize what was covered and next steps for the trainee."
  }
}

QUALITY CHECK — before finalizing, verify:
- Every keyPoint references something explicitly in the SOP
- Every trainingStep names a real tool, system, form, or role from the document
- Every quiz answer includes a specific value or name from the SOP
- No step says 'follow the appropriate process' or any other vague placeholder`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim().replace(/^```json|^```|```$/gm, '').trim()

  try {
    return JSON.parse(text)
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
    throw new Error('Failed to parse Gemini response. Please try again.')
  }
}
