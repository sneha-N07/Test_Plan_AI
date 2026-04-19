import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { provider, baseUrl, apiKey, model, context } = await request.json();

    if (!provider || !model || !context) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const systemPrompt = `You are an expert QA Software Engineer.
Your task is to generate a comprehensive Test Strategy based on the provided Context.
Do NOT hallucinate features. Strictly stick to the context and additional notes provided.
Return the output in Markdown format.
Structure the Test Strategy clearly with headings like Objective, Scope, Testing Approach, Environment, and Tools.

### CONTEXT:
${context}`;

    let generateUrl = '';
    let headers: any = { 'Content-Type': 'application/json' };
    let payload: any = {};
    let testStrategyMd = '';

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
      testStrategyMd = data.response;
      
    } else if (provider === 'GROQ' || provider === 'Grok') {
      generateUrl = provider === 'GROQ' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.x.ai/v1/chat/completions';
      if (baseUrl) generateUrl = baseUrl;
      headers['Authorization'] = `Bearer ${apiKey}`;
      payload = {
        model,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Generate the Test Strategy in Markdown format based on the context above.' }],
        temperature: 0.3
      };

      const res = await fetch(generateUrl, { method: 'POST', headers, body: JSON.stringify(payload) });
      if (!res.ok) {
         const errText = await res.text();
         throw new Error(`${provider} error: ${res.status} ${errText}`);
      }
      const data = await res.json();
      testStrategyMd = data.choices[0].message.content;
    }

    // Clean up unnecessary markdown block wrappers if LLM still prepends them to the actual content
    testStrategyMd = testStrategyMd.replace(/^```markdown\n?/i, '').replace(/^```\n?/i, '').replace(/\n?```$/i, '').trim();

    return NextResponse.json({ success: true, testStrategy: testStrategyMd });
  } catch (error: any) {
    console.error("LLM Generation Error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Test Strategy generation failed' }, { status: 500 });
  }
}
