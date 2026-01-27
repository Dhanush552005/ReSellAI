import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { getMe } from "./api"
import Predict from "./pages/Predict"
import Login from "./pages/Login"
import Credits from "./pages/Credits"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Marketplace from "./pages/Marketplace"
import Navbar from "./components/Navbar"

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    const token = localStorage.getItem("token")
    if (token) {
      const res = await getMe()
      if (!res.error) {
        setUser(res)
      } else {
        localStorage.removeItem("token")
      }
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (loading) return null

  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        
        {user && <Navbar user={user} setUser={setUser} />}

        <div className="flex justify-center px-4 pt-24 pb-24">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-indigo-500/20 blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500/20 blur-[150px] animate-pulse-slow-reverse" />

          <style>{`
            @keyframes pulse-slow {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(20px, 20px); }
            }
            @keyframes pulse-slow-reverse {
              0%, 100% { transform: translate(0, 0); }
              50% { transform: translate(-20px, -20px); }
            }
            .animate-pulse-slow {
              animation: pulse-slow 20s infinite alternate ease-in-out;
            }
            .animate-pulse-slow-reverse {
              animation: pulse-slow-reverse 20s infinite alternate ease-in-out;
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full max-w-lg lg:max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-indigo-900/60 p-6 sm:p-10"
          >
            <Routes>
              <Route path="/" element={<Navigate to="/predict" />} />
              <Route path="/login" element={<Login fetchUser={fetchUser} />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/predict"
                element={user ? <Predict user={user} fetchUser={fetchUser} /> : <Navigate to="/login" />}
              />

              <Route
                path="/credits"
                element={user ? <Credits fetchUser={fetchUser} /> : <Navigate to="/login" />}
              />
              <Route
                path="/profile"
                element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />}
              />

              <Route
                path="/marketplace"
                element={user ? <Marketplace user={user} fetchUser={fetchUser} /> : <Navigate to="/login" />}
              />
            </Routes>
          </motion.div>
        </div>

        <footer className="absolute bottom-3 sm:bottom-6 w-full text-xs text-indigo-300/40 tracking-wide text-center px-4">
          Built with YOLO · CNN · XGBoost · FastAPI · React & Tailwind CSS
        </footer>
      </div>
    </BrowserRouter>
  )
}