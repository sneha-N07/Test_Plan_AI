'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, Briefcase, ChevronDown, X, ExternalLink, Mail, ShieldCheck, FileText, Target } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Profile settings
  const [editedName, setEditedName] = useState('');
  
  // Jira settings
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  
  // LLM settings
  const [llmProvider, setLlmProvider] = useState('Ollama');
  const [llmBaseUrl, setLlmBaseUrl] = useState('');
  const [llmKey, setLlmKey] = useState('');
  const [llmModel, setLlmModel] = useState('llama3');

  // Test UI State
  const [loading, setLoading] = useState(false);
  const [jiraTestStatus, setJiraTestStatus] = useState('');
  const [jiraTestSuccess, setJiraTestSuccess] = useState<boolean | null>(null);
  const [llmTestStatus, setLlmTestStatus] = useState('');
  const [llmTestSuccess, setLlmTestSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (isProfileOpen) {
      setEditedName(localStorage.getItem('jiraDisplayName') || 'Guest User');
      setJiraUrl(localStorage.getItem('jiraUrl') || '');
      setJiraEmail(localStorage.getItem('jiraEmail') || '');
      setJiraToken(localStorage.getItem('jiraToken') || '');
      setLlmProvider(localStorage.getItem('llmProvider') || 'Ollama');
      setLlmBaseUrl(localStorage.getItem('llmBaseUrl') || '');
      setLlmModel(localStorage.getItem('llmModel') || 'llama3');
      
      // Load connected states if they exist
      if (localStorage.getItem('jiraIsConnected') === 'true') {
        setJiraTestSuccess(true);
        setJiraTestStatus('');
      } else {
        setJiraTestStatus(''); setJiraTestSuccess(null);
      }

      if (localStorage.getItem('llmIsConnected') === 'true') {
        setLlmTestSuccess(true);
        setLlmTestStatus('');
      } else {
        setLlmTestStatus(''); setLlmTestSuccess(null);
      }
    }
  }, [isProfileOpen]);

  const handleJiraChange = (setter: any, value: string) => {
    setter(value);
    setJiraTestSuccess(null);
    setJiraTestStatus('');
    localStorage.removeItem('jiraIsConnected');
  };

  const handleLlmChange = (setter: any, value: string) => {
    setter(value);
    setLlmTestSuccess(null);
    setLlmTestStatus('');
    localStorage.removeItem('llmIsConnected');
  };

  const testJira = async () => {
    try {
      setLoading(true); setJiraTestStatus('Testing...'); setJiraTestSuccess(null);
      const res = await fetch('/api/jira/test', {
        method: 'POST', body: JSON.stringify({ url: jiraUrl, email: jiraEmail, apiToken: jiraToken })
      });
      const data = await res.json();
      if (data.success) {
        setJiraTestStatus(`Jira OK! Welcome ${data.name}`);
        setJiraTestSuccess(true);
        localStorage.setItem('jiraIsConnected', 'true');
      } else {
        setJiraTestStatus(`Error: ${data.error}`);
        setJiraTestSuccess(false);
        localStorage.removeItem('jiraIsConnected');
      }
    } catch (e: any) { 
      setJiraTestStatus('Connection failed');
      setJiraTestSuccess(false);
      localStorage.removeItem('jiraIsConnected');
    }
    finally { setLoading(false); }
  };

  const testLlm = async () => {
    try {
      setLoading(true); setLlmTestStatus('Testing...'); setLlmTestSuccess(null);
      const res = await fetch('/api/llm/test', {
        method: 'POST', body: JSON.stringify({ provider: llmProvider, baseUrl: llmBaseUrl, apiKey: llmKey, model: llmModel })
      });
      if (data.success) {
        setLlmTestStatus('LLM OK!');
        setLlmTestSuccess(true);
        localStorage.setItem('llmIsConnected', 'true');
      } else {
        setLlmTestStatus(`Error: ${data.error}`);
        setLlmTestSuccess(false);
        localStorage.removeItem('llmIsConnected');
      }
    } catch (e: any) { 
      setLlmTestStatus('Connection failed');
      setLlmTestSuccess(false);
      localStorage.removeItem('llmIsConnected');
    }
    finally { setLoading(false); }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('jiraDisplayName', editedName);
    localStorage.setItem('jiraUrl', jiraUrl);
    localStorage.setItem('jiraEmail', jiraEmail);
    localStorage.setItem('jiraToken', jiraToken);
    localStorage.setItem('llmProvider', llmProvider);
    localStorage.setItem('llmBaseUrl', llmBaseUrl);
    localStorage.setItem('llmKey', llmKey);
    localStorage.setItem('llmModel', llmModel);
    
    // Dispatch a dummy storage event so other tabs sync up
    window.dispatchEvent(new Event('storage'));
    setIsProfileOpen(false);
  };

  const menuItems = [
    { id: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { id: '/curriculum', icon: Users, label: 'Curriculum' },
    { id: 'Settings', icon: Settings, label: 'Global Setup' }
  ];

  return (
    <>
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{ 
            width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', color: 'white', fontWeight: 'bold' 
          }}>
            TB
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 'bold' }}>TestingBuddy AI</div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>Testing Platform</div>
          </div>
        </div>

        <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '10px', opacity: 0.5 }}>Main</div>
        
        {menuItems.map(item => {
          const isActive = pathname === item.id;
          if (item.id === 'Settings') {
            return (
              <div 
                key={item.id}
                className="sidebar-item"
                onClick={() => setIsProfileOpen(true)}
              >
                <item.icon size={18} /> {item.label}
              </div>
            );
          }
          return (
            <Link key={item.id} href={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`sidebar-item ${isActive ? 'active' : ''}`}>
                <item.icon size={18} /> {item.label}
              </div>
            </Link>
          );
        })}

        <div style={{ marginTop: '20px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '10px', opacity: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          PLANNING & STRATEGY <ChevronDown size={14} />
        </div>
        
        <Link href="/agent" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={`sidebar-item ${pathname === '/agent' ? 'active' : ''}`} style={{ color: 'white' }}>
            <Briefcase size={18} color="#ef4444" /> Intelligent Test Planning Agent
          </div>
        </Link>
        <Link href="/test-scenario-agent" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={`sidebar-item ${pathname === '/test-scenario-agent' ? 'active' : ''}`} style={{ color: 'white' }}>
            <FileText size={18} color="#8b5cf6" /> Intelligent Test Scenario Agent
          </div>
        </Link>
        <Link href="/test-strategy-agent" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={`sidebar-item ${pathname === '/test-strategy-agent' ? 'active' : ''}`} style={{ color: 'white' }}>
            <Target size={18} color="#eab308" /> Intelligent Test Strategy Agent
          </div>
        </Link>
        <Link href="/test-case-agent" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={`sidebar-item ${pathname === '/test-case-agent' ? 'active' : ''}`} style={{ color: 'white' }}>
            <FileText size={18} color="#10b981" /> Intelligent Test Case Agent
          </div>
        </Link>
      </aside>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="modal-overlay" onClick={() => setIsProfileOpen(false)}>
          <div className="profile-modal" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="profile-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                <div className="profile-avatar">
                  {(editedName || 'G').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, marginRight: '20px' }}>
                  <input 
                    className="name-input"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter User Name..."
                  />
                  <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>Global Profile & Connection Setup</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsProfileOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="profile-body" style={{ padding: '24px' }}>
              
              <div className="info-section">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} /> LLM Connection Setup
                  {llmTestSuccess && <span className="status-badge connected" style={{ marginLeft: 'auto' }}>Connected ✅</span>}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Provider</label>
                    <select className="input-field" style={{ padding: '8px', width: '100%' }} value={llmProvider} onChange={e=>handleLlmChange(setLlmProvider, e.target.value)}>
                      <option value="Ollama">Ollama (Local)</option>
                      <option value="GROQ">GROQ</option>
                      <option value="Grok">Grok</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Model Name</label>
                    <input className="input-field" style={{ padding: '8px', width: '100%' }} value={llmModel} onChange={e=>handleLlmChange(setLlmModel, e.target.value)} placeholder="e.g. llama3" />
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>API Key / Base URL</label>
                  <input className="input-field" style={{ padding: '8px', width: '100%' }} type="password" value={llmProvider === 'Ollama' ? llmBaseUrl : llmKey} onChange={e=>{
                    if(llmProvider === 'Ollama') handleLlmChange(setLlmBaseUrl, e.target.value); 
                    else handleLlmChange(setLlmKey, e.target.value);
                  }} placeholder="Token or backend URL" />
                </div>
                
                <button 
                  className="btn-primary" 
                  style={{ marginTop: '0.5rem', width: '100%', backgroundColor: '#2563eb', padding: '8px' }} 
                  onClick={testLlm} 
                  disabled={loading}
                >
                  {loading ? 'Testing...' : 'Test LLM Connection'}
                </button>
                {llmTestStatus && (
                  <div style={{ 
                    marginTop: '0.75rem', padding: '0.5rem', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
                    backgroundColor: llmTestSuccess === true ? 'rgba(16, 185, 129, 0.1)' : llmTestSuccess === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
                    color: llmTestSuccess === true ? '#10b981' : llmTestSuccess === false ? 'var(--error-color)' : 'var(--text-secondary)'
                  }}>
                    {llmTestStatus}
                  </div>
                )}
              </div>

              <div className="info-section" style={{ marginTop: '20px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={16} /> Jira Connection Setup
                  {jiraTestSuccess && <span className="status-badge connected" style={{ marginLeft: 'auto' }}>Connected ✅</span>}
                </h3>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Jira URL</label>
                  <input className="input-field" style={{ padding: '8px', width: '100%' }} value={jiraUrl} onChange={e=>handleJiraChange(setJiraUrl, e.target.value)} placeholder="https://your-domain.atlassian.net" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Jira Email</label>
                    <input className="input-field" style={{ padding: '8px', width: '100%' }} value={jiraEmail} onChange={e=>handleJiraChange(setJiraEmail, e.target.value)} placeholder="email@company.com" />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>API Token</label>
                    <input type="password" className="input-field" style={{ padding: '8px', width: '100%' }} value={jiraToken} onChange={e=>handleJiraChange(setJiraToken, e.target.value)} placeholder="Jira tokens" />
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ marginTop: '1rem', width: '100%', backgroundColor: '#2563eb', padding: '8px' }} 
                  onClick={testJira} 
                  disabled={loading}
                >
                  {loading ? 'Testing...' : 'Test Jira Connection'}
                </button>
                {jiraTestStatus && (
                  <div style={{ 
                    marginTop: '0.75rem', padding: '0.5rem', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
                    backgroundColor: jiraTestSuccess === true ? 'rgba(16, 185, 129, 0.1)' : jiraTestSuccess === false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0,0,0,0.05)',
                    color: jiraTestSuccess === true ? '#10b981' : jiraTestSuccess === false ? 'var(--error-color)' : 'var(--text-secondary)'
                  }}>
                    {jiraTestStatus}
                  </div>
                )}
              </div>

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', fontSize: '13px' }}>
                <p style={{ margin: 0, color: '#3b82f6' }}><strong>💡 Note:</strong> Configure these settings globally here to use them instantly across all AI Agents without needing to re-enter them on each screen.</p>
              </div>
            </div>

            <div className="profile-footer" style={{ display: 'flex', gap: '10px', padding: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsProfileOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={handleSaveSettings}>
                Save Global Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .sidebar {
          width: 260px;
          background-color: var(--sidebar-bg);
          display: flex;
          flex-direction: column;
          padding: 1.5rem 1rem;
          color: var(--sidebar-text);
          flex-shrink: 0;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .sidebar-item {
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 5px;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
          font-size: 14px;
        }

        .sidebar-item:hover {
          background-color: rgba(255,255,255,0.05);
          color: white;
        }

        .sidebar-item.active {
          background-color: var(--sidebar-active-bg);
          color: white;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .profile-modal {
          background: var(--card-bg);
          width: 400px;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-glass);
          overflow: hidden;
          animation: slideUp 0.3s ease;
        }

        .profile-header {
          padding: 24px;
          background: linear-gradient(135deg, var(--sidebar-active-bg), #60a5fa);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .profile-avatar {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          backdrop-filter: blur(5px);
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .close-btn:hover {
          opacity: 1;
        }

        .name-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: white;
          font-size: 18px;
          font-weight: 600;
          padding: 4px 8px;
          margin-bottom: 4px;
          width: 100%;
          font-family: inherit;
        }

        .name-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.2);
          border-color: white;
        }

        .profile-body {
          padding: 24px;
        }

        .info-section {
          margin-bottom: 24px;
        }

        .info-section h3 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.5;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .info-label {
          color: var(--text-secondary);
        }

        .info-value {
          font-weight: 500;
        }

        .status-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.connected {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success-color);
        }

        .profile-footer {
          padding: 24px;
          border-top: 1px solid var(--border-color);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
