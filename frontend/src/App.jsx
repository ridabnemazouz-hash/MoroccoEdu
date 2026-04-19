import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Layout/Sidebar';
import RightSidebar from './components/Layout/RightSidebar';
import Home from './pages/Home';
import SchoolDetail from './pages/SchoolDetail';
import Favorites from './pages/Favorites';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import FieldDetail from './pages/FieldDetail';
import SemesterDetail from './pages/SemesterDetail';
import ModuleDetail from './pages/ModuleDetail';
import Profile from './pages/Profile';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar theme={theme} toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} />
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/school/:id" element={<SchoolDetail />} />
                <Route path="/field/:fieldId/semesters" element={<FieldDetail />} />
                <Route path="/semester/:semesterId/modules" element={<SemesterDetail />} />
                <Route path="/module/:moduleId" element={<ModuleDetail />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <RightSidebar />
          </div>
          <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
