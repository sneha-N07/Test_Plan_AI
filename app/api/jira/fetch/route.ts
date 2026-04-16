import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url, email, apiToken, projectKey, sprintVersion, ticketId } = await request.json();

    if (!url || !email || !apiToken || (!projectKey && !ticketId)) {
      return NextResponse.json(
        { success: false, error: 'Missing required Jira parameters (Provide Project Key or Ticket ID)' },
        { status: 400 }
      );
    }

    const cleanUrl = url.replace(/\/$/, '');
    const encodedToken = Buffer.from(`${email}:${apiToken}`).toString('base64');

    // Build JQL query
    let jql = '';
    if (ticketId) {
      jql = `key = "${ticketId}"`;
    } else {
      jql = `project = "${projectKey}"`;
      if (sprintVersion) {
        jql += ` AND fixVersion = "${sprintVersion}"`;
      }
    }
    
    // We fetch a few basic fields to avoid massive payloads
    const fetchUrl = `${cleanUrl}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&fields=summary,description,issuetype,status&maxResults=50`;

    const res = await fetch(fetchUrl, {
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
    
    // Format issues to a simplified array for the UI and LLM
    const issues = (data.issues || []).map((issue: any) => ({
      id: issue.key,
      summary: issue.fields.summary,
      description: issue.fields.description?.content?.[0]?.content?.[0]?.text || "(No Description extracted)",
      type: issue.fields.issuetype?.name || "Task",
      status: issue.fields.status?.name || "Unknown"
    }));

    return NextResponse.json({ success: true, total: data.total, issues });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Jira issues' },
      { status: 500 }
    );
  }
}
