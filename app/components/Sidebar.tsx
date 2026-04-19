'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, Briefcase, ChevronDown, X, ExternalLink, Mail, ShieldCheck, FileText, Target } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'User',
    email: '',
    url: '',
    provider: '',
    model: ''
  });
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    const updateProfile = () => {
      const name = localStorage.getItem('jiraDisplayName') || 'Guest User';
      setProfile({
        name: name,
        email: localStorage.getItem('jiraEmail') || 'Not Connected',
        url: localStorage.getItem('jiraUrl') || '',
        provider: localStorage.getItem('llmProvider') || 'None',
        model: localStorage.getItem('llmModel') || 'None'
      });
      setEditedName(name);
    };
    updateProfile();
    window.addEventListener('storage', updateProfile);
    return () => window.removeEventListener('storage', updateProfile);
  }, [isProfileOpen]);

  const handleSaveName = () => {
    localStorage.setItem('jiraDisplayName', editedName);
    setProfile((prev: any) => ({ ...prev, name: editedName }));
  };

  const menuItems = [
    { id: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { id: '/curriculum', icon: Users, label: 'Curriculum' },
    { id: 'Settings', icon: Settings, label: 'Settings' }
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
            <FileText size={18} color="#8b5cf6" /> Intelligent Test Scenario Gen Agent
          </div>
        </Link>
        <Link href="/test-strategy-agent" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={`sidebar-item ${pathname === '/test-strategy-agent' ? 'active' : ''}`} style={{ color: 'white' }}>
            <Target size={18} color="#eab308" /> Intelligent Test Strategy Gen Agent
          </div>
        </Link>
        <Link href="/test-case-agent" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className={`sidebar-item ${pathname === '/test-case-agent' ? 'active' : ''}`} style={{ color: 'white' }}>
            <FileText size={18} color="#10b981" /> Intelligent Test Case Gen Agent
          </div>
        </Link>
      </aside>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="modal-overlay" onClick={() => setIsProfileOpen(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <div className="profile-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="profile-avatar">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <input 
                    className="name-input"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter name..."
                  />
                  <p style={{ margin: 0, fontSize: '13px', opacity: 0.7 }}>{profile.email}</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setIsProfileOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="profile-body">
              <div className="info-section">
                <h3><Briefcase size={16} /> Jira Connection</h3>
                <div className="info-row">
                  <span className="info-label">Domain</span>
                  <span className="info-value">{profile.url || 'Not set'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status</span>
                  <span className="status-badge connected">Connected ✅</span>
                </div>
              </div>

              <div className="info-section">
                <h3><ShieldCheck size={16} /> LLM Integration</h3>
                <div className="info-row">
                  <span className="info-label">Provider</span>
                  <span className="info-value">{profile.provider}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Model</span>
                  <span className="info-value">{profile.model}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', fontSize: '13px' }}>
                <p style={{ margin: 0 }}>Setting details are saved locally in your browser for security.</p>
              </div>
            </div>

            <div className="profile-footer" style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsProfileOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ flex: 2 }} onClick={() => { handleSaveName(); setIsProfileOpen(false); }}>
                Save Changes
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
