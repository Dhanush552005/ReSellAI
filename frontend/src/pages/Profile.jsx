import { motion } from "framer-motion";
import { User, Mail, Coins, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
          <User size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-white capitalize">{user.username}</h1>
        <p className="text-indigo-400 font-medium">Verified ReSellAI Member</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Email Address</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
            </div>
            <ShieldCheck size={20} className="text-emerald-500/50" />
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                <Coins size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Available Credits</p>
                <p className="text-white font-bold text-xl">{user.credits} Scans Left</p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/credits")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all"
            >
              Get More
            </button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full mt-6 p-5 flex items-center justify-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold hover:bg-red-500/20 transition-all"
        >
          <LogOut size={20} />
          Sign Out of Account
        </motion.button>
      </div>
    </div>
  );
}