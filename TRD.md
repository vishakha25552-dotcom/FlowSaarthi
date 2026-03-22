🧱 2.1 System Architecture
Frontend (React + React Flow)
        ↓
Backend (Node.js / Express)
        ↓
AI Layer (LLM APIs)
        ↓
Processing Layer (OCR + parsing)
        ↓
Flow Engine
        ↓
Database

🔹 2.2 Core Modules

⸻

1. Document Processing Layer

Tech:
	•	Tesseract OCR / Vision API
{
  "raw_text": "...",
  "structured_data": {
    "type": "tax_notice",
    "deadline": "...",
    "issuer": "..."
  }
}

2. AI Explanation Engine

Input:
	•	raw_text
{
  "summary": "...",
  "meaning": "...",
  "urgency": "medium"
}

3. Case Detection Engine

Approach:
	•	rule-based (keywords)
	•	optional ML classification later

⸻

4. Flow Generation Engine

Logic:
	•	predefined templates per case
	•	dynamic mapping
{
  "nodes": [
    { "id": "1", "label": "Review Notice", "state": "active" },
    { "id": "2", "label": "Prepare Documents", "state": "pending" }
  ],
  "edges": [
    { "from": "1", "to": "2" }
  ]
}

5. Flow State Engine
	•	manages:
	•	step status
	•	timestamps

⸻

6. Backend API

Endpoints:
	•	POST /upload
	•	POST /process
	•	POST /generate-flow
	•	POST /update-step
	•	GET /flow/:id

⸻

7. Frontend

Tech:
	•	React
	•	React Flow
	•	Zustand

Responsibilities:
	•	graph rendering
	•	UI state
	•	interactions

⸻

8. Timeline Engine (Basic)
	•	tracks step progression
	•	stores history

⸻

⸻

🔐 2.3 Security
	•	Mask sensitive fields
	•	Avoid long-term storage of raw docs
	•	Secure uploads

⸻

⚡ 2.4 Performance
	•	async processing
	•	caching flows
	•	lazy loading node details
