import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  HeartPulse, 
  Image as ImageIcon, 
  Users, 
  ShieldCheck, 
  Settings,
  LogOut,
  Sparkles,
  Sun,
  Moon,
  Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
    { icon: CalendarDays, label: 'Organizer', path: '/app/organizer' },
    { icon: HeartPulse, label: 'Family Care', path: '/app/care' },
    { icon: ImageIcon, label: 'Memory Vault', path: '/app/memory' },
    { icon: Users, label: 'Bonding', path: '/app/bonding' },
    { icon: ShieldCheck, label: 'Safety Center', path: '/app/safety' },
    { icon: Settings, label: 'Settings', path: '/app/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-brand-warm-50 overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 glass border-r border-brand-warm-200 flex flex-col p-6 z-20"
      >
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-brand-peach rounded-xl flex items-center justify-center text-white shadow-soft">
            <Sparkles size={24} />
          </div>
          <h1 className="text-xl font-bold text-brand-warm-800 tracking-tight">AI Family Hub</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-peach text-white shadow-soft font-semibold' 
                    : 'text-brand-warm-500 hover:bg-white hover:text-brand-peach'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </div>
                {item.label === 'Dashboard' && (
                  <div className="w-5 h-5 bg-red-400 text-white text-[10px] rounded-full flex items-center justify-center font-bold">2</div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-brand-warm-100 dark:border-brand-warm-800 pt-6 space-y-2">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-brand-warm-500 hover:bg-white dark:hover:bg-brand-warm-800 transition-all duration-300"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
          
          <div className="flex items-center gap-3 px-2 mb-6">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: user?.avatar_color || '#FFB3A7' }}
            >
              {user?.full_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brand-warm-800 truncate">{user?.full_name}</p>
              <p className="text-xs text-brand-warm-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-brand-warm-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
