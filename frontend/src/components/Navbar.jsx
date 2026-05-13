import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coins, 
  LogOut, 
  Store, 
  ScanSearch, 
  User, 
  Home, 
  Menu,
  X,
  ArrowRight
} from "lucide-react";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <Home size={18} /> },
    { to: "/predict", label: "Sell Item", icon: <ScanSearch size={18} /> },
    { to: "/marketplace", label: "Marketplace", icon: <Store size={18} /> },
  ];

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pointer-events-none">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-6xl mx-auto pointer-events-auto"
      >
        <div className={`glass-panel px-6 py-3 flex items-center justify-between transition-all duration-500 ${scrolled ? 'py-2 px-4 scale-[0.98]' : ''}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/30 group-hover:scale-110 transition-transform">
              <ScanSearch size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              ReSell<span className="text-brand-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/20 p-1 rounded-2xl border border-white/20">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  location.pathname === link.to 
                    ? "bg-white text-brand-primary shadow-sm" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/credits"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-500/10 text-amber-600 border border-amber-500/10 flex items-center gap-2 hover:bg-amber-500/20 transition-all"
                >
                  <Coins size={16} />
                  {user.credits}
                </Link>
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white hover:scale-105 transition-all shadow-lg shadow-slate-900/10"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-white/40 transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl text-sm font-bold bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  Join Now
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 rounded-xl bg-white/40 border border-white/40 text-slate-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="md:hidden absolute top-24 left-4 right-4 pointer-events-auto"
          >
            <div className="glass-panel p-4 flex flex-col gap-2 shadow-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl text-base font-bold flex items-center gap-3 ${
                    location.pathname === link.to 
                      ? "bg-brand-primary text-white" 
                      : "bg-white/40 text-slate-700 hover:bg-white/60"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-2xl bg-white/40 text-slate-700 font-bold flex items-center gap-3"
                  >
                    <User size={20} />
                    Account Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-2xl bg-red-50 text-red-500 font-bold flex items-center gap-3"
                  >
                    <LogOut size={20} />
                    Terminate Session
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-2xl bg-white/40 text-slate-700 font-bold text-center"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-2xl bg-brand-primary text-white font-bold text-center"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}