import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Users,
  Bell,
  Palette,
  Shield,
  LogOut,
  Plus,
  Share2,
  Download,
  Loader2,
  ChevronRight
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
  });
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await api.get('/auth/members');
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'family') fetchMembers();
  }, [activeTab]);

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <UserIcon size={18} /> },
    ...(user?.role === 'parent' ? [{ id: 'family', label: 'Family Management', icon: <Users size={18} /> }] : []),
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
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
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
        <div className="flex-1 glass p-10 rounded-4xl bg-white dark:bg-brand-warm-900 shadow-soft">
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
                  <label className="text-sm font-bold text-brand-warm-700 ml-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-brand-warm-50 rounded-2xl outline-none border border-brand-warm-100 text-brand-warm-600"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-warm-700 ml-1">Role</label>
                  <input type="text" value={user?.role} readOnly className="w-full px-6 py-4 bg-brand-warm-100 rounded-2xl outline-none border border-brand-warm-100 text-brand-warm-400 capitalize cursor-not-allowed" />
                </div>
              </div>

              <button
                onClick={async () => {
                  try {
                    await api.patch('/auth/me', { full_name: formData.full_name });
                    alert('Profile updated successfully!');
                  } catch (err) {
                    alert('Failed to update profile');
                  }
                }}
                className="btn-primary"
              >
                Update Profile
              </button>

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
                  <button
                    onClick={() => {
                      localStorage.removeItem(`onboarding_${user?.id}`);
                      api.patch('/auth/me', { onboarding_completed: false });
                      alert('Walkthrough reset! It will appear next time you visit the Dashboard.');
                    }}
                    className="btn-secondary text-sm"
                  >
                    Reset Walkthrough
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-brand-warm-900">Notification Preferences</h3>
              <div className="space-y-4">
                <ToggleItem title="Email Notifications" description="Receive weekly summaries and important family updates via email." defaultChecked={true} />
                <ToggleItem title="Push Notifications" description="Get real-time alerts for new tasks, messages, and memories." defaultChecked={true} />
                <ToggleItem title="Wellness Reminders" description="Assisted reminders for hydration, medication, and mood check-ins." defaultChecked={user?.is_senior} />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-brand-warm-900">Appearance Settings</h3>
              <div className="space-y-6">
                <div className="p-6 glass rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-warm-100 rounded-xl"><Palette size={20} className="text-brand-peach" /></div>
                    <div>
                      <p className="font-bold text-brand-warm-800">Application Theme</p>
                      <p className="text-xs text-brand-warm-500">Choose between light and dark mode for your experience.</p>
                    </div>
                  </div>
                  <div className="flex bg-brand-warm-100 dark:bg-brand-warm-800 p-1 rounded-xl">
                    <button
                      onClick={() => {
                        localStorage.setItem('theme', 'light');
                        document.documentElement.classList.remove('dark');
                        setActiveTab('appearance'); // Refresh state
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold ${!document.documentElement.classList.contains('dark') ? 'bg-white shadow-sm' : 'text-brand-warm-500'}`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem('theme', 'dark');
                        document.documentElement.classList.add('dark');
                        setActiveTab('appearance'); // Refresh state
                      }}
                      className={`px-4 py-2 rounded-lg text-xs font-bold ${document.documentElement.classList.contains('dark') ? 'bg-white shadow-sm' : 'text-brand-warm-500'}`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
                <ToggleItem title="High Contrast" description="Increase contrast for better readability, recommended for senior mode." defaultChecked={user?.is_senior} />
                <ToggleItem title="Animations" description="Enable smooth transitions and micro-interactions throughout the app." defaultChecked={true} />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-brand-warm-900">Privacy & Security</h3>
              <div className="space-y-4">
                <div className="p-6 glass rounded-3xl flex items-center justify-between group cursor-pointer hover:border-brand-peach/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-warm-100 rounded-xl group-hover:bg-brand-peach/10 transition-colors"><Shield size={20} className="text-brand-warm-600 group-hover:text-brand-peach" /></div>
                    <div>
                      <p className="font-bold text-brand-warm-800">Change Password</p>
                      <p className="text-xs text-brand-warm-500">Update your account password for better security.</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-brand-warm-300" />
                </div>
                <ToggleItem title="Two-Factor Authentication" description="Add an extra layer of security to your family hub account." />
                <ToggleItem title="Data Sharing" description="Allow anonymized data sharing to improve family wellness AI insights." defaultChecked={true} />
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
                {loadingMembers ? (
                  <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-peach" /></div>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-5 rounded-3xl bg-brand-warm-50/50 border border-brand-warm-100 hover:bg-white hover:shadow-soft transition-all group">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                        style={{ backgroundColor: member.avatar_color || '#FFB3A7' }}
                      >
                        {member.full_name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-brand-warm-800">{member.full_name}</h4>
                          {member.id === user?.id && <span className="text-[10px] bg-brand-peach/10 text-brand-peach px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Me</span>}
                        </div>
                        <p className="text-xs text-brand-warm-500 font-medium uppercase tracking-widest mt-0.5">{member.role}</p>
                      </div>
                      {user?.role === 'parent' && member.id !== user?.id && (
                        <div className="flex items-center gap-2">
                          <select
                            className="bg-transparent text-xs font-bold text-brand-peach outline-none"
                            value={member.role}
                            onChange={async (e) => {
                              await api.patch(`/auth/members/${member.id}/role?new_role=${e.target.value}`);
                              fetchMembers();
                            }}
                          >
                            <option value="parent">Parent</option>
                            <option value="kid">Kid</option>
                            <option value="elder">Elder</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 bg-brand-warm-50 rounded-3xl border border-brand-warm-100">
                <h4 className="font-bold text-brand-warm-800 mb-4 flex items-center gap-2">
                  <Share2 size={18} className="text-brand-peach" /> Invite Code
                </h4>
                <div className="flex items-center gap-4">
                  <code className="flex-1 bg-white dark:bg-brand-warm-800 px-6 py-4 rounded-2xl font-mono text-xl font-bold tracking-widest text-brand-peach border border-brand-warm-200 dark:border-brand-warm-700">
                    {user?.family?.invite_code || 'HUB-XXXX-X'}
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

const ToggleItem = ({ title, description, defaultChecked }: { title: string, description: string, defaultChecked?: boolean }) => {
  const [checked, setChecked] = useState(defaultChecked || false);
  return (
    <div className="p-6 glass rounded-3xl flex items-center justify-between">
      <div>
        <p className="font-bold text-brand-warm-800">{title}</p>
        <p className="text-xs text-brand-warm-500">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-all ${checked ? 'bg-brand-peach' : 'bg-brand-warm-200'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
};
export default Settings;
