import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, User, Menu, LogOut, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartDrawer } from './CartDrawer.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCart } from '../redux/cartSlice.ts';
import { RootState } from '../redux/store.ts';
import { initAuth, logout, User as AuthUser } from '../lib/auth.ts';

export function Layout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth((user) => {
      setCurrentUser(user);
    }, () => {
      setCurrentUser(null);
    });
    return () => unsubscribe();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen relative text-text-main overflow-x-hidden">
      <header className="bg-primary-blue py-4 w-full z-20 text-white shadow-md sticky top-0">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-[22px] md:text-[24px] font-[800] tracking-[-0.5px] flex-shrink-0">
            NexStore
          </Link>
          
          <nav className="hidden lg:flex gap-6 xl:gap-8 text-[15px] font-medium items-center">
            <Link to="/" className="hover:text-primary-yellow transition-colors">Home</Link>
            <Link to="/products" className="hover:text-primary-yellow transition-colors">Shop</Link>
            <Link to="/categories" className="hover:text-primary-yellow transition-colors">Collection</Link>
            <Link to="/dashboard" className="hover:text-primary-yellow transition-colors">Dashboard</Link>
            <Link to="/admin" className="hover:text-primary-yellow transition-colors font-bold text-primary-yellow">Admin</Link>
          </nav>

          <div className="flex items-center justify-end gap-3 md:gap-5 flex-shrink-0">
            <button className="hidden sm:flex hover:text-primary-yellow transition-colors items-center justify-center">
              <Search className="w-[20px] h-[20px]" />
            </button>
            <button 
              onClick={() => dispatch(toggleCart())}
              className="hover:text-primary-yellow transition-colors relative flex items-center justify-center"
            >
              <ShoppingBag className="w-[20px] h-[20px]" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {currentUser ? (
              <div className="hidden md:flex items-center gap-4 ml-2">
                <Link to="/dashboard" className="font-semibold text-sm hover:text-primary-yellow transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                  Hi, {currentUser.displayName || 'User'}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors flex items-center justify-center"
                  title="Sign Out"
                >
                  <LogOut className="w-[18px] h-[18px]" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-white text-primary-blue px-4 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors ml-2 shadow-sm whitespace-nowrap text-sm">
                <User className="w-[18px] h-[18px]" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
            
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1 text-white hover:text-primary-yellow transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-40 p-6 flex flex-col lg:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-[22px] font-[800] tracking-[-0.5px] text-primary-blue">
                  NexStore
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 text-lg font-bold text-slate-800 mb-8">
                <Link to="/" className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">Home</Link>
                <Link to="/products" className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">Shop</Link>
                <Link to="/categories" className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">Collection</Link>
                <Link to="/dashboard" className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">Dashboard</Link>
                <Link to="/admin" className="p-3 bg-primary-yellow text-primary-blue rounded-xl hover:bg-yellow-400 transition-colors font-black">Admin Panel</Link>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-200">
                {currentUser ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 bg-primary-blue rounded-full flex items-center justify-center text-white font-bold">
                        {currentUser.displayName?.[0] || 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-800 text-sm truncate">{currentUser.displayName || 'User'}</p>
                        <p className="text-slate-500 text-xs truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="w-full py-4 bg-primary-blue text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-md"
                  >
                    <User className="w-5 h-5" />
                    Sign In to Account
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col justify-start relative z-0">
        {children}
      </main>

      <footer className="border-t border-border-light bg-white py-12 mt-auto w-full relative z-0">
        <div className="container mx-auto px-4 text-center text-text-muted text-sm flex flex-col items-center">
          <ShoppingBag className="w-8 h-8 text-border-light mb-4" />
          <p>© 2026 NexStore. All rights reserved.</p>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
