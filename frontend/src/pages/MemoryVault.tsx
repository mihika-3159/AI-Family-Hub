import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Image as ImageIcon, 
  Plus, 
  Calendar, 
  Sparkles,
  Search,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import api from '../lib/api';

const MemoryVault: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    description: '',
    memory_type: 'photo',
    event_date: new Date().toISOString().split('T')[0],
    attachment: null as File | null
  });

  const fetchMemories = async () => {
    try {
      const res = await api.get('/memories/');
      setMemories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', newMemory.title);
      data.append('description', newMemory.description);
      data.append('memory_type', newMemory.memory_type);
      data.append('event_date', newMemory.event_date);
      if (newMemory.attachment) {
        data.append('file', newMemory.attachment);
      }
      
      await api.post('/memories/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowAdd(false);
      setNewMemory({ title: '', description: '', memory_type: 'photo', event_date: new Date().toISOString().split('T')[0], attachment: null });
      fetchMemories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-warm-900">Memory Vault</h1>
          <p className="text-brand-warm-500">Capture and cherish your family's journey.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-warm-400" size={18} />
            <input 
              type="text" 
              placeholder="Search memories..."
              className="pl-12 pr-4 py-3 bg-white border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach transition-all"
            />
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
            <Camera size={20} /> Capture Moment
          </button>
        </div>
      </header>

      {/* Highlights / Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-4xl bg-brand-sun/5 border-brand-sun/10 relative overflow-hidden group cursor-pointer">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-brand-sun/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <h3 className="text-xl font-bold text-brand-warm-800 mb-2 flex items-center gap-2">
            <Sparkles size={20} className="text-brand-sun" /> On This Day
          </h3>
          <p className="text-brand-warm-600 mb-6 italic text-sm">"3 years ago today, you all went on that amazing mountain hike!"</p>
          <button className="text-brand-peach font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Relive Memory <ChevronRight size={16} />
          </button>
        </div>

        <div className="glass p-8 rounded-4xl bg-brand-lavender/5 border-brand-lavender/10 relative overflow-hidden group cursor-pointer">
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-brand-lavender/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <h3 className="text-xl font-bold text-brand-warm-800 mb-2 flex items-center gap-2">
            <BookOpen size={20} className="text-brand-lavender" /> Family Storybook
          </h3>
          <p className="text-brand-warm-600 mb-6 italic text-sm">AI-generated narrative of your family's recent month.</p>
          <button className="text-brand-peach font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Read Stories <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Memory Timeline */}
      <div className="space-y-12 relative pt-8">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-warm-100 hidden md:block" />

        {loading ? (
          <div className="text-center py-20 text-brand-warm-400">Opening the vault...</div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-4xl border border-dashed border-brand-warm-200">
            <div className="text-5xl mb-4">🎞️</div>
            <h3 className="text-xl font-bold text-brand-warm-800 mb-2">The vault is empty</h3>
            <p className="text-brand-warm-500 mb-8">Start capturing moments to build your family legacy.</p>
            <button onClick={() => setShowAdd(true)} className="btn-secondary">Add Your First Photo</button>
          </div>
        ) : (
          memories.map((memory, index) => (
            <motion.div 
              key={memory.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative pl-0 md:pl-24"
            >
              {/* Dot on timeline */}
              <div className="absolute left-7 top-0 w-3.5 h-3.5 bg-brand-peach rounded-full border-4 border-white shadow-sm hidden md:block" />
              
              <div className="glass p-8 rounded-4xl card-hover flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 h-48 bg-brand-warm-100 rounded-3xl overflow-hidden relative">
                  {memory.file_url ? (
                    <img src={memory.file_url} alt={memory.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-brand-warm-300">
                      <ImageIcon size={48} />
                      <span className="text-xs font-bold uppercase tracking-widest mt-2">{memory.memory_type}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-brand-peach uppercase tracking-widest block mb-1">
                        {new Date(memory.event_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}
                      </span>
                      <h3 className="text-2xl font-bold text-brand-warm-900">{memory.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-brand-warm-600 leading-relaxed">{memory.description}</p>
                  
                  {memory.ai_story && (
                    <div className="p-5 bg-brand-peach/5 border-l-4 border-brand-peach rounded-r-2xl">
                      <h4 className="text-xs font-bold text-brand-peach mb-2 uppercase tracking-widest flex items-center gap-1">
                        <Sparkles size={12} /> AI Story
                      </h4>
                      <p className="text-sm text-brand-warm-700 italic leading-relaxed">
                        "{memory.ai_story}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Memory Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-warm-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white p-10 rounded-4xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-brand-warm-900 mb-6">Capture a Moment</h2>
            <form onSubmit={handleAddMemory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-warm-700">Moment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Beach Trip"
                  className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach transition-all"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-warm-700">Description</label>
                <textarea
                  rows={3}
                  placeholder="Tell us what happened..."
                  className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach transition-all"
                  value={newMemory.description}
                  onChange={(e) => setNewMemory({ ...newMemory, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-brand-warm-700">Type</label>
                  <select
                    className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach"
                    value={newMemory.memory_type}
                    onChange={(e) => setNewMemory({ ...newMemory, memory_type: e.target.value })}
                  >
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                    <option value="journal">Journal</option>
                    <option value="milestone">Milestone</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-brand-warm-700">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach"
                    value={newMemory.event_date}
                    onChange={(e) => setNewMemory({ ...newMemory, event_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-warm-700">Attachment (Photo/File)</label>
                <div className="relative group">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => setNewMemory({ ...newMemory, attachment: e.target.files?.[0] || null })}
                  />
                  <div className="w-full px-4 py-6 bg-brand-warm-50 border-2 border-dashed border-brand-warm-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-brand-peach transition-all">
                    <Plus size={24} className="text-brand-warm-400 group-hover:text-brand-peach mb-2" />
                    <span className="text-sm text-brand-warm-500 font-medium">
                      {newMemory.attachment ? newMemory.attachment.name : 'Click to upload a file'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Save to Vault</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MemoryVault;
