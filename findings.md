# System Pilot - Protocol 0 Initialized

## Discovery Questions
Please answer the following 5 questions to define the "Payload":

1. **North Star:** What is the singular desired outcome? (Is it just generating a test plan from Jira/ADO, or is there more?)
2. **Integrations:** Which external services (Jira, ADO, X-Ray) do we need to build right away? Are API keys ready?
3. **Source of Truth:** Where does the primary data live? (Is Jira the single source of truth for features and user stories?)
4. **Delivery Payload:** How and where should the final result be delivered? (A markdown file? Pushed back as a comment on Jira/X-Ray? Displayed on the UI?)
5. **Behavioral Rules:** How should the system "act"? (e.g., Tone of the generated plan, specific testing strategies, must-haves).

## Current Findings
- The UI contains 4 steps: Setup -> Fetch Issues -> Review -> Test Plan.
- Stack: TypeScript, React (Next.js App Router for Vercel deployment).
- **Missing Information**: The `test_plan_template` directory is empty. Please provide the test plan template content!
