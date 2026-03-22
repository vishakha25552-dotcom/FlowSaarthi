/**
 * 🌊 Flow Generation Engine
 * Generates a strictly linear sequence of steps for documents.
 */

// 📑 Static Templates (No Runtime State)
const FLOW_TEMPLATES = {
  income_tax_notice: [
    { 
      id: 'step-1', 
      title: 'Understand Notice', 
      description: 'Review the analysis from FlowSaarthi to understand why you received this notice.', 
      type: 'info'
    },
    { 
      id: 'step-2', 
      title: 'Gather Evidence', 
      description: 'Collect your Bank Statements, Form 16, and any relevant receipts.', 
      type: 'action', 
      required_documents: ['Bank Statement', 'Form 16'] 
    },
    { 
      id: 'step-3', 
      title: 'Prepare Response', 
      description: 'Draft a point-by-point reply explaining your position.', 
      type: 'action' 
    },
    { 
      id: 'step-4', 
      title: 'File Online', 
      description: 'Submit your response via the official Income Tax e-filing portal.', 
      type: 'action', 
      links: ['https://www.incometax.gov.in/'] 
    }
  ],
  aadhaar_update: [
    { 
      id: 'step-1', 
      title: 'Choose Method', 
      description: 'Decide if you can update online (Address) or need a Kendra (Mobile/Biometric).', 
      type: 'info',
      links: ['https://myaadhaar.uidai.gov.in/']
    },
    { 
      id: 'step-2', 
      title: 'Collect Proofs', 
      description: 'Prepare your Passport, Voter ID, or Ration Card.', 
      type: 'action', 
      required_documents: ['Identity Proof'] 
    },
    { 
      id: 'step-3', 
      title: 'Submit Request', 
      description: 'Fill the form online or visit your nearest Aadhaar center.', 
      type: 'action' 
    },
    { 
      id: 'step-4', 
      title: 'Track Status', 
      description: 'Wait for processing and track using your EID.', 
      type: 'info' 
    }
  ],
  driving_license: [
    { 
      id: 'step-1', 
      title: 'Apply for Learner License', 
      description: 'Apply on the Parivahan portal and pay the test fees.', 
      type: 'action',
      links: ['https://sarathi.parivahan.gov.in/']
    },
    { id: 'step-2', title: 'LL Test', description: 'Take the computer test at the RTO.', type: 'action' },
    { id: 'step-3', title: 'Practice Period', description: 'Wait for the mandatory 30-day practice window.', type: 'info' },
    { id: 'step-4', title: 'Book DL Slot', description: 'Schedule your final driving test.', type: 'action' },
    { id: 'step-5', title: 'Final Test', description: 'Pass the practical test to get your license.', type: 'action' }
  ],
  refund_complaint: [
    { id: 'step-1', title: 'Contact Merchant', description: 'Try resolving with the merchant\'s support first.', type: 'action' },
    { id: 'step-2', title: 'Collect Evidence', description: 'Save all screenshots and receipts.', type: 'action', required_documents: ['Invoices'] },
    { id: 'step-3', title: 'File Grievance', description: 'Register on the National Consumer Helpline.', type: 'action', links: ['https://consumerhelpline.gov.in/'] },
    { id: 'step-4', title: 'Escalate Court', description: 'File via E-Daakhil if still unresolved.', type: 'action', links: ['https://edaakhil.nic.in/'] }
  ],
  lost_docs_recovery: [
    { id: 'step-1', title: 'File Police Report', description: 'File an e-FIR on your state police portal.', type: 'action' },
    { id: 'step-2', title: 'Apply for Duplicate', description: 'Apply on the relevant department portal.', type: 'action' },
    { id: 'step-3', title: 'Get Affidavit', description: 'Prepare a notarized affidavit if required.', type: 'action', required_documents: ['Affidavit'] }
  ]
};

// 🛡️ Fallback for Unknown Cases
const DEFAULT_FLOW = [
  {
    id: "step-1",
    title: "Understand your issue",
    description: "We could not classify this document clearly.",
    type: "info"
  },
  {
    id: "step-2",
    title: "Review manually",
    description: "Please review the document and take appropriate action.",
    type: "action"
  }
];

/**
 * Generates a linear flow for a given case type.
 */
function generateFlow(caseType) {
  const rawSteps = FLOW_TEMPLATES[caseType] || DEFAULT_FLOW;

  // Handle empty steps
  if (!rawSteps || rawSteps.length === 0) {
    return { nodes: [], edges: [] };
  }

  // Normalize nodes with dynamic status and validation
  const nodes = rawSteps.map((step, index) => {
    const { 
      id, 
      title = 'Untitled Step', 
      description = '', 
      type = 'info', 
      required_documents = [], 
      links = [] 
    } = step;

    return {
      id: id || `step-${index + 1}`,
      title,
      description,
      type: ['info', 'action'].includes(type) ? type : 'info',
      status: index === 0 ? 'active' : 'pending',
      required_documents,
      links
    };
  });

  // Create simple linear edges
  const edges = nodes.slice(0, -1).map((node, i) => ({
    source: node.id,
    target: nodes[i + 1].id
  }));

  return { nodes, edges };
}

module.exports = { generateFlow };
