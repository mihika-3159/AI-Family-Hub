import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Shield, Camera, Users, ChevronRight } from 'lucide-react';

const Landing: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  return (
    <div className="min-h-screen bg-brand-warm-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="text-brand-peach" size={32} />
          <span className="text-2xl font-bold text-brand-warm-800">AI Family Hub</span>
        </div>
        <Link to="/login" className="btn-primary">Get Started</Link>
      </nav>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-warm-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl bg-black rounded-4xl overflow-hidden shadow-2xl relative"
          >
            <button onClick={() => setShowDemo(false)} className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 z-10 transition-colors">×</button>
            <div className="aspect-video bg-brand-warm-900 flex items-center justify-center">
              <div className="text-center">
                <Sparkles size={64} className="text-brand-peach mb-4 mx-auto animate-pulse" />
                <h3 className="text-2xl font-bold text-white">Experience the Future of Family</h3>
                <p className="text-brand-warm-400 mt-2">Connecting generations through AI empathy.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-32 max-w-7xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-extrabold text-brand-warm-900 mb-6 leading-tight">
            The heart of your <br />
            <span className="gradient-text">modern family.</span>
          </h1>
          <p className="text-xl text-brand-warm-600 mb-10 max-w-2xl mx-auto">
            Stay organized, connected, and supported with an emotionally intelligent platform designed for every generation of your family.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login" className="btn-primary flex items-center gap-2 text-lg px-10 py-5">
              Start Free Trial <ChevronRight size={20} />
            </Link>
            <button onClick={() => setShowDemo(true)} className="btn-secondary text-lg px-10 py-5">Watch Demo</button>
          </div>
        </motion.div>

        {/* Floating elements for visual interest */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-peach/10 blur-3xl rounded-full -z-10" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-lavender/20 blur-3xl rounded-full -z-10" />
      </section>

      {/* Features Grid */}
      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-brand-warm-900 mb-4">Everything your family needs.</h2>
            <p className="text-brand-warm-600">Built with cutting-edge AI and human-centered design.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="text-brand-peach" />}
              title="Family Organizer"
              description="Shared calendars, smart chore distribution, and AI-suggested routines."
              link="/login"
            />
            <FeatureCard 
              icon={<Heart className="text-red-400" />}
              title="Care & Wellbeing"
              description="Mood tracking, medication reminders, and health insights for all ages."
              link="/login"
            />
            <FeatureCard 
              icon={<Camera className="text-brand-sky" />}
              title="Memory Vault"
              description="Capture moments, generate AI stories, and build a digital family legacy."
              link="/login"
            />
            <FeatureCard 
              icon={<Sparkles className="text-brand-sun" />}
              title="Bonding Activities"
              description="AI-generated activity ideas based on your budget, time, and mood."
              link="/login"
            />
            <FeatureCard 
              icon={<Shield className="text-brand-mint" />}
              title="Digital Safety"
              description="Protect your loved ones with scam awareness and cybersecurity tips."
              link="/login"
            />
            <FeatureCard 
              icon={<Sparkles className="text-brand-lavender" />}
              title="AI Assistant"
              description="A warm, conversational companion to help you navigate daily life."
              link="/login"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-warm-50 py-12 border-t border-brand-warm-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-brand-peach" size={24} />
            <span className="text-xl font-bold text-brand-warm-800">AI Family Hub</span>
          </div>
          <p className="text-brand-warm-500 text-sm">© 2026 AI Family Hub. Built for modern households.</p>
          <div className="flex gap-6">
            <a href="#" className="text-brand-warm-500 hover:text-brand-peach transition-colors">Privacy</a>
            <a href="#" className="text-brand-warm-500 hover:text-brand-peach transition-colors">Terms</a>
            <a href="#" className="text-brand-warm-500 hover:text-brand-peach transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, link }: { icon: React.ReactNode, title: string, description: string, link: string }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-8 rounded-3xl bg-brand-warm-50 border border-brand-warm-100 hover:border-brand-peach/30 transition-all cursor-pointer"
  >
    <Link to={link} className="block">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-brand-warm-900 mb-3">{title}</h3>
      <p className="text-brand-warm-600 leading-relaxed">{description}</p>
    </Link>
  </motion.div>
);

export default Landing;
