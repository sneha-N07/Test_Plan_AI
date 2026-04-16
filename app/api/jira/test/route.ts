import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, email, apiToken } = await request.json();

    if (!url || !email || !apiToken) {
      return NextResponse.json(
        { success: false, error: 'Missing Jira credentials (url, email, apiToken)' },
        { status: 400 }
      );
    }

    const cleanUrl = url.replace(/\/$/, '');
    const encodedToken = Buffer.from(`${email}:${apiToken}`).toString('base64');

    const res = await fetch(`${cleanUrl}/rest/api/3/myself`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedToken}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Jira returned status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, accountId: data.accountId, name: data.displayName });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to connect to Jira' },
      { status: 500 }
    );
  }
}
