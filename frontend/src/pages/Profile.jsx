import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>Please login to view your profile</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container" style={{ paddingTop: '6rem', maxWidth: '600px' }}>
      <div className="glass" style={{ padding: '3rem', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <User size={48} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{user.name}</h1>
          <p style={{ opacity: 0.6 }}>{user.email}</p>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Account Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.6 }}>Role:</span>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{user.role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.6 }}>Member since:</span>
              <span style={{ fontWeight: 600 }}>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: '#ef4444', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;
