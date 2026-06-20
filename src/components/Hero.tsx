import { motion } from 'framer-motion';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative w-full min-h-[85vh] flex items-center justify-center py-10">
      
      <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center relative z-10 w-full container mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border-light text-primary-blue text-sm font-semibold tracking-wide uppercase mb-8 w-fit shadow-sm">
            <Star className="w-4 h-4 fill-primary-blue" />
            Premium E-Commerce Experience
          </div>
          
          <h1 className="text-[56px] md:text-[80px] font-[800] leading-[1.05] tracking-[-3px] mb-8 text-black">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Next-Gen
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Shopping <span className="text-primary-blue">Experience.</span>
            </motion.div>
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-[20px] text-text-muted leading-[1.7] mb-10 max-w-[540px] font-medium"
          >
             Experience the future of e-commerce with our platform, real-time analytics, and lightning-fast backend.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex gap-5"
          >
            <Link to="/products" className="btn-primary !px-8 !py-4 !text-lg !rounded-md shadow-md hover:-translate-y-1 transition-all">
              Explore Collection <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn-secondary !px-8 !py-4 !text-lg !rounded-md hover:-translate-y-1 transition-all">
              Watch Vision
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 hidden lg:block"
        >
          <div className="glass-card shadow-lg border-border-light overflow-visible max-w-[400px] w-full mx-auto relative group">
            <div className="w-full h-[260px] bg-gray-100 rounded-[8px] mb-6 flex items-center justify-center relative border border-gray-200">
              <span className="absolute top-4 right-4 bg-primary-yellow text-white text-[11px] font-[800] px-3 py-1.5 rounded-[4px] z-10 shadow-sm tracking-wider uppercase">
                Best Seller
              </span>
              <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80" alt="Cyber-Link Watch X" referrerPolicy="no-referrer" className="w-full h-full object-cover z-10" />
            </div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="mb-2 text-[22px] font-bold text-text-main tracking-tight">Cyber-Link Watch X</h3>
                <p className="text-[15px] font-medium text-text-muted">Smart Wearables</p>
              </div>
              <div className="text-[26px] font-[800] text-black">₹299.00</div>
            </div>
            <Link to="/products/cyber-link-watch-x" className="w-full mt-6 p-4 rounded-md bg-white border border-border-light text-primary-blue font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center">
              View Product
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
