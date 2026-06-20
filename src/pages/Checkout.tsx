import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store.ts';
import { clearCart } from '../redux/cartSlice.ts';
import { useCreateOrderMutation } from '../redux/apiSlice.ts';
import { ShoppingBag, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { initAuth, googleSignIn, getAccessToken } from '../lib/auth.ts';
import { sendOrderConfirmationEmail } from '../lib/gmail.ts';

export function Checkout() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);

  const [step, setStep] = useState(1);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setNeedsAuth(false);
        setCurrentUser(user);
      },
      () => {
        setNeedsAuth(true);
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'Card'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName || !formData.address || !formData.city || !formData.pincode) {
        toast.error('Please fill all shipping details');
        return;
      }
      setStep(2);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setNeedsAuth(false);
        toast.success('Successfully linked Gmail account');
      }
    } catch (err) {
      toast.error('Google Sign In failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const order = await createOrder({
        items,
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        uid: currentUser?.uid,
        email: currentUser?.email,
        name: currentUser?.displayName || formData.fullName,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        }
      }).unwrap();
      
      setIsSendingEmail(true);
      try {
        await sendOrderConfirmationEmail({
          id: order.id,
          total: total,
          items: items.map(i => ({ name: i.product.name, price: i.product.price, quantity: i.quantity }))
        });
        toast.success('Order placed successfully! Check your Gmail.');
      } catch (err: any) {
        toast.success(`Order placed successfully! (Email failed: ${err.message})`);
      } finally {
        setIsSendingEmail(false);
      }

      dispatch(clearCart());
      setStep(3);
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-xl text-text-main">Your cart is empty</p>
        <Link to="/products" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="container mx-auto px-4 md:px-10 py-10 relative z-10 w-full max-w-[1000px]"
    >
      <div className="flex items-center gap-4 mb-8 text-sm">
        <span className={`${step >= 1 ? 'text-primary-blue' : 'text-text-muted'} font-semibold`}>1. Shipping</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className={`${step >= 2 ? 'text-primary-blue' : 'text-text-muted'} font-semibold`}>2. Payment</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className={`${step >= 3 ? 'text-primary-blue' : 'text-text-muted'} font-semibold`}>3. Confirmation</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <AnimatePresence>
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onSubmit={handleNext}
              className="bg-white border border-border-light p-6 rounded-md shadow-sm flex flex-col gap-6"
            >
              <h2 className="text-2xl font-bold text-text-main">Shipping Address</h2>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm text-text-muted text-left">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-white border border-border-light rounded-md px-4 py-3 placeholder:text-gray-400 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue" placeholder="John Doe" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-text-muted text-left">Address</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-white border border-border-light rounded-md px-4 py-3 placeholder:text-gray-400 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue" placeholder="123 Main St" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-text-muted text-left">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-white border border-border-light rounded-md px-4 py-3 placeholder:text-gray-400 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue" placeholder="New York" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-text-muted text-left">Pincode</label>
                  <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-white border border-border-light rounded-md px-4 py-3 placeholder:text-gray-400 outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue" placeholder="10001" />
                </div>
              </div>
              <button type="submit" className="btn-primary mt-4">Continue to Payment</button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="bg-white border border-border-light p-6 rounded-md shadow-sm flex flex-col gap-6"
            >
              <h2 className="text-2xl font-bold text-text-main">Payment Method</h2>
              
              <div className="flex flex-col gap-4">
                {['Card', 'UPI', 'Cash on Delivery'].map((method) => (
                  <label key={method} className={`flex items-center gap-4 p-4 rounded-md border cursor-pointer transition-colors ${formData.paymentMethod === method ? 'border-primary-blue bg-blue-50' : 'border-border-light bg-white hover:bg-gray-50'}`}>
                    <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleChange} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === method ? 'border-primary-blue' : 'border-gray-300'}`}>
                      {formData.paymentMethod === method && <div className="w-2.5 h-2.5 bg-primary-blue rounded-full shrink-0" />}
                    </div>
                    <span className="text-text-main">{method}</span>
                  </label>
                ))}
              </div>

              {needsAuth && (
                <div className="bg-gray-50 border border-border-light rounded-md p-6 flex flex-col items-center gap-4 text-center mt-2">
                  <p className="text-sm text-text-muted">Link your Gmail to receive order confirmation directly to your inbox</p>
                  <button type="button" onClick={handleGoogleLogin} disabled={isLoggingIn} className="gsi-material-button w-full max-w-[300px]">
                    <div className="gsi-material-button-state"></div>
                    <div className="gsi-material-button-content-wrapper flex items-center justify-center gap-3 w-full py-2 bg-white rounded-md border text-black hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="gsi-material-button-icon">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                          <path fill="none" d="M0 0h48v48H0z"></path>
                        </svg>
                      </div>
                      <span className="gsi-material-button-contents font-medium text-sm">Sign in with Google</span>
                    </div>
                  </button>
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary !bg-gray-200 !text-text-main hover:!bg-gray-300 flex-1">Back</button>
                <button type="button" onClick={handlePlaceOrder} disabled={isLoading || isSendingEmail || needsAuth} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  {(isLoading || isSendingEmail) ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : 'Place Order'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white border border-border-light p-6 rounded-md shadow-sm flex flex-col items-center justify-center text-center gap-6 py-12 lg:col-span-2"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2 text-text-main">Order Confirmed!</h2>
                <p className="text-text-muted">Thank you for your purchase. We will email you the details.</p>
              </div>
              <Link to="/products" className="btn-primary mt-4">Continue Shopping</Link>
            </motion.div>
          )}

        </AnimatePresence>

        {step !== 3 && (
          <div className="bg-white border border-border-light p-6 rounded-md shadow-sm h-fit sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-main">
              <ShoppingBag className="w-5 h-5 text-primary-blue" /> Order Summary
            </h3>
            
            <div className="flex flex-col gap-4 mb-6">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.product.imageUrl} alt={item.product.name} referrerPolicy="no-referrer" className="w-10 h-10 rounded-md object-cover border bg-gray-50" />
                    <span className="text-text-muted line-clamp-1 max-w-[120px]">{item.product.name} x{item.quantity}</span>
                  </div>
                  <span className="font-semibold text-text-main">₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="h-[1px] w-full bg-border-light mb-6"></div>
            
            <div className="flex flex-col gap-2 mb-6 text-sm text-text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-border-light mb-6"></div>
            
            <div className="flex justify-between items-end text-lg font-bold text-text-main">
              <span>Total</span>
              <span className="text-2xl text-primary-blue">₹{total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
