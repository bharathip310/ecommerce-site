import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Chrome, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { googleSignIn, loginWithEmail, signUpWithEmail } from '../lib/auth.ts';
import toast from 'react-hot-toast';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await googleSignIn();
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast.success('Successfully signed up!');
      } else {
        await loginWithEmail(email, password);
        toast.success('Successfully logged in!');
      }
      navigate('/dashboard');
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') errorMessage = 'Email is already registered';
      else if (error.code === 'auth/wrong-password') errorMessage = 'Invalid password';
      else if (error.code === 'auth/user-not-found') errorMessage = 'No user found with this email';
      else if (error.code === 'auth/weak-password') errorMessage = 'Password should be at least 6 characters';
      toast.error(errorMessage || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col md:flex-row items-stretch rounded-2xl overflow-hidden border border-border-light shadow-2xl bg-white max-w-[1000px] w-full mx-auto my-10">
      {/* Left Banner */}
      <div className="hidden md:flex flex-col flex-1 bg-slate-900 text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-cyan-500/10 z-0"></div>
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-[800] tracking-tight mb-20 text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-blue to-cyan-400 flex items-center justify-center shadow-lg shadow-primary-blue/20">
              <span className="text-white text-sm font-black">N</span>
            </div>
            NexStore
          </Link>

          <h2 className="text-4xl font-bold mb-6 leading-tight">Welcome to<br/>premium commerce.</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-sm">
            Access your personalized dashboard, track orders, and discover exclusive new collections tailored for you.
          </p>

          <div className="mt-auto flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                  <UserAvatar seed={i} />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-400">
              Join <span className="text-white font-bold">12,000+</span> elite shoppers
            </p>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 p-8 md:p-14 flex flex-col justify-center bg-white relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          key={isSignUp ? 'signup' : 'login'}
        >
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-800 mb-2">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
            <p className="text-slate-500 font-medium">{isSignUp ? 'Sign up to start browsing premium collections.' : 'Please enter your details to access your account.'}</p>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5 mb-8">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Password</label>
                {!isSignUp && <a href="#" className="text-sm font-bold text-primary-blue hover:underline">Forgot password?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Chrome className="w-5 h-5 text-blue-500" />
            )}
            Sign in with Google
          </button>
          
          <p className="text-center mt-10 text-slate-500 font-medium text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary-blue font-bold hover:underline"
            >
              {isSignUp ? 'Sign in now' : 'Sign up now'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function UserAvatar({ seed }: { seed: number }) {
  const colors = ['bg-orange-500', 'bg-emerald-500', 'bg-blue-500'];
  return (
    <div className={`w-full h-full rounded-full ${colors[seed % 3]} flex flex-col items-center justify-end overflow-hidden`}>
      <div className="w-4 h-4 bg-white/20 rounded-full mt-1"></div>
      <div className="w-6 h-6 bg-white/20 rounded-t-full mt-1"></div>
    </div>
  );
}
