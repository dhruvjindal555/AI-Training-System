export async function exportToPPTX(result) {
  const PptxGenJS = (await import('pptxgenjs')).default
  const prs = new PptxGenJS()

  const INK     = '0d0d0b'
  const PAPER   = 'f2f0ea'
  const MUTED   = '9a9688'
  const ACCENT  = '1a3a6b'
  const GREEN   = '1a5c38'
  const GREEN_BG= 'edf5f0'
  const RULE    = 'd8d4c8'

  prs.layout = 'LAYOUT_WIDE'       
  prs.author = 'SOP Training System'
  prs.title  = result.title

  const W = 13.33
  const H = 7.5

  const addRule = (slide, y) => {
    slide.addShape(prs.ShapeType.rect, {
      x: 0.6, y, w: W - 1.2, h: 0.005,
      fill: { color: RULE }, line: { color: RULE, pt: 0 },
    })
  }

  const addLabel = (slide, text, y = 0.35) => {
    slide.addText(text.toUpperCase(), {
      x: 0.6, y, w: 4, h: 0.2,
      fontSize: 7, fontFace: 'Courier New', color: MUTED,
      charSpacing: 3,
    })
  }

  const addBadge = (slide, letter, x = 0.6, y = 1.1) => {
    slide.addText(letter, {
      x, y, w: 0.35, h: 0.35,
      fontSize: 10, bold: true, color: PAPER,
      fill: { color: INK }, align: 'center', valign: 'middle',
    })
  }

  const s1 = prs.addSlide()
  s1.background = { color: INK }

  s1.addText('SOP / TRAINING MODULE', {
    x: 0.7, y: 0.5, w: W - 1.4, h: 0.25,
    fontSize: 8, fontFace: 'Courier New', color: MUTED,
    charSpacing: 4,
  })

  s1.addText(result.title, {
    x: 0.7, y: 1.2, w: W - 1.4, h: 3,
    fontSize: 46, bold: true, color: PAPER,
    fontFace: 'Arial', charSpacing: -1,
    breakLine: true,
  })

  const metaItems = [
    result.department,
    result.sopNumber ? `SOP ${result.sopNumber}` : null,
    result.version   ? `v${result.version}` : null,
    new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
  ].filter(Boolean).join('   ·   ')

  s1.addText(metaItems, {
    x: 0.7, y: H - 1.1, w: W - 1.4, h: 0.3,
    fontSize: 9, fontFace: 'Courier New', color: MUTED,
  })

  s1.addShape(prs.ShapeType.rect, {
    x: 0, y: H - 0.08, w: W, h: 0.08,
    fill: { color: ACCENT }, line: { color: ACCENT, pt: 0 },
  })

  const s2 = prs.addSlide()
  s2.background = { color: PAPER }
  addLabel(s2, `${result.sopNumber || 'SOP'} — Executive Summary`)
  addRule(s2, 0.65)

  s2.addText('Executive Summary', {
    x: 0.6, y: 0.8, w: W - 1.2, h: 0.6,
    fontSize: 28, bold: true, color: INK, fontFace: 'Arial',
  })

  addBadge(s2, 'A', 0.6, 1.55)

  s2.addText(result.summary, {
    x: 1.1, y: 1.5, w: W - 1.8, h: 3.5,
    fontSize: 15, color: '4a4845', fontFace: 'Georgia',
    italic: true, lineSpacingMultiple: 1.5,
  })

  if (result.personalizedSummary) {
    s2.addText('✦ Personalized for your role', {
      x: 0.6, y: H - 0.8, w: 4, h: 0.25,
      fontSize: 8, color: ACCENT, fontFace: 'Courier New', charSpacing: 2,
    })
  }

  addRule(s2, H - 0.45)
  s2.addText(`${result.title}  ·  Slide 2`, {
    x: 0.6, y: H - 0.38, w: W - 1.2, h: 0.2,
    fontSize: 7, fontFace: 'Courier New', color: MUTED,
  })

  const s3 = prs.addSlide()
  s3.background = { color: PAPER }
  addLabel(s3, 'Key Takeaways')
  addRule(s3, 0.65)

  s3.addText('Key Takeaways', {
    x: 0.6, y: 0.8, w: W - 1.2, h: 0.6,
    fontSize: 28, bold: true, color: INK, fontFace: 'Arial',
  })

  addBadge(s3, 'B', 0.6, 1.55)

  const points = (result.keyPoints || []).slice(0, 4)
  points.forEach((kp, i) => {
    const yPos = 1.55 + i * 1.15
    s3.addText(String(i + 1).padStart(2, '0'), {
      x: 1.15, y: yPos, w: 0.5, h: 0.4,
      fontSize: 11, fontFace: 'Courier New', color: RULE, bold: true,
    })
    s3.addText(kp.point, {
      x: 1.65, y: yPos, w: W - 2.5, h: 0.4,
      fontSize: 13, color: INK, fontFace: 'Arial',
      lineSpacingMultiple: 1.3,
    })
    if (kp.personalized) {
      s3.addText('✦ personalized', {
        x: W - 2.2, y: yPos, w: 1.6, h: 0.25,
        fontSize: 7, color: ACCENT, fontFace: 'Courier New', align: 'right', charSpacing: 1,
      })
    }
    if (i < points.length - 1) addRule(s3, yPos + 0.55)
  })

  addRule(s3, H - 0.45)
  s3.addText(`${result.title}  ·  Slide 3`, {
    x: 0.6, y: H - 0.38, w: W - 1.2, h: 0.2,
    fontSize: 7, fontFace: 'Courier New', color: MUTED,
  })

  const steps = result.trainingSteps || []
  const STEPS_PER_SLIDE = 2
  const stepSlideCount = Math.ceil(steps.length / STEPS_PER_SLIDE)

  for (let si = 0; si < stepSlideCount; si++) {
    const slideSteps = steps.slice(si * STEPS_PER_SLIDE, si * STEPS_PER_SLIDE + STEPS_PER_SLIDE)
    const sN = prs.addSlide()
    sN.background = { color: PAPER }

    const slideNum = 4 + si
    addLabel(sN, `Training Steps — ${si * STEPS_PER_SLIDE + 1}–${Math.min((si + 1) * STEPS_PER_SLIDE, steps.length)} of ${steps.length}`)
    addRule(sN, 0.65)

    sN.addText('Training Steps', {
      x: 0.6, y: 0.8, w: 5, h: 0.6,
      fontSize: 28, bold: true, color: INK, fontFace: 'Arial',
    })

    addBadge(sN, 'C', 0.6, 1.55)

    slideSteps.forEach((step, idx) => {
      const globalIdx = si * STEPS_PER_SLIDE + idx
      const colX = idx === 0 ? 1.1 : W / 2 + 0.2
      const colW = W / 2 - 1.0

      sN.addText(String(globalIdx + 1).padStart(2, '0'), {
        x: colX, y: 1.5, w: 0.55, h: 0.7,
        fontSize: 32, fontFace: 'Courier New', color: RULE, bold: false,
      })

      sN.addText(step.title, {
        x: colX, y: 2.2, w: colW, h: 0.55,
        fontSize: 14, bold: true, color: INK, fontFace: 'Arial',
      })

      if (step.tag) {
        sN.addText(step.tag.toUpperCase(), {
          x: colX, y: 2.75, w: 1.2, h: 0.24,
          fontSize: 7, fontFace: 'Courier New', color: MUTED,
          fill: { color: 'e8e5dc' }, align: 'center', charSpacing: 2,
        })
      }

      sN.addText(step.description, {
        x: colX, y: 3.1, w: colW, h: 2.5,
        fontSize: 11.5, color: '4a4845', fontFace: 'Arial',
        lineSpacingMultiple: 1.45, breakLine: true,
      })

      if (step.personalized) {
        sN.addText('✦ personalized for your role', {
          x: colX, y: H - 0.8, w: colW, h: 0.2,
          fontSize: 7, color: ACCENT, fontFace: 'Courier New', charSpacing: 1,
        })
      }

      if (slideSteps.length === 2 && idx === 0) {
        sN.addShape(prs.ShapeType.rect, {
          x: W / 2 - 0.05, y: 1.4, w: 0.005, h: H - 2.2,
          fill: { color: RULE }, line: { color: RULE, pt: 0 },
        })
      }
    })

    addRule(sN, H - 0.45)
    sN.addText(`${result.title}  ·  Slide ${slideNum}`, {
      x: 0.6, y: H - 0.38, w: W - 1.2, h: 0.2,
      fontSize: 7, fontFace: 'Courier New', color: MUTED,
    })
  }

  const quiz = result.quizQuestions || []
  const DIFF_COLORS = { easy: GREEN, medium: '8a5a00', hard: 'c8341e' }

  quiz.forEach((q, i) => {
    const qSlide = prs.addSlide()
    qSlide.background = { color: PAPER }

    const slideNum = 4 + stepSlideCount + i
    addLabel(qSlide, `Evaluation — Question ${i + 1} of ${quiz.length}`)
    addRule(qSlide, 0.65)

    qSlide.addText('Evaluation', {
      x: 0.6, y: 0.8, w: W - 1.2, h: 0.6,
      fontSize: 28, bold: true, color: INK, fontFace: 'Arial',
    })

    addBadge(qSlide, 'D', 0.6, 1.55)

    qSlide.addText(`Q${String(i + 1).padStart(2, '0')}`, {
      x: 1.1, y: 1.55, w: 0.8, h: 0.45,
      fontSize: 11, fontFace: 'Courier New', color: MUTED,
    })

    const diffColor = DIFF_COLORS[q.difficulty] || DIFF_COLORS.medium
    qSlide.addText((q.difficulty || 'medium').toUpperCase(), {
      x: W - 1.8, y: 1.6, w: 1.2, h: 0.3,
      fontSize: 7, fontFace: 'Courier New', color: diffColor,
      fill: { color: 'f2f0ea' },
      line: { color: diffColor, pt: 0.5 },
      align: 'center', charSpacing: 2,
    })

    qSlide.addText(q.question, {
      x: 1.1, y: 2.1, w: W - 1.8, h: 1.5,
      fontSize: 20, bold: true, color: INK, fontFace: 'Arial',
      lineSpacingMultiple: 1.4, breakLine: true,
    })

    addRule(qSlide, 3.85)

    qSlide.addText('ANSWER', {
      x: 1.1, y: 4.0, w: 2, h: 0.25,
      fontSize: 7, fontFace: 'Courier New', color: MUTED, charSpacing: 3,
    })

    qSlide.addText(q.answer, {
      x: 1.1, y: 4.3, w: W - 1.8, h: 1.8,
      fontSize: 13.5, color: '4a4845', fontFace: 'Georgia',
      italic: true, lineSpacingMultiple: 1.5, breakLine: true,
    })

    if (q.referencedSection) {
      qSlide.addText(`Ref: ${q.referencedSection}`, {
        x: 1.1, y: H - 0.7, w: 3, h: 0.2,
        fontSize: 7, fontFace: 'Courier New', color: MUTED, charSpacing: 1,
      })
    }

    addRule(qSlide, H - 0.45)
    qSlide.addText(`${result.title}  ·  Slide ${slideNum}`, {
      x: 0.6, y: H - 0.38, w: W - 1.2, h: 0.2,
      fontSize: 7, fontFace: 'Courier New', color: MUTED,
    })
  })

  const sEnd = prs.addSlide()
  sEnd.background = { color: INK }

  sEnd.addText('MODULE COMPLETE', {
    x: 0.7, y: 1.5, w: W - 1.4, h: 0.4,
    fontSize: 10, fontFace: 'Courier New', color: MUTED, charSpacing: 5,
  })

  sEnd.addText(result.title, {
    x: 0.7, y: 2.1, w: W - 1.4, h: 2.2,
    fontSize: 40, bold: true, color: PAPER,
    fontFace: 'Arial', charSpacing: -1, breakLine: true,
  })

  sEnd.addText(result.slideNarrations?.close || 'Review the material and consult your manager with any questions.', {
    x: 0.7, y: H - 1.6, w: W - 1.4, h: 0.8,
    fontSize: 12, color: MUTED, fontFace: 'Georgia', italic: true,
    lineSpacingMultiple: 1.5,
  })

  sEnd.addShape(prs.ShapeType.rect, {
    x: 0, y: H - 0.08, w: W, h: 0.08,
    fill: { color: ACCENT }, line: { color: ACCENT, pt: 0 },
  })

  const fileName = (result.title || 'training').replace(/\s+/g, '-').toLowerCase()
  await prs.writeFile({ fileName: `${fileName}.pptx` })
}
