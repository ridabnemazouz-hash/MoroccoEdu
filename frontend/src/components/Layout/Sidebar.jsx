import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Building2, GraduationCap, BookOpen, Calendar, Package, Plus, Home, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isMobileOpen, closeMobileMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isProfessor } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
    if (closeMobileMenu) closeMobileMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isMobileOpen && <div className="mobile-overlay" onClick={closeMobileMenu} />}
      <aside className={`left-sidebar ${isMobileOpen ? 'open' : ''}`}>
      {isProfessor && (
        <button className="create-resource-btn" onClick={() => navigate('/create')}>
          <Plus size={18} />
          Create Resource
        </button>
      )}

      <div className="nav-section">
        <div className="nav-section-title">Browse</div>
        <div className="nav-item" onClick={() => handleNavigate('/')} style={isActive('/') ? { background: 'var(--accent-bg)', color: 'var(--accent)', fontWeight: 600 } : {}}>
          <Home size={20} />
          <span className="nav-item-label">Home</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigate('/trending')} style={isActive('/trending') ? { background: 'var(--accent-bg)', color: 'var(--accent)', fontWeight: 600 } : {}}>
          <TrendingUp size={20} />
          <span className="nav-item-label">Trending</span>
        </div>
      </div>

      <div className="nav-divider" />

      <div className="nav-section">
        <div className="nav-section-title">Academic Levels</div>
        <div className="nav-item" onClick={() => handleNavigate('/explorer/countries')} style={isActive('/explorer/countries') ? { background: 'var(--accent-bg)', color: 'var(--accent)' } : {}}>
          <Globe size={20} />
          <span className="nav-item-label">Countries</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigate('/explorer/cities')} style={isActive('/explorer/cities') ? { background: 'var(--accent-bg)', color: 'var(--accent)' } : {}}>
          <Building2 size={20} />
          <span className="nav-item-label">Cities</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigate('/explorer/schools')} style={isActive('/explorer/schools') ? { background: 'var(--accent-bg)', color: 'var(--accent)' } : {}}>
          <GraduationCap size={20} />
          <span className="nav-item-label">Schools</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigate('/explorer/fields')} style={isActive('/explorer/fields') ? { background: 'var(--accent-bg)', color: 'var(--accent)' } : {}}>
          <BookOpen size={20} />
          <span className="nav-item-label">Fields</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigate('/explorer/semesters')} style={isActive('/explorer/semesters') ? { background: 'var(--accent-bg)', color: 'var(--accent)' } : {}}>
          <Calendar size={20} />
          <span className="nav-item-label">Semesters</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigate('/explorer/modules')} style={isActive('/explorer/modules') ? { background: 'var(--accent-bg)', color: 'var(--accent)' } : {}}>
          <Package size={20} />
          <span className="nav-item-label">Modules</span>
        </div>
      </div>

      <div className="nav-divider" />

      <div className="nav-section">
        <div className="nav-section-title">Account</div>
        {isAuthenticated ? (
          <>
            <div className="nav-item" onClick={() => handleNavigate('/profile')}>
              <User size={20} />
              <span className="nav-item-label">Profile</span>
            </div>
          </>
        ) : (
          <div className="nav-item" onClick={() => handleNavigate('/login')}>
            <User size={20} />
            <span className="nav-item-label">Login / Register</span>
          </div>
        )}
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
