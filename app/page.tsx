'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Clock, 
  TrendingUp,
  X,
  FileText,
  Trash2,
  Calendar,
  Target
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    plansGenerated: 0,
    jiraStatus: 'Disconnected',
    llmStatus: 'Offline',
    lastGenerated: 'Never'
  });

  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      const hasJira = !!localStorage.getItem('jiraToken');
      const hasLLM = !!localStorage.getItem('llmKey') || !!localStorage.getItem('llmBaseUrl');
      
      const historyRaw = localStorage.getItem('testPlanHistory');
      const historyArr = historyRaw ? JSON.parse(historyRaw) : [];
      setHistory(historyArr);

      setStats({
        plansGenerated: historyArr.length,
        jiraStatus: hasJira ? 'Connected' : 'Disconnected',
        llmStatus: hasLLM ? 'Active' : 'Offline',
        lastGenerated: historyArr.length > 0 ? historyArr[0].date : 'Never'
      });
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      localStorage.removeItem('testPlanHistory');
      setHistory([]);
      setStats(prev => ({ ...prev, plansGenerated: 0, lastGenerated: 'Never' }));
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ padding: '8px', background: `${color}10`, borderRadius: '8px', color: color }}>
          <Icon size={20} />
        </div>
        <TrendingUp size={14} style={{ opacity: 0.3 }} />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>{label}</div>
        <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Welcome back! <Sparkles color="#eab308" fill="#eab308" size={32} />
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '8px' }}>
          Your AI-powered testing command center. Manage your connections and generate plans.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <StatCard icon={Briefcase} label="Plans Generated" value={stats.plansGenerated} color="#3b82f6" />
        <StatCard icon={CheckCircle2} label="Jira Status" value={stats.jiraStatus} color={stats.jiraStatus === 'Connected' ? '#10b981' : '#f59e0b'} />
        <StatCard icon={Zap} label="AI Engine" value={stats.llmStatus} color={stats.llmStatus === 'Active' ? '#10b981' : '#f59e0b'} />
        <StatCard icon={Clock} label="Last Active" value={stats.lastGenerated} color="#8b5cf6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <Link href="/agent" style={{ textDecoration: 'none' }}>
              <div className="action-card">
                <div className="action-icon" style={{ backgroundColor: '#3b82f6' }}><Sparkles size={20} /></div>
                <div>
                  <div className="action-title">Generate Test Plan</div>
                  <div className="action-desc">Transform Jira stories with AI</div>
                </div>
                <ArrowRight size={16} className="arrow" />
              </div>
            </Link>
            <Link href="/test-scenario-agent" style={{ textDecoration: 'none' }}>
              <div className="action-card">
                <div className="action-icon" style={{ backgroundColor: '#8b5cf6' }}><FileText size={20} /></div>
                <div>
                  <div className="action-title">Generate Test Scenarios</div>
                  <div className="action-desc">Create Test Scenarios with AI</div>
                </div>
                <ArrowRight size={16} className="arrow" />
              </div>
            </Link>
            <Link href="/test-case-agent" style={{ textDecoration: 'none' }}>
              <div className="action-card">
                <div className="action-icon" style={{ backgroundColor: '#10b981' }}><FileText size={20} /></div>
                <div>
                  <div className="action-title">Generate Test Cases</div>
                  <div className="action-desc">Create Test Cases from description</div>
                </div>
                <ArrowRight size={16} className="arrow" />
              </div>
            </Link>
            <Link href="/test-strategy-agent" style={{ textDecoration: 'none' }}>
              <div className="action-card">
                <div className="action-icon" style={{ backgroundColor: '#eab308' }}><Target size={20} /></div>
                <div>
                  <div className="action-title">Generate Test Strategy</div>
                  <div className="action-desc">Create Test Strategy with AI</div>
                </div>
                <ArrowRight size={16} className="arrow" />
              </div>
            </Link>
            <div 
              className={`action-card ${history.length === 0 ? 'disabled' : ''}`} 
              onClick={() => history.length > 0 && setIsHistoryOpen(true)}
              style={{ cursor: history.length > 0 ? 'pointer' : 'default', opacity: history.length > 0 ? 1 : 0.6, gridColumn: 'span 2' }}
            >
              <div className="action-icon" style={{ backgroundColor: '#f59e0b' }}><LayoutDashboard size={20} /></div>
              <div>
                <div className="action-title">View Activity</div>
                <div className="action-desc">Review previous generations</div>
              </div>
              <ArrowRight size={16} className="arrow" />
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>System Health</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={16} color="#10b981" /> API Connectivity</span>
              <span style={{ fontWeight: '600', color: '#10b981' }}>Operational</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={16} color="#3b82f6" /> AI Latency</span>
              <span style={{ fontWeight: '600' }}>Low</span>
            </div>
            <div style={{ marginTop: '10px', padding: '15px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              All systems are performing normally. AI response times are optimized.
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="modal-overlay" onClick={() => { setIsHistoryOpen(false); setViewingPlan(null); }}>
          <div className="history-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={20} /> Activity History
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="clear-btn" onClick={clearHistory}>
                  <Trash2 size={16} /> Clear All
                </button>
                <button className="close-btn" onClick={() => { setIsHistoryOpen(false); setViewingPlan(null); }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="modal-body">
              {viewingPlan ? (
                <div className="plan-viewer">
                  <button className="back-btn" onClick={() => setViewingPlan(null)}>
                    ← Back to List
                  </button>
                  <div className="plan-content">
                    <ReactMarkdown>{viewingPlan.plan}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="history-list">
                  {history.map(item => (
                    <div key={item.id} className="history-item" onClick={() => setViewingPlan(item)}>
                      <div className="history-icon"><FileText size={18} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.ticketId}</div>
                        <div style={{ fontSize: '12px', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {item.date}
                        </div>
                      </div>
                      <div style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(37,99,235,0.1)', color: '#2563eb', borderRadius: '4px' }}>
                        {item.model}
                      </div>
                      <ArrowRight size={14} style={{ opacity: 0.3 }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .action-card {
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.3s ease;
          position: relative;
          background: rgba(255,255,255,0.02);
        }
        .action-card:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          transform: translateY(-2px);
        }
        .action-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .action-title {
          font-weight: 700;
          font-size: 15px;
          color: var(--text-primary);
        }
        .action-desc {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .arrow {
          position: absolute;
          right: 1.5rem;
          opacity: 0;
          transition: all 0.3s ease;
          color: #3b82f6;
        }
        .action-card:hover .arrow {
          opacity: 1;
          transform: translateX(5px);
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
        }

        .history-modal {
          background: var(--card-bg);
          width: 600px;
          max-height: 80vh;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-glass);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .clear-btn {
          background: none;
          border: 1px solid var(--error-color);
          color: var(--error-color);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .clear-btn:hover {
          background: var(--error-color);
          color: white;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .history-item:hover {
          background: rgba(37, 99, 235, 0.05);
          border-color: #3b82f6;
        }

        .history-icon {
          width: 36px;
          height: 36px;
          background: rgba(0,0,0,0.05);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .plan-viewer {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .back-btn {
          align-self: flex-start;
          background: none;
          border: none;
          color: #3b82f6;
          font-weight: 600;
          cursor: pointer;
        }

        .plan-content {
          padding: 1.5rem;
          background: rgba(0,0,0,0.02);
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
