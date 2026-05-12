import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Users,
  Clock,
  DollarSign,
  Trophy,
  Flame,
  Star,
  Loader2
} from 'lucide-react';
import api from '../lib/api';

const Bonding: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    time: 60,
    budget: 0,
    interests: 'games, cooking'
  });

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/activities/suggest?time=${inputs.time}&budget=${inputs.budget}&interests=${inputs.interests}`);
      setSuggestions(res.data.suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-warm-900">Family Bonding</h1>
          <p className="text-brand-warm-500">Plan fun activities and build lasting connections.</p>
        </div>
        <div className="flex items-center gap-6 glass px-6 py-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <span className="font-bold text-brand-warm-800">5 Day Streak</span>
          </div>
          <div className="w-px h-6 bg-brand-warm-200" />
          <div className="flex items-center gap-2">
            <Trophy className="text-brand-sun" size={20} />
            <span className="font-bold text-brand-warm-800">1,240 pts</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Suggestion Engine */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-10 rounded-4xl relative overflow-hidden bg-gradient-to-br from-white dark:from-brand-warm-900 to-brand-peach/5">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-brand-warm-900 mb-6">Activity Generator</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-warm-700 flex items-center gap-2">
                    <Clock size={16} /> Time Available
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white border border-brand-warm-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach transition-all"
                    value={inputs.time}
                    onChange={(e) => setInputs({ ...inputs, time: parseInt(e.target.value) })}
                  >
                    <option value={30}>30 mins</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={240}>Half day</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-warm-700 flex items-center gap-2">
                    <DollarSign size={16} /> Budget
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white border border-brand-warm-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach transition-all"
                    value={inputs.budget}
                    onChange={(e) => setInputs({ ...inputs, budget: parseFloat(e.target.value) })}
                  >
                    <option value={0}>Free</option>
                    <option value={20}>Under $20</option>
                    <option value={50}>Under $50</option>
                    <option value={100}>Flexible</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-brand-warm-700 flex items-center gap-2">
                    <Users size={16} /> Interests
                  </label>
                  <input
                    type="text"
                    placeholder="Games, cooking..."
                    className="w-full px-4 py-3 bg-white dark:bg-brand-warm-800 border border-brand-warm-100 dark:border-brand-warm-700 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach transition-all text-sm"
                    value={inputs.interests}
                    onChange={(e) => setInputs({ ...inputs, interests: e.target.value })}
                  />
                </div>
              </div>
              <button
                onClick={generateSuggestions}
                disabled={loading}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg shadow-lg shadow-brand-peach/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                Suggest Bonding Activities
              </button>
            </div>
          </div>

          {suggestions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-4xl bg-brand-sun/5 border-brand-sun/10"
            >
              <h3 className="text-xl font-bold text-brand-warm-800 mb-6 flex items-center gap-2">
                <Sparkles className="text-brand-sun" /> AI Recommendations
              </h3>
              <div className="prose prose-brand-warm max-w-none text-brand-warm-700 whitespace-pre-wrap leading-relaxed">
                {suggestions}
              </div>
              <div className="mt-8 flex gap-4">
                <button className="btn-secondary text-sm">Save to Favorites</button>
                <button className="btn-primary text-sm">Let's do it!</button>
              </div>
            </motion.div>
          )}

          {/* Achievements placeholder */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-brand-warm-800">Family Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge icon="🎨" label="Creative Hub" date="May 2026" color="bg-brand-lavender" />
              <Badge icon="🥗" label="Healthy Chefs" date="Apr 2026" color="bg-brand-mint" />
              <Badge icon="🧩" label="Puzzle Masters" date="Mar 2026" color="bg-brand-sky" />
              <Badge icon="🏔️" label="Explorers" date="Feb 2026" color="bg-brand-sun" />
            </div>
          </div>
        </div>

        {/* Challenge Sidebar */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-4xl bg-brand-peach/5 border-brand-peach/10">
            <h3 className="text-lg font-bold text-brand-warm-900 mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-brand-peach" /> Weekly Challenge
            </h3>
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-white dark:bg-brand-warm-800 rounded-full flex items-center justify-center shadow-soft mx-auto relative">
                <span className="text-4xl">🍕</span>
                <div className="absolute -bottom-2 -right-2 bg-brand-sun text-white p-2 rounded-full shadow-sm">
                  <Star size={16} fill="white" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-brand-warm-800 mb-1 italic">"The Great Pizza Bake-Off"</h4>
                <p className="text-sm text-brand-warm-500">Make homemade pizzas with everyone adding one unique topping.</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-brand-warm-400 uppercase tracking-widest">
                  <span>Progress</span>
                  <span>75%</span>
                </div>
                <div className="h-2.5 bg-brand-warm-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-peach w-3/4 rounded-full" />
                </div>
              </div>
              <button className="w-full py-3 bg-white border border-brand-warm-200 rounded-2xl text-sm font-bold text-brand-warm-700 hover:bg-brand-warm-50 transition-all">
                Complete Challenge
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h4 className="font-bold text-brand-warm-800 mb-4 text-sm">Leaderboard</h4>
            <div className="space-y-3">
              <LeaderboardItem name="Mom" points={450} rank={1} />
              <LeaderboardItem name="Dad" points={380} rank={2} />
              <LeaderboardItem name="You" points={210} rank={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Badge = ({ icon, label, date, color }: { icon: string, label: string, date: string, color: string }) => (
  <div className={`p-6 rounded-3xl ${color}/10 border ${color}/20 text-center flex flex-col items-center gap-2 card-hover`}>
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-2">
      {icon}
    </div>
    <p className="text-xs font-bold text-brand-warm-800 leading-tight">{label}</p>
    <p className="text-[10px] text-brand-warm-400 uppercase font-bold">{date}</p>
  </div>
);

const LeaderboardItem = ({ name, points, rank }: { name: string, points: number, rank: number }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-warm-50 transition-all">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${rank === 1 ? 'bg-brand-sun text-white' : 'bg-brand-warm-200 text-brand-warm-500'}`}>
      {rank}
    </div>
    <div className="flex-1 text-sm font-semibold text-brand-warm-700">{name}</div>
    <div className="text-xs font-bold text-brand-warm-400">{points} pts</div>
  </div>
);

export default Bonding;
