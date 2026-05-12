import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Heart, 
  Image as ImageIcon, 
  Sparkles, 
  ChevronRight,
  Plus,
  MessageSquare,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import SpeechBot from '../components/ai/SpeechBot';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [stats, setStats] = useState({
    tasks: 0,
    wellness: 0,
    memories: 0
  });
  const [topPriority, setTopPriority] = useState<any>(null);
  const [familyInsights, setFamilyInsights] = useState<string[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [updateText, setUpdateText] = useState('');

  const onboardingSteps = [
    { title: "Welcome home!", text: "This is your family dashboard. It's the central hub for everything happening in your household." },
    { title: "Family Organizer", text: "Use the Organizer to manage chores, grocery lists, and shared calendars. AI will help you balance the workload!" },
    { title: "Family Care", text: "Track mood, health habits, and set medication reminders here. We keep everyone's wellbeing in mind." },
    { title: "Memory Vault", text: "Preserve your family's precious moments. AI can even help you write beautiful stories from your photos." },
    { title: "AI Assistant", text: "I'm always here to help. Ask me to plan a weekend, suggest a meal, or check on a family member." }
  ];

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const [tasks, wellness, memories, insights] = await Promise.all([
          api.get('/tasks/'),
          api.get('/wellness/'),
          api.get('/memories/'),
          api.get('/ai/family-insights')
        ]);
        setStats({
          tasks: tasks.data.length,
          wellness: wellness.data.length,
          memories: memories.data.length
        });
        
        try {
          // Parse AI response if it's a string representation of a list
          const rawInsights = insights.data.insights;
          if (typeof rawInsights === 'string') {
             // Basic attempt to parse if it's JSON-like
             if (rawInsights.startsWith('[')) {
               setFamilyInsights(JSON.parse(rawInsights));
             } else {
               setFamilyInsights([rawInsights]);
             }
          } else {
            setFamilyInsights(rawInsights);
          }
        } catch (e) {
          setFamilyInsights(["Welcome back! Let's make today great.", "Check your tasks for any high priority items."]);
        }
        
        const sortedTasks = tasks.data.sort((a: any, b: any) => {
          const pMap: any = { high: 3, medium: 2, low: 1 };
          return pMap[b.priority] - pMap[a.priority];
        });
        setTopPriority(sortedTasks.find((t: any) => !t.is_completed));

        // Combine memories and tasks for activity feed
        const combined = [
          ...memories.data.map((m: any) => ({ icon: '📸', text: `${m.title} uploaded`, time: new Date(m.created_at).toLocaleString() })),
          ...tasks.data.filter((t: any) => t.is_completed).map((t: any) => ({ icon: '✅', text: `${t.title} completed`, time: new Date(t.updated_at).toLocaleString() }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
        
        setRecentActivities(combined);

        // Handle onboarding logic: Only if not in localStorage AND not marked as completed in DB
        const hasSeenOnboarding = localStorage.getItem(`onboarding_${user?.id}`);
        if (!hasSeenOnboarding && !user?.onboarding_completed) {
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    if (user?.family_id) fetchStats();
  }, [user]);

  const handleNextStep = () => {
    if (walkthroughStep < onboardingSteps.length - 1) {
      setWalkthroughStep(walkthroughStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem(`onboarding_${user?.id}`, 'true');
      api.patch(`/auth/me`, { onboarding_completed: true });
    }
  };

  const fetchWeeklySummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await api.get('/ai/weekly-summary');
      setWeeklySummary(res.data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-brand-warm-900 mb-2">
            Good evening, {(user?.full_name || 'Family').split(' ')[0]}!
          </h1>
          <p className="text-brand-warm-500">Your family is currently feeling <span className="text-brand-peach font-semibold italic">Peaceful</span>.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchWeeklySummary}
            disabled={summaryLoading}
            className="btn-secondary flex items-center gap-2"
          >
            {summaryLoading ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
            Weekly AI Summary
          </button>
          <button 
            onClick={() => setShowUpdateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> New Update
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Hub Widgets */}
        <div className="lg:col-span-2 space-y-8">
          {weeklySummary && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-4xl bg-brand-peach/5 border-brand-peach/20"
            >
              <h3 className="text-xl font-bold text-brand-warm-800 mb-4 flex items-center gap-2">
                <Sparkles className="text-brand-peach" size={20} /> Weekly Family Summary
              </h3>
              <p className="text-brand-warm-700 leading-relaxed italic whitespace-pre-wrap">"{weeklySummary}"</p>
            </motion.div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={<Calendar className="text-brand-peach" />} label="Tasks" value={stats.tasks} />
            <StatCard icon={<Heart className="text-red-400" />} label="Wellness" value={stats.wellness} />
            <StatCard icon={<ImageIcon className="text-brand-sky" />} label="Memories" value={stats.memories} />
          </div>

          {/* AI Insights Widget */}
          <div className="glass p-8 rounded-4xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
              <Sparkles className="text-brand-sun animate-pulse" size={32} />
            </div>
            <h3 className="text-xl font-bold text-brand-warm-800 mb-4 flex items-center gap-2">
              Family Insights
            </h3>
            <div className="space-y-4">
              {familyInsights.map((insight, i) => (
                <div key={i} className={`flex gap-4 p-4 rounded-2xl border ${i === 0 ? 'bg-brand-peach/5 border-brand-peach/10' : 'bg-brand-mint/5 border-brand-mint/10'}`}>
                  <div className="w-10 h-10 bg-white dark:bg-brand-warm-700 rounded-xl flex items-center justify-center shadow-sm">{i === 0 ? '💡' : '🍎'}</div>
                  <p className="text-brand-warm-700 text-sm leading-relaxed">
                    "{insight}"
                  </p>
                </div>
              ))}
              {familyInsights.length === 0 && (
                 <div className="flex gap-4 p-4 bg-brand-peach/5 rounded-2xl border border-brand-peach/10">
                  <div className="w-10 h-10 bg-white dark:bg-brand-warm-700 rounded-xl flex items-center justify-center shadow-sm">💡</div>
                  <p className="text-brand-warm-700 text-sm leading-relaxed">
                    "Welcome back! I'm analyzing your family data to provide fresh insights."
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed placeholder */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-brand-warm-800">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((act, i) => (
                  <ActivityItem key={i} icon={act.icon} text={act.text} time={act.time} />
                ))
              ) : (
                <div className="text-center py-10 glass rounded-3xl text-brand-warm-400">
                  <p>No recent activity. Start by adding a task or memory!</p>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Sidebar Widgets */}
          <div className="space-y-8">
            {/* Top Priority from Real Data */}
            <div className="glass p-8 rounded-4xl bg-brand-sky/5 border-brand-sky/10">
              <h4 className="text-sm font-bold text-brand-sky mb-2 uppercase tracking-wider">Family Top Priority</h4>
              <p className="text-brand-warm-700 font-semibold italic text-sm leading-relaxed">
                {topPriority ? `"${topPriority.title}" is our current focus. Let's get it done!` : '"Enjoy some quality family time today!"'}
              </p>
            </div>

            {/* AI Assistant Chat Widget */}
            <div className="glass p-6 rounded-4xl flex flex-col h-[400px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-peach rounded-lg flex items-center justify-center text-white shadow-sm">
                <MessageSquare size={16} />
              </div>
              <h3 className="font-bold text-brand-warm-800">AI Assistant</h3>
            </div>
            
            <div className="flex-1 bg-brand-warm-50/50 dark:bg-black/20 rounded-2xl p-4 overflow-y-auto mb-4 text-sm text-brand-warm-600 dark:text-brand-warm-300">
              <p className="bg-white dark:bg-brand-warm-700 p-3 rounded-2xl rounded-tl-none shadow-sm mb-4">
                Hello! I'm your AI Family Assistant. How can I help you today?
              </p>
            </div>

            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask me anything..."
                className="w-full pl-4 pr-12 py-3 bg-white border border-brand-warm-200 rounded-2xl focus:ring-2 focus:ring-brand-peach outline-none transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-peach text-white rounded-xl flex items-center justify-center shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-warm-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-white p-10 rounded-4xl shadow-2xl relative"
          >
            <div className="w-16 h-16 bg-brand-peach rounded-2xl flex items-center justify-center text-white shadow-soft mb-8">
              <Sparkles size={32} />
            </div>
            <h2 className="text-3xl font-bold text-brand-warm-900 mb-4">{onboardingSteps[walkthroughStep].title}</h2>
            <p className="text-brand-warm-600 text-lg leading-relaxed mb-10">
              {onboardingSteps[walkthroughStep].text}
            </p>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {onboardingSteps.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === walkthroughStep ? 'w-6 bg-brand-peach' : 'bg-brand-warm-200'}`} />
                ))}
              </div>
              <button onClick={handleNextStep} className="btn-primary">
                {walkthroughStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
              </button>
            </div>
            
            {/* Senior Mode Voice */}
            <SpeechBot 
              text={onboardingSteps[walkthroughStep].text} 
              enabled={user?.is_senior || false} 
            />
          </motion.div>
        </div>
      )}
      
      {/* New Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-warm-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white dark:bg-brand-warm-900 p-10 rounded-4xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-brand-warm-900 mb-6">Family Update</h2>
            <textarea
              className="w-full p-4 bg-brand-warm-50 border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach min-h-[150px] mb-6"
              placeholder="What's happening in the family?"
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setShowUpdateModal(false)} className="flex-1 btn-secondary">Cancel</button>
              <button 
                onClick={() => {
                  setShowUpdateModal(false);
                  setUpdateText('');
                  alert('Update posted to family hub!');
                }} 
                className="flex-1 btn-primary"
              >
                Post Update
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
  <div className="glass p-6 rounded-3xl text-center card-hover">
    <div className="w-10 h-10 bg-white dark:bg-brand-warm-700 rounded-xl flex items-center justify-center shadow-sm mx-auto mb-3">
      {icon}
    </div>
    <p className="text-2xl font-bold text-brand-warm-800">{value}</p>
    <p className="text-xs text-brand-warm-500 uppercase tracking-wider font-semibold">{label}</p>
  </div>
);

const ActivityItem = ({ icon, text, time }: { icon: string, text: string, time: string }) => (
  <div className="flex items-center gap-4 p-4 hover:bg-white rounded-2xl transition-all cursor-pointer group">
    <div className="w-12 h-12 bg-white dark:bg-brand-warm-700 rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-brand-warm-700 dark:text-brand-warm-200">{text}</p>
      <p className="text-xs text-brand-warm-400 dark:text-brand-warm-500">{time}</p>
    </div>
    <ChevronRight size={16} className="text-brand-warm-300 group-hover:text-brand-peach" />
  </div>
);

export default Dashboard;
