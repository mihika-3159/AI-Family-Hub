import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Tag, 
  User as UserIcon,
  Plus,
  Sparkles,
  Loader2,
  Calendar as CalendarIcon
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  category: string;
  is_completed: boolean;
  due_date: string;
}

const Organizer: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'chore',
    due_date: ''
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks/', newTask);
      setShowAddModal(false);
      setNewTask({ title: '', description: '', priority: 'medium', category: 'chore', due_date: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTask = async (taskId: number, currentStatus: boolean) => {
    try {
      await api.patch(`/tasks/${taskId}`, { is_completed: !currentStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getAiSuggestions = async () => {
    setAiLoading(true);
    try {
      // In a real app, we'd send more context
      const res = await api.post('/ai/chat', { 
        message: "Suggest an optimal chore distribution for this week based on our tasks.",
        context: `Current tasks: ${tasks.filter(t => !t.is_completed).map(t => t.title).join(', ')}`
      });
      setAiSuggestion(res.data.response);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-warm-900">Family Organizer</h1>
          <p className="text-brand-warm-500">Manage chores, schedules, and more.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={getAiSuggestions}
            disabled={aiLoading}
            className="btn-secondary flex items-center gap-2 border-brand-peach/30 text-brand-peach"
          >
            {aiLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            AI Optimizer
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Add Task
          </button>
        </div>
      </header>

      {aiSuggestion && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-brand-peach/5 border border-brand-peach/20 rounded-3xl relative"
        >
          <button onClick={() => setAiSuggestion(null)} className="absolute top-4 right-4 text-brand-warm-400 hover:text-brand-warm-600">×</button>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">✨</div>
            <div className="flex-1">
              <h4 className="font-bold text-brand-warm-800 mb-1">AI Chore Strategy</h4>
              <p className="text-sm text-brand-warm-600 leading-relaxed whitespace-pre-wrap">{aiSuggestion}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-brand-warm-800 flex items-center gap-2">
              Current Tasks <span className="bg-brand-warm-100 text-brand-warm-500 text-xs px-2 py-0.5 rounded-full">{tasks.filter(t => !t.is_completed).length}</span>
            </h3>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center text-brand-warm-400">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="h-64 glass rounded-3xl flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-brand-warm-50 rounded-2xl flex items-center justify-center text-3xl mb-4">📝</div>
              <h4 className="font-bold text-brand-warm-800 mb-2">No tasks yet</h4>
              <p className="text-sm text-brand-warm-500 mb-6">Start by adding chores or appointments for your family.</p>
              <button onClick={() => setShowAddModal(true)} className="btn-secondary">Add First Task</button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <motion.div 
                  key={task.id}
                  layout
                  className={`glass p-5 rounded-2xl flex items-center gap-4 transition-all ${task.is_completed ? 'opacity-60 grayscale' : 'hover:border-brand-peach/30'}`}
                >
                  <button 
                    onClick={() => toggleTask(task.id, task.is_completed)}
                    className={`transition-colors ${task.is_completed ? 'text-brand-mint' : 'text-brand-warm-300 hover:text-brand-peach'}`}
                  >
                    {task.is_completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold text-brand-warm-800 ${task.is_completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs text-brand-warm-400">
                        <Tag size={12} /> {task.category}
                      </span>
                      <span className={`flex items-center gap-1 text-xs font-semibold ${
                        task.priority === 'high' ? 'text-red-400' : task.priority === 'medium' ? 'text-brand-sun' : 'text-brand-sky'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-brand-sun' : 'bg-brand-sky'
                        }`} />
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className="flex items-center gap-1 text-xs text-brand-warm-400">
                          <Clock size={12} /> {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-brand-lavender border-2 border-white flex items-center justify-center text-[10px] font-bold">JD</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Mini Calendar Widget */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h3 className="font-bold text-brand-warm-800 mb-4 flex items-center gap-2">
              <CalendarIcon size={18} className="text-brand-peach" /> Schedule
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <span key={d} className="text-[10px] font-bold text-brand-warm-400 py-1">{d}</span>
              ))}
              {Array.from({ length: 31 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`text-xs py-2 rounded-lg transition-colors cursor-pointer ${
                    i + 1 === new Date().getDate() ? 'bg-brand-peach text-white shadow-sm' : 'hover:bg-brand-warm-50 text-brand-warm-600'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass p-6 rounded-3xl bg-brand-sky/5 border-brand-sky/10">
            <h4 className="text-sm font-bold text-brand-sky mb-2 uppercase tracking-wider">Top Priority</h4>
            <p className="text-brand-warm-700 font-semibold italic text-sm leading-relaxed">
              "Don't forget the weekly family planning meeting on Friday at 7 PM!"
            </p>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-warm-900/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white p-8 rounded-4xl shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-brand-warm-900 mb-6">New Family Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-warm-700">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach transition-all"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-brand-warm-700">Category</label>
                  <select
                    className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  >
                    <option value="chore">Chore</option>
                    <option value="grocery">Grocery</option>
                    <option value="appointment">Appointment</option>
                    <option value="health">Health</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-brand-warm-700">Priority</label>
                  <select
                    className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-warm-700">Due Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 bg-brand-warm-50 border border-brand-warm-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-peach"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Create Task</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Organizer;
