import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, GraduationCap, Heart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ theme, toggleTheme }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <GraduationCap size={32} className="logo-icon" />
          <span>MoroccoEdu</span>
        </Link>
        <div className="nav-links">
          <Link to="/favorites" className="nav-item">
            <Heart size={20} />
            <span className="nav-text">Favorites</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="nav-item">
                <User size={20} />
                <span className="nav-text">{user?.name}</span>
              </Link>
              <button onClick={handleLogout} className="nav-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <LogOut size={20} />
                <span className="nav-text">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-item">
              <User size={20} />
              <span className="nav-text">Login</span>
            </Link>
          )}
          
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
