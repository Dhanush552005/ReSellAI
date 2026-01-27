import { useNavigate, Link } from "react-router-dom"
import { Coins, LogOut, Store, ScanSearch, User } from "lucide-react"

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
        
        
       <Link to="/predict" className="flex items-center gap-3">
        
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="font-black text-white text-sm">AI</span>
        </div>

        <div className="flex flex-col leading-tight">
          <span className="font-bold text-xl tracking-tight text-white">
            <span className="text-indigo-400">ReSellAI</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-medium hidden sm:block">
            Intelligent Mobile Resale Platform
          </span>
        </div>
      </Link>

        
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to="/predict" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ScanSearch size={20} />
            <span className="text-sm font-medium hidden md:block">Predictor</span>
          </Link>
          
          <Link to="/marketplace" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <Store size={20} />
            <span className="text-sm font-medium hidden md:block">Marketplace</span>
          </Link>
        </div>

        
        <div className="flex items-center gap-4">
          
          <Link 
            to="/credits" 
            className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full hover:bg-indigo-500/20 transition-all cursor-pointer"
          >
            <Coins size={16} className="text-indigo-400" />
            <span className="text-sm font-bold text-indigo-100">{user.credits}</span>
          </Link>

          <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

          
          <div className="flex items-center gap-3">
            <Link 
              to="/profile" 
              className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-2"
            >
              <User size={18} />
              <span className="hidden sm:block capitalize">{user.username}</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all hidden md:block"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}