import { useNavigate, Link, useLocation } from "react-router-dom"
import { Coins, LogOut, Store, ScanSearch, User, Home } from "lucide-react"

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-white text-base font-semibold shadow-md">
              AI
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-xl tracking-tight text-slate-900">
                ReSellAI
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-medium hidden sm:block">
                Intelligent Mobile Resale Platform
              </span>
            </div>
          </Link>

          <div className="flex-1 hidden md:flex items-center justify-center">
            <div className="flex items-center gap-10">
              <Link
                to="/"
                className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive("/")
                    ? "text-green-700 bg-green-50"
                    : "text-slate-600 hover:text-green-700 hover:bg-slate-50"
                }`}
              >
                <Home size={18} className="hidden sm:block" />
                <span>Home</span>
                {isActive("/") && (
                  <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-green-600" />
                )}
              </Link>

              <Link
                to="/predict"
                className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive("/predict")
                    ? "text-green-700 bg-green-50"
                    : "text-slate-600 hover:text-green-700 hover:bg-slate-50"
                }`}
              >
                <ScanSearch size={18} className="hidden sm:block" />
                <span>Sell</span>
                {isActive("/predict") && (
                  <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-green-600" />
                )}
              </Link>

              <Link
                to="/marketplace"
                className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive("/marketplace")
                    ? "text-green-700 bg-green-50"
                    : "text-slate-600 hover:text-green-700 hover:bg-slate-50"
                }`}
              >
                <Store size={18} className="hidden sm:block" />
                <span>Marketplace</span>
                {isActive("/marketplace") && (
                  <span className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-green-600" />
                )}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/credits"
              className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-3.5 py-1.5 text-sm font-medium text-green-700 hover:bg-green-200/70 transition-colors cursor-pointer"
            >
              <Coins size={16} className="text-green-500" />
              <span>{user.credits}</span>
            </Link>

            <div className="hidden sm:block h-6 w-px bg-slate-200" />

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-green-700 transition-colors cursor-pointer"
              >
                <User size={18} />
                <span className="hidden sm:block capitalize">{user.username}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="hidden md:inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}