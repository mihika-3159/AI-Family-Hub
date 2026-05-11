import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Droplets, 
  Moon, 
  Activity, 
  Plus, 
  Sparkles,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../lib/api';

const Care: React.FC = () => {
  const [mood, setMood] = useState<number>(3);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const moods = [
    { emoji: '😔', value: 1, label: 'Low' },
    { emoji: '😐', value: 2, label: 'Neutral' },
    { emoji: '🙂', value: 3, label: 'Good' },
    { emoji: '😊', value: 4, label: 'Great' },
    { emoji: '✨', value: 5, label: 'Amazing' },
  ];

  const fetchEntries = async () => {
    try {
      const res = await api.get('/wellness/');
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleCheckIn = async () => {
    try {
      await api.post('/wellness/', {
        mood_score: mood,
        mood_emoji: moods.find(m => m.value === mood)?.emoji,
        energy_level: 4,
        sleep_hours: 7.5,
        water_glasses: 6,
        exercise_minutes: 30,
        stress_level: 2,
        date: new Date().toISOString()
      });
      setShowCheckIn(false);
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  // Mock data for chart if none exists
  const chartData = entries.length > 0 
    ? [...entries].reverse().map(e => ({ name: new Date(e.date).toLocaleDateString(), mood: e.mood_score, stress: e.stress_level }))
    : [
        { name: 'Mon', mood: 3, stress: 2 },
        { name: 'Tue', mood: 4, stress: 1 },
        { name: 'Wed', mood: 3, stress: 3 },
        { name: 'Thu', mood: 5, stress: 1 },
        { name: 'Fri', mood: 4, stress: 2 },
      ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-warm-900">Family Care & Wellbeing</h1>
          <p className="text-brand-warm-500">Monitor health, mood, and emotional support.</p>
        </div>
        <button onClick={() => setShowCheckIn(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Log Wellbeing
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Insights */}
        <div className="lg:col-span-2 space-y-8">
          {/* Trends Chart */}
          <div className="glass p-8 rounded-4xl h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-brand-warm-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-peach" /> Emotional Trends
              </h3>
              <div className="flex gap-4 text-xs font-semibold uppercase tracking-wider">
                <div className="flex items-center gap-2 text-brand-peach"><div className="w-2 h-2 rounded-full bg-brand-peach" /> Mood</div>
                <div className="flex items-center gap-2 text-brand-sky"><div className="w-2 h-2 rounded-full bg-brand-sky" /> Stress</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFB3A7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFB3A7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3A3A3', fontSize: 12}} dy={10} />
                <YAxis hide domain={[0, 6]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                />
                <Area type="monotone" dataKey="mood" stroke="#FFB3A7" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                <Area type="monotone" dataKey="stress" stroke="#A5D8FF" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Wellness Insight */}
          <div className="glass p-8 rounded-4xl bg-brand-lavender/5 border-brand-lavender/20 relative">
            <Sparkles className="absolute top-8 right-8 text-brand-lavender" size={32} />
            <h3 className="text-xl font-bold text-brand-warm-800 mb-4 flex items-center gap-2">
              <BrainCircuit size={20} className="text-brand-lavender" /> AI Wellness Analysis
            </h3>
            {entries.length > 0 && entries[0].ai_insight ? (
              <p className="text-brand-warm-700 leading-relaxed italic">
                "{entries[0].ai_insight}"
              </p>
            ) : (
              <p className="text-brand-warm-500 italic">
                Log your first wellbeing entry to get personalized AI insights.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h3 className="font-bold text-brand-warm-800 mb-6">Daily Habits</h3>
            <div className="space-y-6">
              <HabitItem icon={<Droplets className="text-brand-sky" />} label="Hydration" value="6/8 glasses" progress={75} />
              <HabitItem icon={<Moon className="text-brand-lavender" />} label="Sleep" value="7.5 hours" progress={85} />
              <HabitItem icon={<Activity className="text-brand-mint" />} label="Exercise" value="30 mins" progress={100} />
            </div>
          </div>

          <div className="glass p-6 rounded-3xl bg-brand-peach/5 border-brand-peach/10">
            <h4 className="text-xs font-bold text-brand-peach mb-3 uppercase tracking-wider">Health Reminder</h4>
            <p className="text-sm text-brand-warm-700 font-medium">
              "Don't forget to take your vitamins at 8 PM tonight!"
            </p>
          </div>
        </div>
      </div>

      {/* Mood Check-In Modal */}
      {showCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-warm-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white p-10 rounded-4xl shadow-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-brand-warm-900 mb-2">How are you feeling?</h2>
            <p className="text-brand-warm-500 mb-10">Take a moment to check in with yourself.</p>
            
            <div className="flex justify-between mb-12">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`flex flex-col items-center gap-2 transition-all ${
                    mood === m.value ? 'scale-125' : 'opacity-40 hover:opacity-100 grayscale hover:grayscale-0'
                  }`}
                >
                  <span className="text-4xl">{m.emoji}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${mood === m.value ? 'text-brand-peach' : 'text-brand-warm-400'}`}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowCheckIn(false)} className="flex-1 btn-secondary">Maybe Later</button>
              <button onClick={handleCheckIn} className="flex-1 btn-primary">Save Check-in</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const HabitItem = ({ icon, label, value, progress }: { icon: React.ReactNode, label: string, value: string, progress: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2 font-semibold text-brand-warm-700">
        {icon} {label}
      </div>
      <span className="text-brand-warm-500 font-medium">{value}</span>
    </div>
    <div className="h-2 bg-brand-warm-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className="h-full bg-brand-peach rounded-full"
      />
    </div>
  </div>
);

export default Care;
