'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Target, RotateCcw, Download, Settings, Loader2, Briefcase } from 'lucide-react';

export default function AgentPage() {
  const [step, setStep] = useState(1);
  
  // Storage State
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  
  const [llmProvider, setLlmProvider] = useState('Ollama');
  const [llmBaseUrl, setLlmBaseUrl] = useState('');
  const [llmKey, setLlmKey] = useState('');
  const [llmModel, setLlmModel] = useState('llama3');

  // Fetch State
  const [jiraTicketId, setJiraTicketId] = useState('');
  const [context, setContext] = useState('');
  
  // Data State
  const [issues, setIssues] = useState([]);
  const [testPlan, setTestPlan] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  
  const [jiraTestStatus, setJiraTestStatus] = useState('');
  const [jiraTestSuccess, setJiraTestSuccess] = useState<boolean | null>(null);
  
  const [llmTestStatus, setLlmTestStatus] = useState('');
  const [llmTestSuccess, setLlmTestSuccess] = useState<boolean | null>(null);
  
  // Load local storage
  useEffect(() => {
    setJiraUrl(localStorage.getItem('jiraUrl') || '');
    setJiraEmail(localStorage.getItem('jiraEmail') || '');
    setJiraToken(localStorage.getItem('jiraToken') || '');
    setLlmProvider(localStorage.getItem('llmProvider') || 'Ollama');
    setLlmBaseUrl(localStorage.getItem('llmBaseUrl') || '');
    setLlmKey(localStorage.getItem('llmKey') || '');
    setLlmModel(localStorage.getItem('llmModel') || 'llama3');
    
    // Load history
    setJiraTicketId(localStorage.getItem('jiraTicketId') || '');
    setContext(localStorage.getItem('context') || '');
    setTestPlan(localStorage.getItem('testPlan') || '');
    const savedStep = localStorage.getItem('currentStep');
    if (savedStep) setStep(parseInt(savedStep));
  }, []);

  // Persist history automatically
  useEffect(() => {
    localStorage.setItem('jiraTicketId', jiraTicketId);
    localStorage.setItem('context', context);
    localStorage.setItem('testPlan', testPlan);
    localStorage.setItem('currentStep', step.toString());
  }, [jiraTicketId, context, testPlan, step]);

  const saveSettings = () => {
    localStorage.setItem('jiraUrl', jiraUrl);
    localStorage.setItem('jiraEmail', jiraEmail);
    localStorage.setItem('jiraToken', jiraToken);
    localStorage.setItem('llmProvider', llmProvider);
    localStorage.setItem('llmBaseUrl', llmBaseUrl);
    localStorage.setItem('llmKey', llmKey);
    localStorage.setItem('llmModel', llmModel);
    
    setSaveStatus('✅ Settings saved to local storage!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const testJira = async () => {
    try {
      setLoading(true); setJiraTestStatus('Testing Jira...'); setJiraTestSuccess(null);
      const res = await fetch('/api/jira/test', {
        method: 'POST', body: JSON.stringify({ url: jiraUrl, email: jiraEmail, apiToken: jiraToken })
      });
      const data = await res.json();
      if (data.success) {
        setJiraTestStatus(`Jira OK! Welcome ${data.name}`);
        setJiraTestSuccess(true);
        localStorage.setItem('jiraDisplayName', data.name);
      } else {
        setJiraTestStatus(`Jira Error: ${data.error}`);
        setJiraTestSuccess(false);
      }
    } catch (e: any) { 
      setJiraTestStatus('Jira connection failed');
      setJiraTestSuccess(false);
    }
    finally { setLoading(false); }
  };

  const testLlm = async () => {
    try {
      setLoading(true); setLlmTestStatus('Testing LLM...'); setLlmTestSuccess(null);
      const res = await fetch('/api/llm/test', {
        method: 'POST', body: JSON.stringify({ provider: llmProvider, baseUrl: llmBaseUrl, apiKey: llmKey, model: llmModel })
      });
      const data = await res.json();
      setLlmTestStatus(data.success ? 'LLM OK!' : `LLM Error: ${data.error}`);
      setLlmTestSuccess(data.success);
    } catch (e: any) { 
      setLlmTestStatus('LLM connection failed');
      setLlmTestSuccess(false);
    }
    finally { setLoading(false); }
  };

  const generatePlan = async () => {
    try {
      setLoading(true);
      setTestPlan(''); 
      setStep(2); // Now the Test Plan step
      
      let finalContext = '';

      if (jiraTicketId.trim() !== '') {
        // 1. Fetch Ticket details first if ID provided
        const fetchRes = await fetch('/api/jira/fetch', {
          method: 'POST', body: JSON.stringify({ url: jiraUrl, email: jiraEmail, apiToken: jiraToken, ticketId: jiraTicketId })
        });
        const fetchData = await fetchRes.json();
        
        if (!fetchData.success || !fetchData.issues || fetchData.issues.length === 0) {
          setTestPlan("Error: Could not fetch Jira ticket information. " + (fetchData.error || "Ticket not found."));
          setLoading(false);
          return;
        }

        const issue = fetchData.issues[0];
        finalContext = `ADDITIONAL NOTES: ${context}\n\nJIRA TICKET:\nID: ${issue.id}\nSummary: ${issue.summary}\nDescription: ${issue.description}`;
      } else {
        if (!context || context.trim() === '') {
          setTestPlan("Error: You must provide a Jira ticket ID or a description/context.");
          setLoading(false);
          return;
        }
        finalContext = `TICKET DESCRIPTION & DETAILS: ${context}`;
      }
      
      // 2. Call LLM to generate plan
      const genRes = await fetch('/api/llm/generate', {
        method: 'POST', body: JSON.stringify({ provider: llmProvider, baseUrl: llmBaseUrl, apiKey: llmKey, model: llmModel, context: finalContext })
      });
      const genData = await genRes.json();
      if (genData.success) {
        const newPlan = genData.testPlan;
        setTestPlan(newPlan);
        
        // Update history
        try {
          const historyRaw = localStorage.getItem('testPlanHistory');
          const history = historyRaw ? JSON.parse(historyRaw) : [];
          const newEntry = {
            id: Date.now().toString(),
            ticketId: jiraTicketId,
            date: new Date().toLocaleString(),
            plan: newPlan,
            provider: llmProvider,
            model: llmModel
          };
          localStorage.setItem('testPlanHistory', JSON.stringify([newEntry, ...history]));
        } catch (e) {
          console.error("Failed to save history:", e);
        }
      } else {
        setTestPlan("Error generating plan: " + genData.error);
      }
    } catch (err: any) {
      setTestPlan("Error: " + err.message);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="glass-panel" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="page-title">
          <div style={{ padding: '8px', background: 'rgba(37,99,235,0.1)', borderRadius: '8px', color: '#2563eb' }}><Target size={24} /></div>
          <div>
            Intelligent Test Planning Agent
            <p className="page-subtitle" style={{ margin: 0 }}>Generate comprehensive test plans from Jira requirements or custom descriptions using AI</p>
          </div>
        </div>
        <button className="btn-secondary" style={{ display: 'flex', gap: '8px' }} onClick={() => {
          setStep(1);
          setJiraTicketId('');
          setContext('');
          setTestPlan('');
        }}><RotateCcw size={16}/> Start Over</button>
      </div>

      <div className="stepper glass-panel" style={{ padding: '0.5rem', marginBottom: '20px' }}>
        {[1,2].map(s => {
          const isClickable = s === 1 || (s === 2 && testPlan !== '');
          return (
            <div 
              key={s} 
              className={`step ${step === s ? 'active' : ''}`} 
              style={{ 
                opacity: (step === s || isClickable) ? 1 : 0.5, 
                cursor: isClickable ? 'pointer' : 'default' 
              }}
              onClick={() => { if (isClickable) setStep(s); }}
            >
              {s}. {['Ticket Information', 'Test Plan'][s-1]}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="glass-panel">
          <h3>Ticket Information</h3>
          <p className="page-subtitle">Provide the Jira ticket ID (optional) OR custom descriptions</p>

          <div style={{ padding: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            <strong>💡 Note:</strong> You can generate the specific docs by connecting a <strong>Jira Ticket ID</strong>, by adding a custom <strong>Description</strong>, or both. Neither field is mandatory on its own!
          </div>
          
          <label className="label-field">Jira Ticket ID (Optional)</label>
          <input className="input-field" value={jiraTicketId} onChange={e=>setJiraTicketId(e.target.value)} placeholder="e.g. VWO-123" />
          
          <label className="label-field">Additional Context & Description (Optional)</label>
          <textarea className="input-field" rows={4} value={context} onChange={e=>setContext(e.target.value)} placeholder="Add specific testing focus, constraints, or feature highlights..." />

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ width: '100%' }} onClick={generatePlan} disabled={(!jiraTicketId && !context) || loading}>
               {loading ? <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Loader2 className="animate-spin" /> Processing...</div> : 'Generate Test Plan'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>Finalized Test Plan</h3>
            {testPlan && <button className="btn-secondary" style={{ display: 'flex', gap: '8px' }} onClick={() => {
              const blob = new Blob([testPlan], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'Test_Plan.md'; a.click();
            }}><Download size={16}/> Download .md</button>}
          </div>
          
          {!testPlan && !loading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              No test plan generated yet
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#2563eb' }}>
               <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto', display: 'block' }}/>
               <p style={{ marginTop: '1rem' }}>AI is crafting your intelligent test plan...</p>
            </div>
          )}

          {testPlan && (
            <>
              <div style={{ padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', marginBottom: '2rem' }}>
                <ReactMarkdown>{testPlan}</ReactMarkdown>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  Back to Ticket Information
                </button>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Global CSS for spinner */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
