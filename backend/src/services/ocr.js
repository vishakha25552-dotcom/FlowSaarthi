const Tesseract = require('tesseract.js');
const fs = require('fs');

/**
 * Extracts text from an image file using Tesseract.js
 * @param {string} filePath - Path to the image file
 * @returns {Promise<string>} - Extracted text
 */
async function extractText(filePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(
      filePath,
      'eng',
      { 
        logger: m => console.log(m) // Optional: log progress
      }
    );
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from document');
  }
}

module.exports = {
  extractText
};
