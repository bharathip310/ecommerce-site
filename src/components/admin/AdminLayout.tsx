import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const Sidebar = () => (
    <>
      <div className="h-20 flex items-center px-8 border-b border-slate-800/50 flex-shrink-0">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-blue to-cyan-400 flex items-center justify-center shadow-lg shadow-primary-blue/20">
            <span className="text-white text-sm font-black">N</span>
          </div>
          NexStore<span className="text-slate-500 font-light text-lg hidden sm:inline">Admin</span>
        </Link>
      </div>
      <div className="px-6 py-4 flex-1 overflow-y-auto custom-scrollbar">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-4">Menu</p>
        <nav className="flex flex-col space-y-1.5">
          {navigation.map((item) => {
            let isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/admin');
            if (item.href === '/admin' && location.pathname !== '/admin') isActive = false;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-blue/10 text-primary-blue shadow-sm ring-1 ring-primary-blue/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors flex-shrink-0 ${isActive ? 'text-primary-blue' : 'text-slate-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-800/50 flex-shrink-0">
        <div className="bg-slate-800/30 rounded-xl p-4 mb-4 border border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">Admin User</p>
              <p className="text-xs text-emerald-400 font-medium">Online</p>
            </div>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 transition-all duration-200 w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-slate-500" />
          Exit to Store
        </Link>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-gray-50 flex relative overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[280px] bg-slate-900 border-r border-slate-800 h-full flex-col text-slate-300 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-[280px] max-w-[80%] bg-slate-900 z-50 flex flex-col text-slate-300 shadow-2xl lg:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center w-full min-w-0 overflow-y-auto">
        <header className="h-20 w-full bg-white/80 backdrop-blur-md border-b border-border-light flex items-center justify-between px-4 sm:px-10 sticky top-0 z-30 transition-all">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-primary-blue hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight truncate max-w-[200px] sm:max-w-none">
              {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard Area'}
            </h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-slate-500 transition-colors relative">
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 w-full max-w-[1400px] p-4 sm:p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
