import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeechBotProps {
  text: string;
  enabled: boolean;
}

const SpeechBot: React.FC<SpeechBotProps> = ({ text, enabled }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!enabled || isMuted || !text) return;

    // Cancel previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for seniors
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, enabled, isMuted]);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-10 right-10 z-50">
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white p-4 rounded-2xl shadow-lg border border-brand-peach/20 mb-4 max-w-xs"
          >
            <p className="text-sm text-brand-warm-700 italic">"{text}"</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsMuted(!isMuted)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-soft transition-all ${
          isMuted ? 'bg-brand-warm-200 text-brand-warm-500' : 'bg-brand-peach text-white'
        }`}
      >
        {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} className={isSpeaking ? 'animate-pulse' : ''} />}
      </button>
    </div>
  );
};

export default SpeechBot;
