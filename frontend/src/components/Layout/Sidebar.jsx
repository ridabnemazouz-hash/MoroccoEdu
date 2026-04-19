import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Building2, GraduationCap, BookOpen, Calendar, Package, Plus, Home, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isProfessor } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-nav">
      {isProfessor && (
        <button className="create-resource-btn" onClick={() => navigate('/create')}>
          <Plus size={18} />
          Create Resource
        </button>
      )}

      <div className="nav-section">
        <div className="nav-section-title">Browse</div>
        <div className="nav-item" onClick={() => navigate('/')} style={isActive('/') ? { background: 'var(--accent-bg)', color: 'var(--accent)', fontWeight: 600 } : {}}>
          <Home size={20} />
          <span className="nav-item-label">Home</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/trending')}>
          <TrendingUp size={20} />
          <span className="nav-item-label">Trending</span>
        </div>
      </div>

      <div className="nav-divider" />

      <div className="nav-section">
        <div className="nav-section-title">Academic Levels</div>
        <div className="nav-item">
          <Globe size={20} />
          <span className="nav-item-label">Countries</span>
        </div>
        <div className="nav-item">
          <Building2 size={20} />
          <span className="nav-item-label">Cities</span>
        </div>
        <div className="nav-item">
          <GraduationCap size={20} />
          <span className="nav-item-label">Schools</span>
        </div>
        <div className="nav-item">
          <BookOpen size={20} />
          <span className="nav-item-label">Fields</span>
        </div>
        <div className="nav-item">
          <Calendar size={20} />
          <span className="nav-item-label">Semesters</span>
        </div>
        <div className="nav-item">
          <Package size={20} />
          <span className="nav-item-label">Modules</span>
        </div>
      </div>

      <div className="nav-divider" />

      <div className="nav-section">
        <div className="nav-section-title">Account</div>
        {isAuthenticated ? (
          <>
            <div className="nav-item" onClick={() => navigate('/profile')}>
              <User size={20} />
              <span className="nav-item-label">Profile</span>
            </div>
          </>
        ) : (
          <div className="nav-item" onClick={() => navigate('/login')}>
            <User size={20} />
            <span className="nav-item-label">Login / Register</span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
