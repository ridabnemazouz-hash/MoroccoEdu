import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Shield, Monitor, Palette, Bell, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('display');

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={20} /> },
    { id: 'profile', label: 'Profile', icon: <Shield size={20} /> },
    { id: 'display', label: 'Display', icon: <Monitor size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="settings-page"
      style={{ maxWidth: '1000px', margin: '0 auto' }}
    >
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>User Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem' }}>
        {/* Sidebar Tabs */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: activeTab === tab.id ? 'var(--bg-3)' : 'transparent',
                color: activeTab === tab.id ? 'var(--text-1)' : 'var(--text-2)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
          {activeTab === 'display' && (
            <section>
              <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Palette size={24} color="var(--accent)" />
                Display Options
              </h2>
              
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-1)' }}>Theme Mode</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  {[
                    { id: 'light', label: 'Light', desc: 'Perfect for daytime' },
                    { id: 'dark', label: 'Dark', desc: 'Standard dark theme' },
                    { id: 'midnight', label: 'Midnight', desc: 'AMOLED black' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => toggleTheme(t.id)}
                      style={{
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: theme === t.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                        background: theme === t.id ? 'var(--bg-3)' : 'var(--bg-2)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: 700, color: 'var(--text-1)', marginBottom: '4px' }}>{t.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-1)' }}>Interface Language</h3>
                <div className="glass" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe size={18} />
                    <span>English (US)</span>
                  </div>
                  <button style={{ color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600 }}>Change</button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'account' && (
            <section>
              <h2 style={{ marginBottom: '1.5rem' }}>Account Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-2)', fontSize: '0.9rem' }}>Email Address</label>
                  <div className="glass" style={{ padding: '0.75rem 1rem', background: 'var(--bg-1)' }}>{user?.email}</div>
                </div>
                <div>
                  <button className="btn-primary" style={{ width: 'fit-content' }}>Change Password</button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'profile' && (
            <section>
              <h2 style={{ marginBottom: '1.5rem' }}>Profile Settings</h2>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: 'var(--accent)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'white'
                }}>
                  {user?.name?.[0]}
                </div>
                <div>
                  <button className="btn-primary" style={{ marginBottom: '0.5rem' }}>Upload New Photo</button>
                  <p style={{ fontSize: '0.8rem' }}>JPG or PNG. Max size 2MB.</p>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-2)', fontSize: '0.9rem' }}>Display Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-1)',
                    color: 'var(--text-1)'
                  }}
                />
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
