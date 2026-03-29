import { useNavigate, Link, useLocation } from "react-router-dom";
import { Coins, LogOut, Store, ScanSearch, User, Home, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white text-lg font-bold shadow-md">
              AI
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              ReSellAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <NavLink to="/" label="Home" icon={<Home size={20} />} isActive={isActive("/")} />
            <NavLink to="/predict" label="Sell" icon={<ScanSearch size={20} />} isActive={isActive("/predict")} />
            <NavLink to="/marketplace" label="Marketplace" icon={<Store size={20} />} isActive={isActive("/marketplace")} />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <Link
              to="/credits"
              className="inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200 hover:scale-105 transition-all"
            >
              <Coins size={18} className="text-green-500" />
              <span>{user.credits}</span>
            </Link>

            <Link
              to="/profile"
              className="hidden md:flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-green-700 hover:scale-105 transition-all"
            >
              <User size={20} />
              <span className="capitalize">{user.username}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center justify-center rounded-md p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:scale-105 transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center rounded-md p-2 text-slate-600 hover:text-green-700 hover:bg-slate-100 hover:scale-105 transition-all"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 bg-white rounded-lg shadow-md p-4">
            <NavLink to="/" label="Home" isActive={isActive("/")} />
            <NavLink to="/predict" label="Sell" isActive={isActive("/predict")} />
            <NavLink to="/marketplace" label="Marketplace" isActive={isActive("/marketplace")} />
            <Link
              to="/profile"
              className="block text-sm font-medium text-slate-600 hover:text-green-700 hover:scale-105 transition-all"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:scale-105 transition-all"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, label, icon, isActive }) {
  return (
    <Link
      to={to}
      className={`relative inline-flex items-center gap-3 px-5 py-2 rounded-full text-sm font-medium transition-all ${
        isActive
          ? "text-green-700 bg-green-50 shadow-md"
          : "text-slate-600 hover:text-green-700 hover:bg-slate-100"
      }`}
    >
      {icon}
      <span>{label}</span>
      {isActive && (
        <span className="absolute inset-x-5 -bottom-1 h-0.5 rounded-full bg-green-600 transition-all" />
      )}
    </Link>
  );
}