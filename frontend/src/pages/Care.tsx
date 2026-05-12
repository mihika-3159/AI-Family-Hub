import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Pill,
  Trash2,
  Loader2
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

const Care: React.FC = () => {
  const [mood, setMood] = useState<number>(3);
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [medications, setMedications] = useState<any[]>([]);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    time_of_day: '',
    instructions: ''
  });
  const { user } = useAuth();

  const moods = [
    { emoji: '😔', value: 1, label: 'Low' },
    { emoji: '😐', value: 2, label: 'Neutral' },
    { emoji: '🙂', value: 3, label: 'Good' },
    { emoji: '😊', value: 4, label: 'Great' },
    { emoji: '✨', value: 5, label: 'Amazing' },
  ];

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/wellness/');
      setEntries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedications = async () => {
    try {
      const res = await api.get('/medications/');
      setMedications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchMedications();
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

  if (loading && entries.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-brand-peach" size={48} />
        <p className="text-brand-warm-500 font-bold">Synchronizing Family Wellbeing...</p>
      </div>
    );
  }

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
                    <stop offset="5%" stopColor="#FFB3A7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FFB3A7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 12 }} dy={10} />
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
          {/* Medication Management */}
          <div className="glass p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-brand-warm-800 flex items-center gap-2">
                <Pill size={18} className="text-brand-peach" /> Family Medications
              </h3>
              {user?.role === 'parent' && (
                <button onClick={() => setShowAddMed(true)} className="text-xs font-bold text-brand-peach hover:underline flex items-center gap-1">
                  <Plus size={14} /> Add New
                </button>
              )}
            </div>
            <div className="space-y-4">
              {medications.length > 0 ? (
                medications.map((med) => (
                  <div key={med.id} className="flex items-center justify-between p-4 bg-brand-warm-50/50 rounded-2xl border border-brand-warm-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-brand-warm-700 rounded-xl flex items-center justify-center text-brand-peach shadow-sm">
                        <Pill size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-warm-800">{med.name}</h4>
                        <p className="text-xs text-brand-warm-500">{med.dosage} • {med.frequency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-4">
                        <p className="text-[10px] font-bold text-brand-warm-400 uppercase tracking-widest">Scheduled</p>
                        <p className="text-xs font-bold text-brand-warm-700">{med.time_of_day || 'As needed'}</p>
                      </div>
                      {user?.role === 'parent' && (
                        <button
                          onClick={async () => {
                            await api.delete(`/medications/${med.id}`);
                            fetchMedications();
                          }}
                          className="p-2 text-brand-warm-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-brand-warm-400 text-center py-4">No medications logged.</p>
              )}
            </div>
          </div>

          <div className="glass p-6 rounded-3xl bg-brand-peach/5 border-brand-peach/10">
            <h4 className="text-xs font-bold text-brand-peach mb-3 uppercase tracking-wider">Health Reminder</h4>
            <p className="text-sm text-brand-warm-700 font-medium">
              {medications.length > 0
                ? `Next up: ${medications[0].name} scheduled for today.`
                : "All clear! No pending health tasks."}
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
            className="w-full max-w-md bg-white dark:bg-brand-warm-900 p-10 rounded-4xl shadow-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-brand-warm-900 mb-2">How are you feeling?</h2>
            <p className="text-brand-warm-500 mb-10">Take a moment to check in with yourself.</p>

            <div className="flex justify-between mb-12">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`flex flex-col items-center gap-2 transition-all ${mood === m.value ? 'scale-125' : 'opacity-40 hover:opacity-100 grayscale hover:grayscale-0'
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
      {/* Add Medication Modal */}
      {showAddMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-warm-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white dark:bg-brand-warm-900 p-10 rounded-4xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-brand-warm-900 mb-6">Add Medication</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-warm-500 uppercase tracking-widest mb-2 block">Medicine Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach"
                  placeholder="e.g., Vitamin C"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-brand-warm-500 uppercase tracking-widest mb-2 block">Dosage</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach"
                    placeholder="e.g., 500mg"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-warm-500 uppercase tracking-widest mb-2 block">Frequency</label>
                  <select
                    className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach"
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Twice Daily">Twice Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Every 4 Hours">Every 4 Hours</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-brand-warm-500 uppercase tracking-widest mb-2 block">Time of Day</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach"
                  placeholder="e.g., 08:00, 20:00"
                  value={newMed.time_of_day}
                  onChange={(e) => setNewMed({ ...newMed, time_of_day: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddMed(false)} className="flex-1 btn-secondary">Cancel</button>
                <button
                  onClick={async () => {
                    await api.post('/medications/', { ...newMed, user_id: user?.id });
                    setShowAddMed(false);
                    setNewMed({ name: '', dosage: '', frequency: 'Daily', time_of_day: '', instructions: '' });
                    fetchMedications();
                  }}
                  className="flex-1 btn-primary"
                >
                  Save Medicine
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};


export default Care;
