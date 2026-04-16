# Gemini Project Constitution

## Data Schemas

### 1. Jira Integration Schema (Input)
```json
{
  "connectionId": "string",
  "productName": "string",
  "projectKey": "string",
  "sprintOrFixVersion": "string",
  "additionalContext": "string"
}
```

### 2. Issue Review Schema (Intermediate)
```json
{
  "issueId": "string",
  "summary": "string",
  "description": "string",
  "acceptanceCriteria": "string"
}
```

### 3. LLM Generation Request (Process)
```json
{
  "provider": "ollama | groq | grok",
  "apiKey": "string",
  "baseUrl": "string (optional)",
  "context": "string (jira issue details + additional notes)",
  "template": "string (the test plan markdown structure)"
}
```

## Behavioral Rules
- Always fetch strictly the required fields from Jira.
- The UI must feel intelligent and seamless, supporting modular integration with test management tools.
- LLM outputs must precisely adhere to the `test_plan_template` format without hallucinations.

## Architectural Invariants
- 3-Layer Architecture (Architecture/SOPs, Navigation/Routing, Tools/Execution).
- Stack: TypeScript, React (Next.js App Router for Vercel deployment).
- Styling: Plain CSS (vibrant, dark mode compatible, modern AI aesthetics).
- Deployment Target: Vercel.
