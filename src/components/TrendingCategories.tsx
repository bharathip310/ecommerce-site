import { motion } from 'framer-motion';
import { Watch, Laptop, Headphones, Shirt, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TrendingCategories() {
  const categories = [
    { name: "Wearables", icon: <Watch className="w-10 h-10 mb-4 text-primary-blue" />, count: "3 items", color: "from-blue-50 to-transparent" },
    { name: "Audio", icon: <Headphones className="w-10 h-10 mb-4 text-primary-blue" />, count: "4 items", color: "from-indigo-50 to-transparent" },
    { name: "Computers", icon: <Laptop className="w-10 h-10 mb-4 text-primary-blue" />, count: "3 items", color: "from-yellow-50 to-transparent" },
    { name: "Smartphones", icon: <Smartphone className="w-10 h-10 mb-4 text-primary-blue" />, count: "3 items", color: "from-green-50 to-transparent" }
  ];

  return (
    <section className="container mx-auto px-4 md:px-10 py-20 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-main tracking-tight">Shop by Category</h2>
          <p className="text-text-muted text-lg font-medium">Curated collections designed to elevate your lifestyle.</p>
        </div>
        <Link to="/categories" className="text-primary-blue hover:text-primary-orange transition-colors font-semibold flex items-center gap-2">
          View All Categories <span className="text-xl">&rarr;</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link to="/products" className="block relative group overflow-hidden rounded-[8px] bg-white border border-border-light shadow-sm hover:shadow-md transition-shadow">
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-40 group-hover:opacity-80 transition-opacity duration-500 z-0`}></div>
              <div className="!p-8 relative z-10 flex flex-col items-center text-center h-full transition-colors duration-300">
                 {cat.icon}
                 <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-primary-blue transition-colors">{cat.name}</h3>
                 <p className="text-sm font-semibold text-text-muted group-hover:text-text-main">{cat.count}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
