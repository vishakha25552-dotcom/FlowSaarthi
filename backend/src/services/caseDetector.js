/**
 * Rule-based case detection service for FlowSaarthi MVP.
 * Identifies document types based on keyword matching.
 */

const CASE_RULES = [
  {
    type: 'income_tax_notice',
    label: 'Income Tax Notice',
    keywords: ['income tax', 'itr', 'notice', 'section 143', 'section 139', 'assessment year', 'tax evasion']
  },
  {
    type: 'aadhaar_update',
    label: 'Aadhaar Update',
    keywords: ['aadhaar', 'uidai', 'aadhaar update', 'enrolment', 'biometric', 'proof of address']
  },
  {
    type: 'driving_license',
    label: 'Driving License',
    keywords: ['driving license', 'dl', 'rto', 'learner license', 'driving test', 'motor vehicle']
  },
  {
    type: 'refund_complaint',
    label: 'Refund / Consumer Complaint',
    keywords: ['complaint', 'refund', 'consumer forum', 'grievance', 'consumer court', 'deficiency in service']
  },
  {
    type: 'lost_docs_recovery',
    label: 'Lost Documents Recovery',
    keywords: ['lost', 'missing', 'duplicate', 'fir', 'police report', 'affidavit']
  }
];

/**
 * Detects the case type from extracted text.
 * @param {string} text - The raw extracted text from the document.
 * @returns {Object} - The identified case object or unknown.
 */
function detectCase(text) {
  if (!text) return { type: 'unknown', label: 'Unknown Document' };

  const lowerText = text.toLowerCase();

  // Simple first-match keyword check
  for (const rule of CASE_RULES) {
    const hasMatch = rule.keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    
    if (hasMatch) {
      return { type: rule.type, label: rule.label };
    }
  }

  return { type: 'unknown', label: 'Unknown Document' };
}

module.exports = {
  detectCase,
  CASE_RULES
};
