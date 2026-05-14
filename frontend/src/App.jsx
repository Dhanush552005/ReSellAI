import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { getMe } from "./api"
import Home from "./pages/Home"
import Predict from "./pages/Predict"
import Login from "./pages/Login"
import Credits from "./pages/Credits"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Marketplace from "./pages/Marketplace"
import Navbar from "./components/Navbar"
import Support from "./pages/Support"

const PageWrapper = ({ children }) => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 1.02 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

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
      <div className="min-h-screen flex flex-col bg-vision-gradient relative overflow-hidden">
        {/* Ambient Spatial Blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full animate-pulse-slow" />
          <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-brand-premium/10 blur-[100px] rounded-full animate-pulse-slow-reverse" />
          <div className="absolute top-[20%] right-[15%] w-[20%] h-[20%] bg-brand-secondary/10 blur-[80px] rounded-full animate-pulse-slow" />
        </div>

        <Navbar user={user} setUser={setUser} />

        <main className="flex-grow w-full pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative z-10 max-w-[1440px] mx-auto">
          <PageWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login fetchUser={fetchUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/support" element={<Support />} />
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
          </PageWrapper>
        </main>

        <footer className="relative z-10 border-t border-white/20 bg-white/30 backdrop-blur-md py-12">
          <div className="max-w-7xl mx-auto px-6 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-lg tracking-tight">ReSell<span className="text-brand-primary">AI</span></span>
              <span className="text-slate-300 ml-2">|</span>
              <p className="ml-2">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-brand-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-brand-primary transition-colors">Contact Support</a>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

