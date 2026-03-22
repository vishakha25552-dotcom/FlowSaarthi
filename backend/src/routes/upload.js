const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { extractText } = require('../services/ocr');
const { explainDocument } = require('../services/ai');
const { detectCase } = require('../services/caseDetector');
const { generateFlow } = require('../services/flowEngine');

// ⚙️ Simple Multer Config for MVP
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const isValid = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
    isValid ? cb(null, true) : cb(new Error('Only images and PDFs are allowed'));
  }
});

// 📬 Main Upload Endpoint
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    console.log(`Processing: ${filePath}`);

    // 1. OCR (Read Text)
    const rawText = await extractText(filePath).catch(err => {
      console.error('OCR Error:', err);
      throw new Error('Failed to read document. Is it clear?');
    });

    // 2. AI (Simplify)
    const explanation = await explainDocument(rawText).catch(err => {
      console.error('AI Error:', err);
      return { summary: "Simplified explanation unavailable.", meaning: "We read the text but couldn't process it.", urgency: "low" };
    });

    // 3. Case Detection
    const caseInfo = detectCase(rawText);

    // 4. Flow Generation
    const flow = generateFlow(caseInfo.type);

    // 6. Return unified response
    res.json({
      status: 'success',
      data: {
        caseType: caseInfo.type,
        title: caseInfo.label,
        summary: explanation.summary,
        meaning: explanation.meaning,
        urgency: explanation.urgency,
        flow: flow
      }
    });
  } catch (error) {
    console.error('Processing Error:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;
