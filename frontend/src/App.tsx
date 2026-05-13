import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useAuth } from './hooks/useAuth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Organizer from './pages/Organizer';
import Care from './pages/Care';
import MemoryVault from './pages/MemoryVault';
import Bonding from './pages/Bonding';
import Safety from './pages/Safety';
import Settings from './pages/Settings';
import DashboardLayout from './components/layout/DashboardLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-brand-warm-50 text-brand-peach animate-pulse font-bold text-2xl">AI Family Hub...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    // Check if user has a theme preference
    const theme = localStorage.getItem('theme') || 'dark'; // Default to dark for hackathon
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="organizer" element={<Organizer />} />
            <Route path="care" element={<Care />} />
            <Route path="memory" element={<MemoryVault />} />
            <Route path="bonding" element={<Bonding />} />
            <Route path="safety" element={<Safety />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
      <Analytics />
    </>
  );
}

export default App;
