import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
    is_senior: false,
    invite_code: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const params = new URLSearchParams();
        params.append('username', formData.username);
        params.append('password', formData.password);
        
        const res = await api.post('/auth/login', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        await login(res.data.access_token);
        navigate('/app');
      } else {
        await api.post('/auth/register', {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          full_name: formData.full_name,
          is_senior: formData.is_senior,
          invite_code: formData.invite_code || null,
        });
        setIsLogin(true);
        setError('Account created! Please login.');
      }
    } catch (err: any) {
      console.error('Registration/Login error:', err);
      let errorMessage = 'An unknown error occurred';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.detail) {
          errorMessage = typeof err.response.data.detail === 'string' 
            ? err.response.data.detail 
            : JSON.stringify(err.response.data.detail);
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      } else {
        errorMessage = err.message || 'An unknown error occurred';
      }

      // User-friendly cleanup
      if (errorMessage.includes('password cannot be longer than 72 bytes')) {
        errorMessage = 'Password is too long. Please choose a password shorter than 72 characters.';
      } else if (errorMessage.includes('Registration failed:')) {
        errorMessage = errorMessage.replace('Registration failed:', '').trim();
      } else if (errorMessage.includes('Internal Server Error:')) {
        errorMessage = 'A server error occurred. Our team has been notified.';
      }

      const status = err.response?.status ? ` (Status: ${err.response.status})` : '';
      setError(`${errorMessage}${status}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-warm-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-peach/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-lavender/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-10 rounded-4xl z-10 border border-white/40 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-peach to-orange-400 rounded-2xl flex items-center justify-center text-white shadow-lg mx-auto mb-6">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl font-bold text-brand-warm-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Join the Hub'}
          </h2>
          <p className="text-brand-warm-500">
            {isLogin ? 'Enter your details to access your family hub.' : 'Start your journey towards a connected family.'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl text-sm mb-6 flex items-start gap-3 border ${
              error.includes('created') 
                ? 'bg-green-50/80 border-green-100 text-green-700' 
                : 'bg-red-50/80 border-red-100 text-red-600'
            }`}
          >
            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
              error.includes('created') ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {error.includes('created') ? '✓' : '!'}
            </div>
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-warm-700 ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-warm-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-brand-warm-200 rounded-2xl focus:ring-2 focus:ring-brand-peach focus:border-transparent outline-none transition-all"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-warm-700 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-warm-400" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-brand-warm-200 rounded-2xl focus:ring-2 focus:ring-brand-peach focus:border-transparent outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-sm font-semibold text-brand-warm-700 ml-1">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-warm-400" size={18} />
              <input
                type="text"
                required
                placeholder="johndoe123"
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-brand-warm-200 rounded-2xl focus:ring-2 focus:ring-brand-peach focus:border-transparent outline-none transition-all"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-brand-warm-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-warm-400" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-brand-warm-200 rounded-2xl focus:ring-2 focus:ring-brand-peach focus:border-transparent outline-none transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-brand-warm-700 ml-1">Invite Code (Optional)</label>
                <div className="relative">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-warm-400" size={18} />
                  <input
                    type="text"
                    placeholder="HUB-XXXX-X"
                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-brand-warm-200 rounded-2xl focus:ring-2 focus:ring-brand-peach focus:border-transparent outline-none transition-all"
                    value={formData.invite_code}
                    onChange={(e) => setFormData({ ...formData, invite_code: e.target.value })}
                  />
                </div>
                <p className="text-[10px] text-brand-warm-400 ml-1">Leave blank to create a new family hub.</p>
              </div>

              <div className="flex items-center gap-3 ml-1 py-2">
                <input 
                  type="checkbox" 
                  id="is_senior"
                  className="w-5 h-5 rounded-lg border-brand-warm-300 text-brand-peach focus:ring-brand-peach"
                  checked={formData.is_senior}
                  onChange={(e) => setFormData({ ...formData, is_senior: e.target.checked })}
                />
                <label htmlFor="is_senior" className="text-sm text-brand-warm-600">I am a senior citizen (Enable assisted mode)</label>
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary mt-4 py-4 rounded-2xl bg-gradient-to-r from-brand-peach to-orange-500 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <span className="font-bold">{isLogin ? 'Login' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-brand-warm-500 hover:text-brand-peach font-medium transition-colors"
          >
            {isLogin ? (
              <span>Don't have an account? <span className="text-brand-peach font-bold">Sign up</span></span>
            ) : (
              <span>Already have an account? <span className="text-brand-peach font-bold">Login</span></span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
