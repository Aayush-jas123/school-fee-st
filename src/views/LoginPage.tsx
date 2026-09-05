import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, User, ShieldCheck, Building2, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (staffName: string) => void;
}

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
      setIsLoading(false);
      onLoginSuccess('Dr. Rajesh Sharma (Accounts Officer)');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-violet-600/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/[0.05] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/[0.03] rounded-full blur-[160px]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, rgba(139,92,246,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="relative bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800/60 rounded-3xl p-8 shadow-2xl shadow-black/40">
          {/* Gradient border accent */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10 opacity-60" />
          </div>

          {/* Header & Branding */}
          <div className="text-center mb-8 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-blue-500 to-emerald-500 p-[1.5px] shadow-lg shadow-violet-500/20 mb-4"
            >
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Building2 className="w-7 h-7 text-violet-400" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl font-bold tracking-tight text-white"
            >
              Shanti College of Education
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-sm text-zinc-400 mt-1.5 flex items-center justify-center gap-1.5 font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Staff Fee Management Portal
            </motion.p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center font-medium"
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
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Staff Login ID / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. staff@shanticollege.edu.in"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 transition-all"
                />
              </div>
            </motion.div>

            {/* Password Input with Show/Hide */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-zinc-950/70 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
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
              className="flex items-center justify-between text-xs text-zinc-500 pt-1"
            >
              <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-300 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-violet-600 focus:ring-violet-500/30"
                />
                Remember me on this device
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-violet-400 hover:text-violet-300 font-medium hover:underline flex items-center gap-1 transition-colors"
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
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-blue-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 animated-gradient"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Access Fee Portal
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="text-center text-xs text-zinc-600 mt-6"
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setForgotModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-sm w-full p-6 text-zinc-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Password Reset Assistance</h3>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                For security compliance, staff passwords must be reset by the IT Administrator.
              </p>
              <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-xs space-y-1.5 mb-5">
                <p><strong className="text-violet-300">IT Helpdesk Email:</strong> admin@shanticollege.edu.in</p>
                <p><strong className="text-violet-300">Internal Helpline:</strong> Ext. 104 / +91 172 298104</p>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold transition-colors"
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
