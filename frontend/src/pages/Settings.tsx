import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Users, 
  Bell, 
  Palette, 
  Shield, 
  LogOut, 
  Plus,
  Share2,
  ChevronRight,
  Sparkles,
  Download,
  Loader2
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <UserIcon size={18} /> },
    { id: 'family', label: 'Family Management', icon: <Users size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
    { id: 'security', label: 'Privacy & Security', icon: <Shield size={18} /> },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-brand-warm-900">Settings</h1>
        <p className="text-brand-warm-500">Manage your personal account and family settings.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="lg:w-72 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-brand-peach text-white shadow-soft' 
                  : 'text-brand-warm-500 hover:bg-white hover:text-brand-warm-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
          <div className="mt-8">
            <button 
              onClick={logout}
              className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 glass p-10 rounded-4xl bg-white shadow-soft">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-8 border-brand-warm-50 shadow-soft"
                  style={{ backgroundColor: user?.avatar_color || '#FFB3A7' }}
                >
                  {user?.full_name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-warm-900">{user?.full_name}</h3>
                  <p className="text-brand-warm-500">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-warm-700 ml-1">Username</label>
                  <input type="text" value={user?.username} readOnly className="w-full px-6 py-4 bg-brand-warm-50 rounded-2xl outline-none border border-brand-warm-100 text-brand-warm-600" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-warm-700 ml-1">Role</label>
                  <input type="text" value={user?.role} readOnly className="w-full px-6 py-4 bg-brand-warm-50 rounded-2xl outline-none border border-brand-warm-100 text-brand-warm-600 capitalize" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-warm-700 ml-1">Account Type</label>
                  <div className="px-6 py-4 bg-brand-warm-50 rounded-2xl border border-brand-warm-100 text-brand-warm-600 flex items-center justify-between">
                    <span>{user?.is_senior ? 'Senior Citizen Mode' : 'Standard Mode'}</span>
                    <Sparkles size={16} className={user?.is_senior ? 'text-brand-peach' : 'text-brand-warm-300'} />
                  </div>
                </div>
              </div>
              
              <button className="btn-primary">Update Profile</button>

              <div className="pt-8 border-t border-brand-warm-100">
                <h4 className="font-bold text-brand-warm-800 mb-4 flex items-center gap-2">
                  <Download size={18} className="text-brand-peach" /> Data & Privacy
                </h4>
                <div className="p-6 bg-brand-warm-50 rounded-3xl border border-brand-warm-100 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-brand-warm-800">Export Family Data</p>
                    <p className="text-xs text-brand-warm-500">Download a full summary of your family's activities and wellness trends.</p>
                  </div>
                  <button 
                    onClick={async () => {
                      const res = await api.get('/export/summary');
                      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `family-hub-export-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                    }}
                    className="btn-secondary text-sm"
                  >
                    Export JSON
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-brand-warm-900">Family Members</h3>
                <button className="flex items-center gap-2 text-brand-peach font-bold text-sm">
                  <Plus size={18} /> Invite New Member
                </button>
              </div>

              <div className="space-y-4">
                <MemberItem name="Jane Doe" role="Parent" color="#FFB3A7" isMe={true} />
                <MemberItem name="John Doe" role="Parent" color="#A5D8FF" />
                <MemberItem name="Grandma Sarah" role="Elder" color="#E6E6FA" isSenior={true} />
                <MemberItem name="Lily" role="Child" color="#B2F2BB" />
              </div>

              <div className="p-8 bg-brand-warm-50 rounded-3xl border border-brand-warm-100">
                <h4 className="font-bold text-brand-warm-800 mb-4 flex items-center gap-2">
                  <Share2 size={18} className="text-brand-peach" /> Invite Code
                </h4>
                <div className="flex items-center gap-4">
                  <code className="flex-1 bg-white px-6 py-4 rounded-2xl font-mono text-xl font-bold tracking-widest text-brand-peach border border-brand-warm-200">
                    HUB-4291-X
                  </code>
                  <button className="btn-primary px-8">Copy</button>
                </div>
                <p className="mt-4 text-xs text-brand-warm-500">Share this code with family members to join your private hub.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MemberItem = ({ name, role, color, isMe, isSenior }: { name: string, role: string, color: string, isMe?: boolean, isSenior?: boolean }) => (
  <div className="flex items-center gap-4 p-5 rounded-3xl bg-brand-warm-50/50 border border-brand-warm-100 hover:bg-white hover:shadow-soft transition-all cursor-pointer group">
    <div 
      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
      style={{ backgroundColor: color }}
    >
      {name[0]}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h4 className="font-bold text-brand-warm-800">{name}</h4>
        {isMe && <span className="text-[10px] bg-brand-peach/10 text-brand-peach px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Me</span>}
        {isSenior && <Sparkles size={14} className="text-brand-sun" />}
      </div>
      <p className="text-xs text-brand-warm-500 font-medium uppercase tracking-widest mt-0.5">{role}</p>
    </div>
    <ChevronRight size={18} className="text-brand-warm-300 group-hover:text-brand-peach transition-colors" />
  </div>
);

export default Settings;
