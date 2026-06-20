import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, CreditCard } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-primary-blue" />,
      title: "Global Delivery",
      description: "Fast, reliable shipping to over 150 countries worldwide."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary-blue" />,
      title: "Secure Payments",
      description: "Bank-level encryption for all your transactions."
    },
    {
      icon: <Clock className="w-8 h-8 text-primary-yellow" />,
      title: "24/7 Support",
      description: "Round-the-clock dedicated customer assistance."
    },
    {
      icon: <CreditCard className="w-8 h-8 text-emerald-600" />,
      title: "Easy Returns",
      description: "30-day hassle-free return policy on all items."
    }
  ];

  return (
    <section className="container mx-auto px-4 md:px-10 py-20 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-main">The Premium Standard</h2>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">Experience unparalleled service and reliability with every purchase you make.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass-card !p-8 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              {feature.icon}
            </div>
            <h3 className="text-[20px] font-bold text-text-main mb-3 tracking-wide">{feature.title}</h3>
            <p className="text-text-muted font-medium leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
