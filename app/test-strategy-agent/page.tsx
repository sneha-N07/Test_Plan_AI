'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { RotateCcw, Download, Settings, Loader2, Briefcase, Target } from 'lucide-react';

export default function TestStrategyAgentPage() {
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
  const [testStrategy, setTestStrategy] = useState('');
  
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
    setJiraTicketId(localStorage.getItem('tstrat_jiraTicketId') || '');
    setContext(localStorage.getItem('tstrat_context') || '');
    setTestStrategy(localStorage.getItem('tstrat_testStrategy') || '');
    const savedStep = localStorage.getItem('tstrat_currentStep');
    if (savedStep) setStep(parseInt(savedStep));
  }, []);

  // Persist history automatically
  useEffect(() => {
    localStorage.setItem('tstrat_jiraTicketId', jiraTicketId);
    localStorage.setItem('tstrat_context', context);
    localStorage.setItem('tstrat_testStrategy', testStrategy);
    localStorage.setItem('tstrat_currentStep', step.toString());
  }, [jiraTicketId, context, testStrategy, step]);

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

  const generateTestStrategy = async () => {
    try {
      setLoading(true);
      setTestStrategy(''); 
      setStep(3); // Now the Test Strategy step
      
      let finalContext = '';

      if (jiraTicketId.trim() !== '') {
        // 1. Fetch Ticket details first if ID provided
        const fetchRes = await fetch('/api/jira/fetch', {
          method: 'POST', body: JSON.stringify({ url: jiraUrl, email: jiraEmail, apiToken: jiraToken, ticketId: jiraTicketId })
        });
        const fetchData = await fetchRes.json();
        
        if (!fetchData.success || !fetchData.issues || fetchData.issues.length === 0) {
          setTestStrategy("Error: Could not fetch Jira ticket information. " + (fetchData.error || "Ticket not found."));
          setLoading(false);
          return;
        }

        const issue = fetchData.issues[0];
        finalContext = `ADDITIONAL NOTES: ${context}\n\nJIRA TICKET:\nID: ${issue.id}\nSummary: ${issue.summary}\nDescription: ${issue.description}`;
      } else {
        if (!context || context.trim() === '') {
          setTestStrategy("Error: You must provide a Jira ticket ID or a description/context.");
          setLoading(false);
          return;
        }
        finalContext = `TICKET DESCRIPTION & DETAILS: ${context}`;
      }
      
      // 2. Call LLM to generate test strategy
      const genRes = await fetch('/api/llm/generate-test-strategy', {
        method: 'POST', body: JSON.stringify({ provider: llmProvider, baseUrl: llmBaseUrl, apiKey: llmKey, model: llmModel, context: finalContext })
      });
      const genData = await genRes.json();
      if (genData.success) {
        const newStrategy = genData.testStrategy;
        setTestStrategy(newStrategy);
        
        // Optionally update history if you want test strategy history
        try {
          const historyRaw = localStorage.getItem('testPlanHistory');
          const history = historyRaw ? JSON.parse(historyRaw) : [];
          const newEntry = {
            id: Date.now().toString(),
            ticketId: jiraTicketId || 'Custom Desc (Strategy)',
            date: new Date().toLocaleString(),
            plan: newStrategy, // we use 'plan' to reuse the history modal
            provider: llmProvider,
            model: llmModel
          };
          localStorage.setItem('testPlanHistory', JSON.stringify([newEntry, ...history]));
        } catch (e) {
          console.error("Failed to save history:", e);
        }
      } else {
        setTestStrategy("Error generating test strategy: " + genData.error);
      }
    } catch (err: any) {
      setTestStrategy("Error: " + err.message);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="glass-panel" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="page-title">
          <div style={{ padding: '8px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '8px', color: '#eab308' }}><Target size={24} /></div>
          <div>
            Intelligent Test Strategy Agent
            <p className="page-subtitle" style={{ margin: 0 }}>Generate comprehensive test strategies from Jira requirements or custom descriptions using AI</p>
          </div>
        </div>
        <button className="btn-secondary" style={{ display: 'flex', gap: '8px' }} onClick={() => {
          setStep(1);
          setJiraTicketId('');
          setContext('');
          setTestStrategy('');
        }}><RotateCcw size={16}/> Start Over</button>
      </div>

      <div className="stepper glass-panel" style={{ padding: '0.5rem', marginBottom: '20px' }}>
        {[1,2,3].map(s => {
          const isClickable = s === 1 || (s === 2 && (jiraTicketId !== '' || context !== '' || step > 2)) || (s === 3 && testStrategy !== '');
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
              {s}. {['Setup', 'Ticket Information', 'Test Strategy'][s-1]}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="glass-panel">
          <h3>Connection Setup</h3>
          <p className="page-subtitle">Configure LLM and Jira (optional) settings</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* LLM Connection First */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={18} /> LLM Connection
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-field" style={{marginTop: 0}}>Provider</label>
                  <select className="input-field" value={llmProvider} onChange={e=>setLlmProvider(e.target.value)}>
                    <option value="Ollama">Ollama (Local)</option>
                    <option value="GROQ">GROQ</option>
                    <option value="Grok">Grok</option>
                  </select>
                </div>
                <div>
                  <label className="label-field" style={{marginTop: 0}}>Model Name</label>
                  <input className="input-field" value={llmModel} onChange={e=>setLlmModel(e.target.value)} placeholder="e.g. llama-3.3-70b-versatile"/>
                </div>
              </div>

              <label className="label-field">API Key / Base URL (If needed)</label>
              <input className="input-field" type="password" value={llmKey || llmBaseUrl} onChange={e=>{
                if(llmProvider==='Ollama') setLlmBaseUrl(e.target.value); else setLlmKey(e.target.value);
              }} placeholder="Token or http://localhost:11434" />
              
              <button 
                className="btn-primary" 
                style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#2563eb' }} 
                onClick={testLlm} 
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test LLM Connection'}
              </button>
              
              {llmTestStatus && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: llmTestSuccess === true ? 'rgba(16, 185, 129, 0.1)' : llmTestSuccess === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
                  color: llmTestSuccess === true ? '#10b981' : llmTestSuccess === false ? 'var(--error-color)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {llmTestStatus}
                </div>
              )}
            </div>

            {/* Jira Connection Below */}
            <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '1rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} /> Jira Connection (Optional here)
              </div>
              <label className="label-field" style={{marginTop: 0}}>Jira URL</label>
              <input className="input-field" value={jiraUrl} onChange={e=>setJiraUrl(e.target.value)} />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label-field">Jira Email</label>
                  <input className="input-field" value={jiraEmail} onChange={e=>setJiraEmail(e.target.value)} />
                </div>
                <div>
                  <label className="label-field">API Token</label>
                  <input type="password" className="input-field" value={jiraToken} onChange={e=>setJiraToken(e.target.value)} />
                </div>
              </div>
              
              <button 
                className="btn-primary" 
                style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#2563eb' }} 
                onClick={testJira} 
                disabled={loading}
              >
                {loading ? 'Testing...' : 'Test Jira Connection'}
              </button>
              
              {jiraTestStatus && (
                <div style={{ 
                  marginTop: '0.75rem', 
                  padding: '0.5rem',
                  borderRadius: '6px',
                  backgroundColor: jiraTestSuccess === true ? 'rgba(16, 185, 129, 0.1)' : jiraTestSuccess === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
                  color: jiraTestSuccess === true ? '#10b981' : jiraTestSuccess === false ? 'var(--error-color)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {jiraTestStatus}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
            {saveStatus && <div style={{ color: '#10b981', fontSize: '14px', fontWeight: '500' }}>{saveStatus}</div>}
            <button className="btn-secondary" onClick={saveSettings}>Save Settings</button>
            <button className="btn-primary" onClick={() => setStep(2)}>Continue to Details</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="glass-panel">
          <h3>Ticket Information</h3>
          <p className="page-subtitle">Provide the Jira ticket ID (optional) OR custom descriptions</p>

          <div style={{ padding: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            <strong>💡 Note:</strong> You can generate the specific docs by connecting a <strong>Jira Ticket ID</strong>, by adding a custom <strong>Description</strong>, or both. Neither field is mandatory on its own!
          </div>
          
          <label className="label-field">Jira Ticket ID</label>
          <input className="input-field" value={jiraTicketId} onChange={e=>setJiraTicketId(e.target.value)} placeholder="e.g. VWO-123" />
          
          <label className="label-field">Additional Context & Description</label>
          <textarea className="input-field" rows={4} value={context} onChange={e=>setContext(e.target.value)} placeholder="Add feature details, specific testing focus, constraints..." />

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)} disabled={loading}>
               Back to Setup
            </button>
            <button className="btn-primary" style={{ flex: 2 }} onClick={generateTestStrategy} disabled={(!jiraTicketId && !context) || loading}>
               {loading ? <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Loader2 className="animate-spin" /> Processing...</div> : 'Generate Test Strategy'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>Finalized Test Strategy (Markdown format)</h3>
            {testStrategy && <button className="btn-secondary" style={{ display: 'flex', gap: '8px' }} onClick={() => {
              const blob = new Blob([testStrategy], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'Test_Strategy.md'; a.click();
            }}><Download size={16}/> Download .md</button>}
          </div>
          
          {!testStrategy && !loading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              No test strategy generated yet
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#eab308' }}>
               <Loader2 size={40} className="animate-spin" style={{ margin: '0 auto', display: 'block' }}/>
               <p style={{ marginTop: '1rem' }}>AI is crafting your test strategy...</p>
            </div>
          )}

          {testStrategy && (
            <>
              <div className="plan-content" style={{ 
                padding: '1.5rem', 
                border: '1px solid var(--border-color)', 
                borderRadius: '8px', 
                backgroundColor: 'rgba(0,0,0,0.02)', 
                color: 'var(--text-primary)', 
                marginBottom: '2rem',
                lineHeight: 1.6
              }}>
                <ReactMarkdown>{testStrategy}</ReactMarkdown>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button className="btn-secondary" onClick={() => setStep(2)}>
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
