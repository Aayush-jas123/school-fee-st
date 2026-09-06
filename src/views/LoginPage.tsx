import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, User, ShieldCheck, Building2, ArrowRight, HelpCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (staffName: string, role: 'admin' | 'clerk') => void;
}

// Hardcoded credential store
const CREDENTIALS = [
  { id: 'admin', password: 'admin@123', name: 'Dr. Rajesh Sharma (Accounts Officer)', role: 'admin' as const },
  { id: 'clerk', password: 'clerk@123', name: 'Staff Viewer (Clerk)', role: 'clerk' as const },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginId || !password) {
      setErrorMessage('Please enter both Login ID and Password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const match = CREDENTIALS.find(
        (c) => c.id === loginId.trim().toLowerCase() && c.password === password
      );
      if (match) {
        onLoginSuccess(match.name, match.role);
      } else {
        setErrorMessage('Invalid Login ID or Password. Please try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-stone-200/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-stone-200/40 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="relative bg-white border border-stone-200/80 rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_40px_rgba(0,0,0,0.06)]">

          {/* Header & Branding */}
          <div className="text-center mb-8 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-rose-800 mb-4 shadow-lg shadow-rose-800/10"
            >
              <Building2 className="w-6 h-6 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-xl font-bold tracking-tight text-stone-900"
            >
              Shanti College of Education
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-sm text-stone-500 mt-1.5 flex items-center justify-center gap-1.5 font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-stone-400" /> Staff Fee Management Portal
            </motion.p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs text-center font-medium"
              >
                {errorMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative">
            {/* Login ID Input */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Staff Login ID / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-700 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. staff@shanticollege.edu.in"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-rose-800/50 focus:ring-2 focus:ring-stone-100 transition-all"
                />
              </div>
            </motion.div>

            {/* Password Input with Show/Hide */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400 group-focus-within:text-stone-700 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-rose-800/50 focus:ring-2 focus:ring-stone-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="flex items-center justify-between text-xs text-stone-500 pt-1"
            >
              <label className="flex items-center gap-2 cursor-pointer hover:text-stone-700 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 bg-white text-stone-900 focus:ring-stone-200"
                />
                Remember me on this device
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-stone-600 hover:text-stone-900 font-medium hover:underline flex items-center gap-1 transition-colors"
              >
                Forgot Password?
              </button>
            </motion.div>

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-800 text-stone-50 text-sm font-semibold shadow-lg shadow-rose-800/10 hover:bg-rose-700 hover:shadow-rose-800/15 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Access Fee Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Credentials Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-500 space-y-1"
          >
            <p className="font-semibold text-stone-600 text-center mb-1.5">Demo Credentials</p>
            <div className="flex justify-between items-center">
              <span><strong className="text-stone-700">Admin:</strong> admin / admin@123</span>
              <span className="text-stone-400">Full Access</span>
            </div>
            <div className="flex justify-between items-center">
              <span><strong className="text-stone-700">Clerk:</strong> clerk / clerk@123</span>
              <span className="text-amber-600 font-medium">View Only</span>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="text-center text-xs text-stone-400 mt-6"
        >
          © 2026 Shanti College of Education • Approved by NCTE & State Council
        </motion.p>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setForgotModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-stone-200 rounded-2xl max-w-sm w-full p-6 text-stone-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Password Reset Assistance</h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-4">
                For security compliance, staff passwords must be reset by the IT Administrator.
              </p>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1.5 mb-5">
                <p><strong className="text-stone-700">IT Helpdesk Email:</strong> admin@shanticollege.edu.in</p>
                <p><strong className="text-stone-700">Internal Helpline:</strong> Ext. 104 / +91 172 298104</p>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="w-full py-2.5 bg-rose-800 hover:bg-rose-700 text-stone-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Back to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
