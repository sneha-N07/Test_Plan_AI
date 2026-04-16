import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { provider, baseUrl, apiKey, model } = await request.json();

    if (!provider || !model) {
      return NextResponse.json({ success: false, error: 'Provider and Model are required' }, { status: 400 });
    }

    let testUrl = '';
    let headers: any = { 'Content-Type': 'application/json' };
    let body: any = {};

    if (provider === 'Ollama') {
      testUrl = baseUrl ? `${baseUrl.replace(/\/$/, '')}/api/generate` : 'http://localhost:11434/api/generate';
      body = { model, prompt: 'Hello', stream: false, max_tokens: 5 };
    } else if (provider === 'GROQ' || provider === 'Grok') {
      testUrl = provider === 'GROQ' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.x.ai/v1/chat/completions';
      if (baseUrl) testUrl = baseUrl;
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        model,
        messages: [{ role: 'user', content: 'Say hello' }],
        max_tokens: 5
      };
    } else {
      return NextResponse.json({ success: false, error: 'Unsupported Provider' }, { status: 400 });
    }

    const res = await fetch(testUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.text();
      throw new Error(`${provider} returned status ${res.status}: ${errData}`);
    }

    return NextResponse.json({ success: true, message: 'Connection successful!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to connect to LLM' }, { status: 500 });
  }
}
