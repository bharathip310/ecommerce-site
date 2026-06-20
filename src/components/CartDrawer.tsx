import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store.ts';
import { toggleCart, closeCart, removeFromCart, updateQuantity } from '../redux/cartSlice.ts';
import { Link } from 'react-router-dom';

export function CartDrawer() {
  const { items, isOpen } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-border-light z-[101] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-border-light flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2 text-text-main">
                <ShoppingBag className="w-5 h-5 text-primary-blue" />
                Your Cart
              </h2>
              <button 
                onClick={() => dispatch(closeCart())}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted gap-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Your cart is empty</p>
                  <button 
                    onClick={() => dispatch(closeCart())}
                    className="btn-primary mt-4"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 bg-white border border-border-light p-3 rounded-md shadow-sm">
                    <img 
                      src={item.product.imageUrl || ''} 
                      alt={item.product.name} 
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-[4px] object-cover bg-gray-50 border border-border-light"
                    />
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-semibold text-sm line-clamp-1 text-text-main">{item.product.name}</h3>
                      <p className="text-primary-blue font-bold mt-1">₹{item.product.price}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 bg-gray-50 border border-border-light rounded-[4px] p-1">
                          <button 
                            onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity - 1 }))}
                            className="p-1 hover:bg-gray-200 rounded-[2px] transition-colors text-text-main"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center text-text-main">{item.quantity}</span>
                          <button 
                            onClick={() => dispatch(updateQuantity({ id: item.product.id, quantity: item.quantity + 1 }))}
                            className="p-1 hover:bg-gray-200 rounded-[2px] transition-colors text-text-main"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => dispatch(removeFromCart(item.product.id))}
                          className="p-2 text-text-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border-light bg-gray-50">
                <div className="flex justify-between mb-4 text-lg font-bold text-text-main">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <Link 
                  to="/checkout" 
                  onClick={() => dispatch(closeCart())}
                  className="btn-primary w-full text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
