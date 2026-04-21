import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, GraduationCap, Heart, User, LogOut, Menu, X, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ onMenuClick }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="left-nav">
          <button className="mobile-menu-btn" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          
          <Link to="/" className="logo">
            <GraduationCap size={32} className="logo-icon" />
            <span>MoroccoEdu</span>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/favorites" className="nav-item">
            <Heart size={20} />
            <span className="nav-text">Favorites</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              {(user?.role === 'professor' || user?.role === 'admin') && (
                <Link to="/dashboard" className="nav-item dashboard-link">
                  <LayoutDashboard size={20} />
                  <span className="nav-text">Dashboard</span>
                </Link>
              )}
              <Link to="/settings" className="nav-item">
                <Settings size={20} />
                <span className="nav-text">Settings</span>
              </Link>
              <Link to="/profile" className="nav-item">
                <User size={20} />
                <span className="nav-text">{user?.name}</span>
              </Link>
              <button onClick={handleLogout} className="nav-item logout-btn">
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
          
          <button onClick={() => toggleTheme()} className="theme-toggle" title="Switch Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
