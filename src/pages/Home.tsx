import { motion } from 'framer-motion';
import { Hero } from '../components/Hero.tsx';
import { TrendingCategories } from '../components/TrendingCategories.tsx';
import { Features } from '../components/Features.tsx';
import { NewsletterCTA } from '../components/NewsletterCTA.tsx';

export function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col w-full min-h-screen relative pb-10"
    >
      <Hero />

      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10 mt-[-20px] mb-20 container mx-auto px-4 md:px-10"
      >
        {[
          { text: "24.8K", label: "Happy Elite", gradient: "from-accent-cyan to-[#0284c7]" },
          { text: "1.2M+", label: "Delivered", gradient: "from-accent-purple to-[#6b21a8]" },
          { text: "4.98", label: "Avg Rating", gradient: "from-accent-amber to-[#b45309]" },
          { text: "150+", label: "Global Brands", gradient: "from-emerald-400 to-[#047857]" },
        ].map((stat, i) => (
          <div 
            key={i}
            className="glass-card text-center !p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] border-white/10 h-full"
          >
            <div className={`text-[36px] font-[800] bg-gradient-to-b ${stat.gradient} bg-clip-text text-transparent mb-2 drop-shadow-sm`}>
              {stat.text}
            </div>
            <div className="text-[12px] font-bold text-text-muted uppercase tracking-[2px]">{stat.label}</div>
          </div>
        ))}
      </motion.section>

      <TrendingCategories />
      <Features />
      <NewsletterCTA />
    </motion.div>
  );
}
