import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { useState } from 'react';

const collections = [
  {
    id: 1,
    title: 'Minimalist Workspaces',
    description: 'Everything you need to create a clean, focused, and productive environment.',
    // Using simple stable Unsplash image URLs
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
    upcoming: [
      { name: 'Ergo Chair Pro', date: 'Next Month', price: '$499' },
      { name: 'Seamless Desk Mat', date: 'Next Week', price: '$45' }
    ]
  },
  {
    id: 2,
    title: 'Premium Audio',
    description: 'High-fidelity audio equipment with exceptional design and build quality.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    upcoming: [
      { name: 'Studio Monitors X1', date: 'Fall 2026', price: '$899' },
      { name: 'Acoustic Panels', date: 'Next Month', price: '$120' }
    ]
  },
  {
    id: 3,
    title: 'Everyday Carry',
    description: 'Essential premium accessories designed for your daily journey.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    upcoming: [
      { name: 'Titanium Wallet', date: 'Next Week', price: '$85' },
      { name: 'Carbon Fiber Pen', date: 'Coming Soon', price: '$65' }
    ]
  },
  {
    id: 4,
    title: 'Modern Living',
    description: 'Curated home decor pieces to elevate your living space.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    upcoming: [
      { name: 'Modular Sofa Set', Winter: 'Winter 2026', price: '$1,299' },
      { name: 'Ambient Floor Lamp', date: 'Next Month', price: '$249' }
    ]
  },
  {
    id: 5,
    title: 'Travel Essentials',
    description: 'Durable, sleek luggage and accessories for the modern nomad.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    upcoming: [
      { name: 'Weekend Duffel', date: 'Fall 2026', price: '$150' },
      { name: 'Aluminium Carry-on', date: 'Coming Soon', price: '$350' }
    ]
  }
];

export function Collection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto"
    >
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 tracking-tight">
          Curated Collections
        </h1>
        <p className="text-slate-500 max-w-2xl text-lg">
          Explore our thoughtfully organized collections, designed to complement your modern lifestyle and aesthetic preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {collections.map((collection, index) => (
          <motion.div 
            key={collection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex flex-col md:flex-row gap-8 items-start ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="flex-1 w-full relative group rounded-3xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[450px]">
              <img 
                src={collection.image} 
                alt={collection.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                loading="lazy"
                onError={(e) => {
                  // Fallback to a solid color if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                  const span = document.createElement('span');
                  span.className = 'text-slate-400 font-bold';
                  span.innerText = collection.title;
                  e.currentTarget.parentElement!.appendChild(span);
                }}
              />
            </div>
            <div className="flex-1 w-full flex flex-col justify-center px-4 md:px-12 py-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{collection.title}</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                {collection.description}
              </p>
              
              <button 
                onClick={() => setExpandedId(expandedId === collection.id ? null : collection.id)}
                className="inline-flex items-center justify-between w-full p-4 border border-slate-200 rounded-2xl hover:border-primary-blue hover:bg-slate-50 transition-colors group text-left"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-lg group-hover:text-primary-blue transition-colors">
                    Explore Collection
                  </span>
                  <span className="text-slate-500 text-sm">
                    View upcoming drops & exclusives
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-primary-blue transition-colors">
                  {expandedId === collection.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedId === collection.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-primary-yellow" />
                        <h3 className="font-bold text-slate-800">Upcoming Drops</h3>
                      </div>
                      <div className="space-y-4">
                        {collection.upcoming.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div>
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-sm text-slate-500">{item.date || item.Winter}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary-blue">{item.price}</p>
                              <button className="text-xs font-bold text-slate-500 hover:text-primary-blue transition-colors mt-1">
                                Notify Me
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
