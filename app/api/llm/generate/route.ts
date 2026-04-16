import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { provider, baseUrl, apiKey, model, context } = await request.json();

    if (!provider || !model || !context) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    // Read the template file from the server
    const templatePath = path.join(process.cwd(), 'test_plan_template', 'template.txt');
    let templateText = 'No template found.';
    try {
      templateText = fs.readFileSync(templatePath, 'utf8');
    } catch (e) {
      console.warn("Could not read template.txt at", templatePath);
    }

    const systemPrompt = `You are an expert QA Software Engineer.
Your task is to generate a comprehensive Test Plan for the following Jira Feature/Issues based on the provided Template format.
Do NOT hallucinate features. Strictly stick to the Jira context and additional notes provided.
Return ONLY valid Markdown.

### JIRA AND ADDITIONAL CONTEXT:
${context}

### REQUIRED TEST PLAN TEMPLATE:
${templateText}`;

    let generateUrl = '';
    let headers: any = { 'Content-Type': 'application/json' };
    let payload: any = {};
    let testPlanMarkdown = '';

    if (provider === 'Ollama') {
      generateUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}/api/generate` : 'http://localhost:11434/api/generate';
      payload = {
        model,
        prompt: systemPrompt,
        stream: false
      };
      
      const res = await fetch(generateUrl, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
      const data = await res.json();
      testPlanMarkdown = data.response;
      
    } else if (provider === 'GROQ' || provider === 'Grok') {
      generateUrl = provider === 'GROQ' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.x.ai/v1/chat/completions';
      if (baseUrl) generateUrl = baseUrl;
      headers['Authorization'] = `Bearer ${apiKey}`;
      payload = {
        model,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Generate the Test Plan based on the context above.' }],
        temperature: 0.3
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
  } catch (error: any) {
    console.error("LLM Generation Error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Test Plan generation failed' }, { status: 500 });
  }
}
