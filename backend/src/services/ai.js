const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates an explanation for a document using Gemini AI.
 * @param {string} rawText - The raw text extracted from the document.
 * @returns {Promise<Object>} - The structured explanation.
 */
async function explainDocument(rawText) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
      return {
        summary: "Notice detected, but AI explanation is currently unavailable (API key missing).",
        meaning: "Please provide a valid GEMINI_API_KEY in the backend .env file.",
        urgency: "low"
      };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert at simplifying complex government documents for non-technical Indian users. 
      Your tone is calm, helpful, and empathetic. Avoid all legal jargon and technical terms.
      
      Below is the raw text extracted from a document using OCR. I want you to:
      1. Explain what this document is about in 1-2 simple sentences (Summary).
      2. Explain what it means for the user (Meaning).
      3. Determine the urgency (High, Medium, Low) based on deadlines or actions required.
      4. Extract any metadata like deadlines, dates, or issuing authorities.

      Provide the response in the following JSON format ONLY:
      {
        "summary": "...",
        "meaning": "...",
        "urgency": "...",
        "metadata": {
          "deadline": "...",
          "issuer": "...",
          "date_of_issue": "..."
        }
      }

      RAW TEXT:
      ${rawText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up text (remove markdown code blocks if any)
    const jsonString = text.replace(/```json|```/g, '').trim();
    
    try {
      return JSON.parse(jsonString);
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr, "Raw Text:", text);
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error("AI Explanation Error:", error);
    return {
      summary: "We couldn't process this document fully.",
      meaning: "The document might be illegible or the AI service is temporarily down.",
      urgency: "low",
      metadata: {}
    };
  }
}

module.exports = {
  explainDocument
};
