# Task Plan

## Phase 1: Blueprint & Discovery
- [x] Receive answers spanning North Star, Integrations, Source of Truth, Payload, and Behavioral Rules.
- [x] Define the exact `test_plan_template` format (Parsed from Docx).
- [x] Lock down the JSON Input/Output Data Schema in `gemini.md`.

## Phase 2: Link (Connectivity) & Setup
- [ ] Initialize Next.js project with TypeScript.
- [ ] Setup API connections in TypeScript to Jira.
- [ ] Build minimal tools to verify Jira authentication and ticket fetching. 

## Phase 3: Architect (3-Layer Build)
- [ ] **Architecture Layer:** Define specific SOPs for the test generation logic via markdown documents.
- [ ] **Navigation Layer:** Build Next.js API routes that orchestrate fetching issues and calling the LLM based on SOPs.
- [ ] **Tools Layer:** Build deterministic utility functions (Jira fetching, template parsing).

## Phase 4: Stylize (Refinement & UI)
- [ ] Build the Next.js React frontend matching `ui_screenshots` (4 steps: Setup, Fetch Issues, Review, Test Plan).

## Phase 5: Trigger (Deployment)
- [ ] Deploy the complete application to Vercel.
