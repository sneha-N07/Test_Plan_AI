import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { provider, baseUrl, apiKey, model, context } = await request.json();

    if (!provider || !model || !context) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    // Truncate context to stay within token budgets on free-tier LLM APIs.
    // GROQ free tier: 12,000 TPM. At ~4 chars/token, 3000 chars ≈ 750 tokens for context.
    const MAX_CONTEXT_CHARS = 3000;
    const truncatedContext = context.length > MAX_CONTEXT_CHARS
      ? context.slice(0, MAX_CONTEXT_CHARS) + '\n\n[Context truncated to fit token limit]'
      : context;

    // Load only the lightweight test plan structure template (~700 tokens max).
    // The large VWO example files (65KB+) are NOT loaded — they caused token-limit errors.
    const templatesDir = path.join(process.cwd(), 'test_templates');
    let testPlanTemplate = '';
    try {
      testPlanTemplate = fs.readFileSync(path.join(templatesDir, 'test_plan.md'), 'utf8');
    } catch (e) {
      console.warn('Could not read test_plan.md');
    }

// Total token budget estimate:
    //   systemPrompt instructions: ~200 tokens
    //   testPlanTemplate:          ~700 tokens
    //   truncatedContext:          ~750 tokens
    //   user message:              ~10 tokens
    //   max_tokens (output):       3000 tokens
    //   TOTAL:                     ~4660 tokens — well within GROQ free-tier 12k TPM
    const systemPrompt = `You are an expert QA Software Engineer. Generate ONLY a Test Plan document based on the Jira context below.

DO NOT generate Test Scenarios or Test Cases — those are handled by separate dedicated agents.

OUTPUT: A single Test Plan document following the structure provided below.

RULES:
- Return ONLY valid Markdown. No extra commentary before or after.
- Do NOT hallucinate features. Strictly base the content on the Jira context provided.
- Replace every placeholder in [brackets] with actual content relevant to the Jira ticket.
- Do not leave any section empty or with placeholder text.

### JIRA CONTEXT:
${truncatedContext}

### TEST PLAN STRUCTURE (fill every section):
${testPlanTemplate}`;

    let generateUrl = '';
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let payload: Record<string, unknown> = {};
    let testPlanMarkdown = '';

    if (provider === 'Ollama') {
      generateUrl = baseUrl
        ? `${baseUrl.replace(/\/$/, '')}/api/generate`
        : 'http://localhost:11434/api/generate';
      payload = { model, prompt: systemPrompt, stream: false };

      const res = await fetch(generateUrl, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
      const data = await res.json();
      testPlanMarkdown = data.response;

    } else if (provider === 'GROQ' || provider === 'Grok') {
      generateUrl =
        provider === 'GROQ'
          ? 'https://api.groq.com/openai/v1/chat/completions'
          : 'https://api.x.ai/v1/chat/completions';
      if (baseUrl) generateUrl = baseUrl;

      headers['Authorization'] = `Bearer ${apiKey}`;
      payload = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate the Test Plan document now.' },
        ],
        temperature: 0.3,
        max_tokens: 3000,
      };

      const res = await fetch(generateUrl, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`${provider} error: ${res.status} ${errText}`);
      }
      const data = await res.json();
      testPlanMarkdown = data.choices[0].message.content;
    }

    return NextResponse.json({ success: true, testPlan: testPlanMarkdown });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Test Plan generation failed';
    console.error('LLM Generation Error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
