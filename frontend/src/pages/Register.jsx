import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await registerUser({ username, email, password });

    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    }
    setLoading(false);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value.length < 6) setPasswordStrength("Weak");
    else if (value.length < 10) setPasswordStrength("Moderate");
    else setPasswordStrength("Strong");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      {/* Left Side: Visual Experience */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-slate-900 overflow-hidden">
        <div className="relative z-10 text-center space-y-8 px-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-3xl bg-brand-premium flex items-center justify-center text-white mx-auto shadow-2xl shadow-brand-premium/40"
          >
            <Sparkles size={48} />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white tracking-tighter">Join ReSellAI</h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Unlock the full potential of your hardware with AI-driven market analytics.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-12">
            {[
              { label: "Verified Users", val: "10K+" },
              { label: "Market Volume", val: "₹15Cr+" }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-6 border-white/10 bg-white/5">
                <p className="text-2xl font-bold text-white">{stat.val}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ambient background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-premium/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-primary/10 blur-[100px] rounded-full" />
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          <div className="glass-panel p-8 sm:p-12 space-y-8 border-white">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
              <p className="text-slate-500">Initialize your neural-connected profile</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3"
                >
                  <ShieldCheck size={18} />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-brand-success/10 border border-brand-success/20 text-brand-success px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3"
                >
                  <ShieldCheck size={18} />
                  Registration successful! Redirecting...
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Identity Tag</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-900"
                    placeholder="Dhanush S"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Endpoint</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-900"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-900"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Key</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-900"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {password && (
                <div className="px-1 flex items-center justify-between">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strength: <span className={passwordStrength === 'Strong' ? 'text-brand-success' : passwordStrength === 'Moderate' ? 'text-amber-500' : 'text-red-500'}>{passwordStrength}</span></p>
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">{showPassword ? 'Hide Key' : 'Reveal Key'}</button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="glass-button-primary w-full py-4 text-lg mt-4"
              >
                {loading ? "Initializing..." : "Register Account"}
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Existing operator?{' '}
                <Link
                  to="/login"
                  className="text-brand-primary font-bold hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}