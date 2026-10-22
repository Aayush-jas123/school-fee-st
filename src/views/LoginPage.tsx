import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, User, ShieldCheck, Building2, ArrowRight, HelpCircle } from 'lucide-react';
import campusBg from '../assets/shanti-campus-bg.jpg';
import { INSTITUTION_CONFIG, DEFAULT_CREDENTIALS } from '../config/institutionConfig';
import { PORTAL_THEME } from '../theme/portalTheme';

interface LoginPageProps {
  onLoginSuccess: (staffName: string, role: 'admin' | 'clerk') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loginId, setLoginId] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const { classes } = PORTAL_THEME;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginId || !password) {
      setErrorMessage('Please enter both Login ID and Password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const match = DEFAULT_CREDENTIALS.find(
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#050505]">
      {/* College Campus Background with Translucent Soft-Focus Treatment */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src={campusBg}
          alt={INSTITUTION_CONFIG.name}
          className="w-full h-full object-cover object-center scale-105 filter blur-[2.5px] brightness-[0.88] contrast-[1.05]"
          loading="eager"
        />
        {/* Soft translucent atmospheric overlay */}
        <div className="absolute inset-0 bg-[#050505]/50 backdrop-blur-[1px]" />
        {/* Subtle vignette gradient for optimal foreground readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-[#050505]/30 to-[#050505]/50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className={classes.loginCard}>

          {/* Header & Branding */}
          <div className="text-center mb-8 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={`inline-flex items-center justify-center ${classes.iconBadge} mb-4 mx-auto`}
            >
              <Building2 className="w-6 h-6 text-[#0a0a0a]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-xl font-bold tracking-tight text-[#FF1493]"
            >
              {INSTITUTION_CONFIG.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className={`text-sm ${classes.subtitle} mt-1.5 flex items-center justify-center gap-1.5`}
            >
              <ShieldCheck className="w-4 h-4 text-[#7FFF00]" /> {INSTITUTION_CONFIG.portalName}
            </motion.p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-[#000000] border border-[#FF1493] text-[#7FFF00] text-xs text-center font-medium"
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
              <label className={classes.inputLabel}>
                Staff Login ID / Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7FFF00] group-focus-within:text-[#FF1493] transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className={classes.input}
                />
              </div>
            </motion.div>

            {/* Password Input with Show/Hide */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className={classes.inputLabel}>
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7FFF00] group-focus-within:text-[#FF1493] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  className={classes.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7FFF00] hover:text-[#FF1493] transition-colors cursor-pointer"
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
              className="flex items-center justify-between text-xs pt-1"
            >
              <label className="flex items-center gap-2 cursor-pointer text-[#7FFF00] hover:text-[#FF1493] transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={classes.checkbox}
                />
                Remember me on this device
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className={classes.link}
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
              className={classes.primaryBtn}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
              ) : (
                <>
                  Access Fee Portal
                  <ArrowRight className="w-4 h-4 text-[#0a0a0a]" />
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
          className="text-center text-xs text-stone-200/90 drop-shadow-md mt-6 font-medium"
        >
          {INSTITUTION_CONFIG.copyright}
        </motion.p>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {forgotModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setForgotModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0a0a0a] border-2 border-[#FF1493] rounded-2xl max-w-sm w-full p-6 text-[#7FFF00] shadow-[0_0_50px_rgba(255,20,147,0.4)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`w-12 h-12 rounded-xl ${classes.iconBadge} mb-4 shadow-md`}>
                <HelpCircle className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <h3 className="text-lg font-bold text-[#FF1493] mb-2">Password Reset Assistance</h3>
              <p className={`text-sm ${classes.mutedText} leading-relaxed mb-4`}>
                For security compliance, staff passwords must be reset by the IT Administrator.
              </p>
              <div className="bg-[#000000] p-3 rounded-xl border border-[#FF1493] text-xs space-y-1.5 mb-5 text-[#7FFF00]">
                <p><strong className="text-[#FF1493]">IT Helpdesk Email:</strong> {INSTITUTION_CONFIG.contact.itEmail}</p>
                <p><strong className="text-[#FF1493]">Internal Helpline:</strong> {INSTITUTION_CONFIG.contact.helpline}</p>
              </div>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="w-full py-2.5 bg-[#FF1493] hover:bg-[#FF1493]/90 text-[#0a0a0a] rounded-xl text-xs font-bold transition-colors cursor-pointer"
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
