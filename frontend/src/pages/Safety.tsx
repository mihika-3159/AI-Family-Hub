import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  AlertTriangle, 
  Sparkles,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Loader2
} from 'lucide-react';
import api from '../lib/api';
import ReactMarkdown from 'react-markdown';

const Safety: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'education' | 'checklist' | 'screentime'>('education');
  const [tips, setTips] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [securityAlert, setSecurityAlert] = useState<string>("Loading latest security alerts...");

  const getTips = async (topic: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/ai/safety-tips?topic=${topic}`);
      setTips(res.data.tips);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSecurityAlert = async () => {
    try {
      const res = await api.get('/ai/security-alert');
      setSecurityAlert(res.data.alert);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSecurityAlert();
  }, []);

  const checklists = [
    { id: 1, text: "Enable 2FA on all family bank accounts", completed: true },
    { id: 2, text: "Review social media privacy settings for kids", completed: false },
    { id: 3, text: "Set up a family 'safe word' for emergencies", completed: true },
    { id: 4, text: "Update router firmware to latest version", completed: false },
    { id: 5, text: "Teach seniors how to spot phishing emails", completed: true },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-brand-warm-900">Digital Safety Center</h1>
          <p className="text-brand-warm-500">Stay safe, secure, and aware in the digital world.</p>
        </div>
        <div className="w-16 h-16 bg-brand-mint/20 text-brand-mint rounded-2xl flex items-center justify-center shadow-sm">
          <ShieldCheck size={32} />
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-4 p-1 bg-brand-warm-100 rounded-2xl w-fit">
        <TabButton active={activeTab === 'education'} onClick={() => setActiveTab('education')} label="Education" icon={<BookOpen size={16} />} />
        <TabButton active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')} label="Safety Checklist" icon={<ShieldCheck size={16} />} />
        <TabButton active={activeTab === 'screentime'} onClick={() => setActiveTab('screentime')} label="Screen Reflection" icon={<Smartphone size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTab === 'education' && (
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SafetyCard 
                icon={<AlertTriangle className="text-brand-sun" />}
                title="Phishing & Scams"
                description="Learn how to spot malicious emails and fake websites targeting your family."
                onClick={() => getTips('Phishing Scams')}
              />
              <SafetyCard 
                icon={<Lock className="text-brand-sky" />}
                title="Password Hygiene"
                description="Best practices for creating and managing strong, unique passwords."
                onClick={() => getTips('Password Security')}
              />
              <SafetyCard 
                icon={<Smartphone className="text-brand-peach" />}
                title="Social Media Safety"
                description="Guidelines for safe sharing and interacting on social platforms."
                onClick={() => getTips('Social Media Safety')}
              />
              <SafetyCard 
                icon={<ShieldCheck className="text-brand-mint" />}
                title="Device Security"
                description="Keeping your phones, tablets, and laptops updated and protected."
                onClick={() => getTips('Device Security')}
              />
            </div>

            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="animate-spin text-brand-mint" size={32} />
              </div>
            )}

            {tips && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-4xl bg-brand-mint/5 border-brand-mint/20 relative"
              >
                <button onClick={() => setTips(null)} className="absolute top-4 right-4 text-brand-warm-400 p-2 hover:bg-brand-warm-100 rounded-full transition-colors">×</button>
                <div className="flex gap-4 mb-6 border-b border-brand-mint/10 pb-4">
                  <div className="w-10 h-10 bg-white dark:bg-brand-warm-700 rounded-xl flex items-center justify-center shadow-sm text-brand-mint"><Sparkles size={20} /></div>
                  <h3 className="text-xl font-bold text-brand-warm-800">AI Safety Hub</h3>
                </div>
                <div className="markdown-content">
                  <ReactMarkdown>{tips}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="lg:col-span-2 glass p-10 rounded-4xl bg-white dark:bg-brand-warm-900 shadow-soft">
            <h3 className="text-2xl font-bold text-brand-warm-900 mb-8">Family Security Checklist</h3>
            <div className="space-y-4">
              {checklists.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-5 rounded-2xl hover:bg-brand-warm-50 transition-all border border-brand-warm-100 bg-brand-warm-50/30">
                  <div className={`cursor-pointer ${item.completed ? 'text-brand-mint' : 'text-brand-warm-300'}`}>
                    {item.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <span className={`flex-1 font-medium ${item.completed ? 'text-brand-warm-400 line-through' : 'text-brand-warm-700'}`}>
                    {item.text}
                  </span>
                  <button className="text-brand-peach font-bold text-xs hover:underline">DETAILS</button>
                </div>
              ))}
            </div>
            <button className="w-full btn-secondary mt-10 py-4 flex items-center justify-center gap-2">
              <Plus size={18} /> Add New Security Goal
            </button>
          </div>
        )}

        {activeTab === 'screentime' && (
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-10 rounded-4xl bg-white dark:bg-brand-warm-900 shadow-soft text-center">
              <div className="w-24 h-24 bg-brand-sky/10 text-brand-sky rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone size={40} />
              </div>
              <h3 className="text-2xl font-bold text-brand-warm-900 mb-2">Screen Time Reflection</h3>
              <p className="text-brand-warm-500 mb-10 max-w-md mx-auto">
                Track how much time your family spends on devices and find a healthy balance together.
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-brand-warm-800">4h 20m</p>
                  <p className="text-xs font-bold text-brand-warm-400 uppercase tracking-widest">Avg. Daily Usage</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-green-500">-12%</p>
                  <p className="text-xs font-bold text-brand-warm-400 uppercase tracking-widest">Since last week</p>
                </div>
              </div>
              
              <button className="btn-primary px-10">View Detailed Report</button>
            </div>
          </div>
        )}

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-4xl bg-brand-sun/5 border-brand-sun/10">
            <h4 className="text-sm font-bold text-brand-sun mb-4 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={16} /> Latest AI Alert
            </h4>
            <p className="text-brand-warm-800 font-semibold mb-2 italic text-sm leading-relaxed">
              "{securityAlert}"
            </p>
            <p className="text-xs text-brand-warm-500">Real-time insight generated for your family</p>
          </div>

          <div className="glass p-8 rounded-4xl text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-warm-100 dark:text-brand-warm-800" />
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-mint" strokeDasharray="226" strokeDashoffset="45" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-brand-warm-800 text-lg">
                80%
              </div>
            </div>
            <h4 className="font-bold text-brand-warm-900 mb-1 text-sm">Security Score</h4>
            <p className="text-xs text-brand-warm-500">Your family is well protected!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold transition-all ${
      active ? 'bg-white text-brand-peach shadow-sm' : 'text-brand-warm-500 hover:text-brand-warm-700'
    }`}
  >
    {icon} {label}
  </button>
);

const SafetyCard = ({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) => (
  <div 
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className="p-8 glass rounded-3xl card-hover group cursor-pointer"
  >
    <div className="w-12 h-12 bg-white dark:bg-brand-warm-700 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-brand-warm-900 mb-3">{title}</h3>
    <p className="text-brand-warm-500 text-sm leading-relaxed mb-6">{description}</p>
    <div className="text-brand-peach font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
      Learn More <ChevronRight size={16} />
    </div>
  </div>
);

export default Safety;
