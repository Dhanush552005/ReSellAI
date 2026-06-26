import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Login({ fetchUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await loginUser({ email, password });

    if (res.error) {
      setError(res.error);
    } else {
      await fetchUser();
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      {/* Left Side: Visual Experience */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-slate-900 overflow-hidden">
        <div className="relative z-10 text-center space-y-8 px-12 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 rounded-3xl bg-brand-primary flex items-center justify-center text-white mx-auto shadow-2xl shadow-brand-primary/40"
          >
            <Cpu size={48} />
          </motion.div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white tracking-tighter">ReSellAI</h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Experience the future of hardware valuation with our spatial intelligence engine.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-12">
            {[
              { label: "ML Scans", val: "2.4M+" },
              { label: "Trust Score", val: "99.9%" }
            ].map((stat, i) => (
              <div key={i} className="glass-panel p-6 border-white/10 bg-white/5">
                <p className="text-2xl font-bold text-white">{stat.val}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ambient background elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-premium/10 blur-[100px] rounded-full" />
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          <div className="glass-panel p-8 sm:p-12 space-y-10 border-white">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500">Sign in to your spatial dashboard</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-3"
              >
                <ShieldCheck size={18} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Network Identifier
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-900"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Security Key
                  </label>
                  <Link to="#" className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-slate-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="glass-button-primary w-full py-4 text-lg"
              >
                {loading ? "Authenticating..." : "Access Dashboard"}
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="pt-8 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                New to the platform?{' '}
                <Link
                  to="/register"
                  className="text-brand-primary font-bold hover:underline"
                >
                  Initialize Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
