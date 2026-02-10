import { motion } from "framer-motion"
import { User, Mail, Coins, LogOut, ShieldCheck, Smartphone } from "lucide-react"
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
      if (!res.error) {
        setListings(res)
      }
    }
    fetchListings()
  }, [])

  const filteredListings = listings.filter(
    (phone) => phone.status === activeTab
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          Account overview
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your profile, credits and listings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-slate-100 flex items-center justify-center">
                <User size={32} className="text-slate-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900 capitalize">
                  {user.username}
                </h2>
                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-100 px-2.5 py-1 text-[11px] font-medium text-green-700">
                  <ShieldCheck size={12} />
                  <span>Verified member</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Available credits
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {user.credits}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  AI scans remaining on your account.
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <Coins size={20} className="text-green-600" />
              </div>
            </div>

            <button
              onClick={() => navigate("/credits")}
              className="mt-4 w-full rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 transition-colors"
            >
              Get more credits
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full mt-2 py-3.5 flex items-center justify-center gap-2 rounded-xl border border-red-400 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </motion.button>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                My listings
              </h2>
              <p className="text-sm text-slate-500">
                Devices you&apos;ve put up for sale.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setActiveTab("on_sale")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === "on_sale"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                On Sale
              </button>
              <button
                onClick={() => setActiveTab("sold")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === "sold"
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Sold
              </button>
            </div>

            {filteredListings.length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-lg py-10 flex flex-col items-center justify-center text-center">
                <Smartphone className="text-slate-300 mb-3" size={40} />
                <p className="text-sm font-medium text-slate-700">
                  No devices found.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  List a device from the Sell page and it will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((phone) => (
                  <div
                    key={phone._id}
                    className="rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-semibold text-slate-900 capitalize">
                      {phone.brand}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      ₹{phone.price}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 capitalize">
                      Status: {phone.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
