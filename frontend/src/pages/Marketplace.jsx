import { useEffect, useMemo, useState } from "react"
import { getMarketplace, createPhoneOrder, verifyPhonePayment, markSold } from "../api"
import { motion, AnimatePresence } from "framer-motion"
import { Smartphone, ShieldCheck, Tag, CheckCircle2, Search, Filter, SlidersHorizontal, ArrowUpRight, ShoppingBag, X } from "lucide-react"

export default function Marketplace({ user, fetchUser }) {
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(true)
  const [buyingId, setBuyingId] = useState(null)
  const [view, setView] = useState("on_sale") 
  const [search, setSearch] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [sortOrder, setSortOrder] = useState("price_asc")

  useEffect(() => {
    loadPhones()
  }, [])

  const loadPhones = async () => {
    setLoading(true)
    const data = await getMarketplace()
    if (!data.error) {
      setPhones(data)
    }
    setLoading(false)
  }

  const handleMarkSold = async (phoneId) => {
    if (!window.confirm("Are you sure you want to mark this as sold?")) return
    const result = await markSold(phoneId)
    if (!result.error) {
      await loadPhones()
    }
  }

  const handleBuy = async (phone) => {
    const userId = user?._id?.toString()
    const sellerId = typeof phone?.seller_id === "object"
        ? phone.seller_id.$oid || phone.seller_id._id || phone.seller_id.toString()
        : phone.seller_id?.toString()
    const isOwner = userId && sellerId && userId === sellerId

    if (isOwner) {
      alert("You cannot buy your own phone")
      return
    }

    setBuyingId(phone._id)
    try {
      const order = await createPhoneOrder(phone._id)
      if (order.error) {
        setBuyingId(null)
        return
      }

      const options = {
        key: order.key || "rzp_test_S8724szOQL9Rb2",
        amount: order.amount,
        currency: "INR",
        name: "ReSellAI Marketplace",
        description: `Purchase ${phone.brand} (${phone.storage}GB)`,
        order_id: order.order_id,
        handler: async (response) => {
          const formData = new FormData()
          formData.append("razorpay_order_id", response.razorpay_order_id)
          formData.append("razorpay_payment_id", response.razorpay_payment_id)
          formData.append("razorpay_signature", response.razorpay_signature)
          formData.append("phone_id", phone._id)

          const result = await verifyPhonePayment(formData)
          if (result.message) {
            await loadPhones()
            if (fetchUser) await fetchUser()
          }
          setBuyingId(null)
        },
        prefill: {
          name: user?.username || "Guest User",
          email: user?.email || "test@example.com",
        },
        theme: { color: "#5B8CFF" },
        modal: { ondismiss: () => setBuyingId(null) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      setBuyingId(null)
    }
  }

  const filteredPhones = useMemo(() => {
    const base = phones.filter((p) => p.status?.toLowerCase() === view.toLowerCase())
    const bySearch = base.filter((p) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      const brand = (p.brand || "").toString().toLowerCase()
      const specs = `${p.ram || ""} ${p.storage || ""}`.toLowerCase()
      return brand.includes(q) || specs.includes(q)
    })
    const byBrand = brandFilter ? bySearch.filter((p) => (p.brand || "").toString().toLowerCase() === brandFilter.toLowerCase()) : bySearch
    const sorted = [...byBrand]
    if (sortOrder === "price_asc") sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
    else if (sortOrder === "price_desc") sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    return sorted
  }, [phones, view, search, brandFilter, sortOrder])

  const brandOptions = useMemo(() => {
    const set = new Set(phones.map((p) => (p.brand || "").toString().toLowerCase()).filter(Boolean))
    return Array.from(set).sort()
  }, [phones])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-brand-primary/10 rounded-full" />
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
      </div>
      <p className="text-slate-500 font-medium animate-pulse">Syncing Marketplace...</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header & Controls */}
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Marketplace</h1>
            <p className="text-lg text-slate-500">Discover AI-validated hardware at fractional costs.</p>
          </div>

          <div className="glass-panel p-1.5 flex items-center gap-1">
            <button
              onClick={() => setView("on_sale")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                view === "on_sale" ? "bg-white shadow-sm text-brand-primary border border-slate-100" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Tag size={16} />
              Live Listings
            </button>
            <button
              onClick={() => setView("sold")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                view === "sold" ? "bg-white shadow-sm text-slate-900 border border-slate-100" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <CheckCircle2 size={16} />
              Archive
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model, brand, or specifications..."
              className="w-full bg-white/50 border border-slate-100 pl-11 pr-4 py-3 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full bg-white/50 border border-slate-100 pl-10 pr-4 py-3 rounded-2xl text-sm appearance-none outline-none focus:bg-white transition-all cursor-pointer"
              >
                <option value="">All Brands</option>
                {brandOptions.map((b) => (
                  <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 md:w-48">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-white/50 border border-slate-100 pl-10 pr-4 py-3 rounded-2xl text-sm appearance-none outline-none focus:bg-white transition-all cursor-pointer"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filteredPhones.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 glass-panel border-dashed border-slate-200"
          >
            <Smartphone className="mx-auto text-slate-300 mb-6" size={64} strokeWidth={1} />
            <h3 className="text-xl font-bold text-slate-800">No Inventory Found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhones.map((phone) => (
              <ProductCard 
                key={phone._id} 
                phone={phone} 
                user={user} 
                onBuy={handleBuy} 
                onMarkSold={handleMarkSold} 
                buyingId={buyingId} 
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductCard({ phone, user, onBuy, onMarkSold, buyingId }) {
  const userId = user?._id?.toString()
  const sellerId = typeof phone?.seller_id === "object"
    ? phone.seller_id.$oid || phone.seller_id._id || phone.seller_id.toString()
    : phone.seller_id?.toString()
  const isOwner = userId && sellerId && userId === sellerId
  const isSold = phone.status?.toLowerCase() === "sold"

  const damageLabels = {
    no_broken: { label: "Mint", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    light_broken: { label: "Good", color: "text-amber-500", bg: "bg-amber-500/10" },
    moderately_broken: { label: "Fair", color: "text-orange-500", bg: "bg-orange-500/10" },
    severe_broken: { label: "Poor", color: "text-red-500", bg: "bg-red-500/10" },
  }
  const status = damageLabels[phone.damage] || damageLabels.light_broken

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card group flex flex-col h-full border-white/40"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] m-3 bg-slate-100">
        <img
          src={`http://localhost:8000/${phone.image_path}`}
          alt={phone.brand}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isSold ? 'grayscale' : ''}`}
        />
        
        {/* Overlays */}
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 border border-white">
            <ShieldCheck size={14} className="text-brand-primary" />
            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">AI Verified</span>
          </div>
        </div>

        {isSold && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-white px-6 py-2 rounded-full font-bold text-sm tracking-widest text-slate-900 shadow-xl">
              SOLD
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 pt-2 flex-1 flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 capitalize leading-tight group-hover:text-brand-primary transition-colors">
              {phone.brand}
            </h3>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              {phone.ram}GB / {phone.storage}GB · {phone.age}y
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/50 ${status.bg} ${status.color}`}>
            {status.label}
          </div>
        </div>

        <div className="pt-2 flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tighter">
              ₹{phone.price.toLocaleString()}
            </p>
          </div>
          
          <div className="pb-1">
            {!isSold && (
              isOwner ? (
                <button
                  onClick={() => onMarkSold(phone._id)}
                  className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
                  title="Mark as Sold"
                >
                  <X size={18} />
                </button>
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <ShoppingBag size={18} />
                </div>
              )
            )}
          </div>
        </div>

        {!isSold && !isOwner && (
          <button
            onClick={() => onBuy(phone)}
            disabled={buyingId === phone._id}
            className="w-full py-4 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-xl shadow-brand-primary/10 hover:bg-brand-primary/90 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {buyingId === phone._id ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <>Purchase Item <ArrowUpRight size={18} /></>
            )}
          </button>
        )}

        {isOwner && !isSold && (
          <button
            onClick={() => onMarkSold(phone._id)}
            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all duration-300"
          >
            Mark as Sold
          </button>
        )}
      </div>
    </motion.div>
  )
}

