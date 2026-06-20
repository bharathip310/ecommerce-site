import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="container mx-auto px-4 md:px-10 py-20 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card !p-10 md:!p-16 text-center relative overflow-hidden rounded-[8px] bg-primary-blue text-white shadow-xl isolate"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] bg-white/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-8 shadow-sm border border-white/20">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-[50px] font-[800] leading-tight tracking-tight mb-6">
            Join the Elite Club
          </h2>
          <p className="text-white/80 text-[18px] mb-12 font-medium leading-relaxed">
            Subscribe to our newsletter to receive exclusive offers, early access to new product collections, and premium luxury rewards.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row w-full gap-4 justify-center relative">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address" 
              className="flex-1 max-w-[450px] bg-white text-text-main border-none rounded-[4px] px-6 py-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-yellow transition-all font-medium shadow-inner"
            />
            <button type="submit" className="btn-secondary !px-8 !py-4 !rounded-[4px] shrink-0 flex items-center justify-center gap-2 font-bold shadow-sm">
              Subscribe Now <ArrowRight className="w-5 h-5" />
            </button>
            <AnimatePresence>
              {isSubscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-10 left-0 right-0 flex items-center justify-center gap-2 text-emerald-300 font-medium whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4" /> Successfully subscribed!
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
