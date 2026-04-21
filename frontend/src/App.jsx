import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Layout/Sidebar';
import RightSidebar from './components/Layout/RightSidebar';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const SchoolDetail = lazy(() => import('./pages/SchoolDetail'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const FieldDetail = lazy(() => import('./pages/FieldDetail'));
const SemesterDetail = lazy(() => import('./pages/SemesterDetail'));
const ModuleDetail = lazy(() => import('./pages/ModuleDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const UploadResource = lazy(() => import('./pages/UploadResource'));
const ProfessorDashboard = lazy(() => import('./pages/ProfessorDashboard'));
const Trending = lazy(() => import('./pages/Trending'));
const Explorer = lazy(() => import('./pages/Explorer'));

// Loading component for lazy-loaded routes
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

const AppContent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="app">
      <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="app-layout">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen} 
          closeMobileMenu={() => setIsMobileMenuOpen(false)} 
        />
        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/explorer/:level" element={<Explorer />} />
              <Route path="/school/:id" element={<SchoolDetail />} />
              <Route path="/field/:fieldId/semesters" element={<FieldDetail />} />
              <Route path="/semester/:semesterId/modules" element={<SemesterDetail />} />
              <Route path="/module/:moduleId" element={<ModuleDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/upload" element={<UploadResource />} />
              <Route path="/dashboard" element={<ProfessorDashboard />} />
            </Routes>
          </Suspense>
        </main>
        <RightSidebar />
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        theme={theme === 'light' ? 'light' : 'dark'} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
