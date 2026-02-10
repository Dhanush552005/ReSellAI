import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
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
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {user && <Navbar user={user} setUser={setUser} />}

        <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full rounded-2xl bg-white border border-slate-200 shadow-md p-4 sm:p-6 lg:p-8"
          >
            <Routes>
              <Route path="/" element={<Home />} />
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
        </main>

        <footer className="bg-white border-t">
          <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-500 flex justify-between">
            <p>© {new Date().getFullYear()} ReSellAI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gray-800">Privacy</a>
              <a href="#" className="hover:text-gray-800">Terms</a>
              <a href="#" className="hover:text-gray-800">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
