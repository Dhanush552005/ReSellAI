import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Coins, LogOut, ShieldCheck, Smartphone, LayoutDashboard, History, ShoppingBag, ArrowRight, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getMyListings } from "../api"

export default function Profile({ user, setUser }) {
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [activeTab, setActiveTab] = useState("on_sale")

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  useEffect(() => {
    const fetchListings = async () => {
      const res = await getMyListings()
      if (!res.error) setListings(res)
    }
    fetchListings()
  }, [])

  const filteredListings = listings.filter((phone) => phone.status === activeTab)

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-8 border-b border-white/40">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white shadow-2xl">
              <User size={48} strokeWidth={1.5} />
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-brand-success border-4 border-white flex items-center justify-center text-white">
              <ShieldCheck size={14} />
            </div>
          </motion.div>
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tighter capitalize">{user.username}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 text-slate-500">
              <Mail size={16} />
              <span className="font-medium">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="glass-button-secondary p-3 rounded-2xl">
            <Settings size={20} />
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm shadow-xl shadow-red-500/10 hover:bg-red-600 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scanning Capacity</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-slate-900">{user.credits}</span>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Credits</span>
                </div>
              </div>
              
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.credits / 50) * 100}%` }}
                  className="h-full bg-brand-primary rounded-full"
                />
              </div>

              <button 
                onClick={() => navigate("/credits")}
                className="glass-button-primary w-full py-4"
              >
                <Coins size={18} />
                Refill Credits
              </button>
            </div>
            {/* Background Blob */}
            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-brand-primary/10 blur-3xl rounded-full pointer-events-none" />
          </div>

          <div className="glass-panel p-2 flex flex-col gap-1">
            <button className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-slate-100 text-brand-primary font-bold">
              <div className="flex items-center gap-3">
                <LayoutDashboard size={20} />
                Dashboard Overview
              </div>
              <ArrowRight size={16} />
            </button>
            <button className="flex items-center justify-between p-4 rounded-2xl text-slate-500 font-bold hover:bg-white/40 transition-all">
              <div className="flex items-center gap-3">
                <History size={20} />
                Transaction History
              </div>
              <ArrowRight size={16} />
            </button>
            <button className="flex items-center justify-between p-4 rounded-2xl text-slate-500 font-bold hover:bg-white/40 transition-all">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} />
                Security Settings
              </div>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Listings Management */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Active Inventory</h2>
            <div className="glass-panel p-1 flex gap-1">
              <button
                onClick={() => setActiveTab("on_sale")}
                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'on_sale' ? 'bg-white shadow-sm text-brand-primary' : 'text-slate-400'}`}
              >
                On Sale
              </button>
              <button
                onClick={() => setActiveTab("sold")}
                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'sold' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
              >
                Archived
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredListings.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel py-20 flex flex-col items-center text-center space-y-4 border-dashed border-slate-200"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <ShoppingBag size={32} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 text-lg">No Items Detected</p>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Your marketplace history is currently empty. Start selling to track your assets.</p>
                </div>
                <button 
                  onClick={() => navigate("/predict")}
                  className="mt-4 text-brand-primary font-bold flex items-center gap-2 hover:underline"
                >
                  Initiate New Scan <ArrowRight size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {filteredListings.map((phone) => (
                  <ListingItem key={phone._id} phone={phone} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function ListingItem({ phone }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card p-5 border-white/60 flex items-center gap-5"
    >
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
        <img 
          src={`http://localhost:8000/${phone.image_path}`} 
          alt={phone.brand} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 capitalize truncate">{phone.brand}</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
          {phone.ram}GB / {phone.storage}GB
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-lg font-bold text-brand-primary">₹{phone.price.toLocaleString()}</span>
          <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${phone.status === 'on_sale' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-600'}`}>
            {phone.status.replace('_', ' ')}
          </div>
        </div>
      </div>
      <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-brand-primary hover:text-white transition-all">
        <ArrowRight size={18} />
      </button>
    </motion.div>
  )
}

