import { motion, AnimatePresence } from 'framer-motion';
import { Package, Heart, Settings, MapPin, CreditCard, LogOut, Loader2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initAuth, logout, User as AuthUser } from '../lib/auth.ts';
import { useGetUserOrdersQuery } from '../redux/apiSlice.ts';

export function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const unsubscribe = initAuth((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    }, () => {
      setCurrentUser(null);
      setIsLoading(false);
      navigate('/login');
    });
    return () => unsubscribe();
  }, [navigate]);

  const { data: userOrders, isLoading: ordersLoading } = useGetUserOrdersQuery(currentUser?.uid || '', {
    skip: !currentUser,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
      </div>
    );
  }

  if (!currentUser) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="container mx-auto w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 mt-4 md:mt-0">
              My Account
            </h1>
            <p className="text-slate-500">
              Welcome back, <span className="font-bold text-slate-800">{currentUser.displayName || currentUser.email.split('@')[0]}</span>
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-full font-bold transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4 self-start space-y-6">
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary-blue text-white text-3xl font-bold rounded-full flex items-center justify-center mb-6 shadow-md border-4 border-white">
                {currentUser.displayName?.[0]?.toUpperCase() || currentUser.email[0].toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-800 break-all">{currentUser.displayName || 'User'}</h2>
              <p className="text-slate-500 mb-6 break-all">{currentUser.email}</p>
              <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold transition-colors shadow-sm text-sm">
                Edit Profile
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-l-4 ${activeTab === 'orders' ? 'border-primary-blue bg-blue-50/50 text-slate-800' : 'border-transparent text-slate-600'}`}
                >
                  <Package className={`w-5 h-5 ${activeTab === 'orders' ? 'text-primary-blue' : ''}`} />
                  <span className={activeTab === 'orders' ? 'font-bold' : 'font-semibold'}>Orders</span>
                </button>
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-l-4 ${activeTab === 'wishlist' ? 'border-primary-blue bg-blue-50/50 text-slate-800' : 'border-transparent text-slate-600'}`}
                >
                  <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'text-primary-blue' : ''}`} />
                  <span className={activeTab === 'wishlist' ? 'font-bold' : 'font-semibold'}>Wishlist</span>
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-l-4 ${activeTab === 'addresses' ? 'border-primary-blue bg-blue-50/50 text-slate-800' : 'border-transparent text-slate-600'}`}
                >
                  <MapPin className={`w-5 h-5 ${activeTab === 'addresses' ? 'text-primary-blue' : ''}`} />
                  <span className={activeTab === 'addresses' ? 'font-bold' : 'font-semibold'}>Addresses</span>
                </button>
                <button 
                  onClick={() => setActiveTab('payments')}
                  className={`flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-l-4 ${activeTab === 'payments' ? 'border-primary-blue bg-blue-50/50 text-slate-800' : 'border-transparent text-slate-600'}`}
                >
                  <CreditCard className={`w-5 h-5 ${activeTab === 'payments' ? 'text-primary-blue' : ''}`} />
                  <span className={activeTab === 'payments' ? 'font-bold' : 'font-semibold'}>Payment Methods</span>
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-l-4 ${activeTab === 'settings' ? 'border-primary-blue bg-blue-50/50 text-slate-800' : 'border-transparent text-slate-600'}`}
                >
                  <Settings className={`w-5 h-5 ${activeTab === 'settings' ? 'text-primary-blue' : ''}`} />
                  <span className={activeTab === 'settings' ? 'font-bold' : 'font-semibold'}>Settings</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              {activeTab === 'orders' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Recent Orders</h3>
                  </div>

                  {ordersLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
                    </div>
                  ) : userOrders && userOrders.length > 0 ? (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div key={order.id} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow bg-slate-50">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <p className="text-sm text-slate-500 font-bold mb-1">Order #ORD-{order.id.slice(0, 8)}</p>
                              <p className="text-xs font-semibold text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full tracking-wider ${
                              order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                              order.orderStatus === 'processing' ? 'bg-amber-100 text-amber-700' :
                              order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {order.orderStatus.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-slate-800">₹{order.totalAmount}</span>
                            <button onClick={() => setSelectedOrder(order)} className="text-primary-blue hover:text-blue-700 text-sm">View Details</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
                        <Package className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-700 mb-2">No active orders</h4>
                      <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">
                        You haven't placed any orders yet. Discover our latest collections to get started.
                      </p>
                      <button 
                        onClick={() => navigate('/products')}
                        className="px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full font-bold transition-colors shadow-sm"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-8 pt-8 border-t border-slate-100">
                     <h3 className="text-xl font-bold text-slate-800 mb-6">Account Details</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Full Name</label>
                          <p className="font-medium text-slate-800">{currentUser.displayName || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Email Address</label>
                          <p className="font-medium text-slate-800">{currentUser.email}</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Password</label>
                          <p className="font-medium text-slate-800">••••••••</p>
                        </div>
                     </div>
                  </div>
                </>
              )}

              {activeTab === 'wishlist' && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-400">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Your Wishlist is Empty</h4>
                  <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">
                    Save your favorite items here to review and purchase them later.
                  </p>
                  <button 
                    onClick={() => navigate('/products')}
                    className="px-6 py-2.5 bg-primary-blue text-white hover:bg-blue-600 rounded-lg font-bold transition-colors shadow-sm"
                  >
                    Explore Products
                  </button>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-blue">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">No Saved Addresses</h4>
                  <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">
                    You can add your delivery addresses during checkout. Let's start shopping!
                  </p>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Payment Methods</h4>
                  <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">
                    Manage your saved cards and UPI accounts here. Feature coming soon.
                  </p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <Settings className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Account Settings</h4>
                  <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">
                    Update your account preferences, notifications, and security settings. Feature coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Order Details</h3>
                  <p className="text-sm text-slate-500 font-medium">#ORD-{selectedOrder.id.slice(0, 8)}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 outline-none">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Shipping Information</h4>
                  <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <p className="font-semibold text-slate-800">{selectedOrder.shippingAddress?.fullName}</p>
                    <p>{selectedOrder.shippingAddress?.address}</p>
                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip}</p>
                    <p className="mt-2 text-slate-500 font-medium">{selectedOrder.shippingAddress?.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Payment Details</h4>
                  <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-500">Method</span>
                      <span className="font-semibold text-slate-800 uppercase">{selectedOrder.paymentMethod.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-500">Status</span>
                      <span className="font-semibold text-slate-800 uppercase">{selectedOrder.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between mt-4 border-t border-slate-200 pt-2 font-bold text-base">
                      <span className="text-slate-800">Total Amount</span>
                      <span className="text-primary-blue">₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

