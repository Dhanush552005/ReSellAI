import { useEffect, useMemo, useState } from "react"
import { getMarketplace, createPhoneOrder, verifyPhonePayment, markSold } from "../api"
import { motion } from "framer-motion"
import { Smartphone, ShieldCheck, Tag, CheckCircle2, Search } from "lucide-react"

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
      alert("Successfully marked as sold!")
      await loadPhones()
    } else {
      alert(result.error)
    }
  }

  const handleBuy = async (phone) => {
  
    const userId = user?._id?.toString()

    const sellerId =
      typeof phone?.seller_id === "object"
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
        alert(typeof order.error === "object" ? JSON.stringify(order.error) : order.error)
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
            alert("Purchase Successful!")
            await loadPhones()
            if (fetchUser) await fetchUser()
          } else {
            alert(result.error || "Payment verification failed")
          }
          setBuyingId(null)
        },
        prefill: {
          name: user?.username || "Guest User",
          email: user?.email || "test@example.com",
        },
        theme: { color: "#16a34a" },
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
    const base = phones.filter(
      (p) => p.status?.toLowerCase() === view.toLowerCase()
    )

    const bySearch = base.filter((p) => {
      if (!search.trim()) return true
      const q = search.toLowerCase()
      const brand = (p.brand || "").toString().toLowerCase()
      const specs = `${p.ram || ""} ${p.storage || ""}`.toLowerCase()
      return brand.includes(q) || specs.includes(q)
    })

    const byBrand = brandFilter
      ? bySearch.filter(
          (p) =>
            (p.brand || "").toString().toLowerCase() ===
            brandFilter.toLowerCase()
        )
      : bySearch

    const sorted = [...byBrand]
    if (sortOrder === "price_asc") {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (sortOrder === "price_desc") {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    }

    return sorted
  }, [phones, view, search, brandFilter, sortOrder])

  const brandOptions = useMemo(() => {
    const set = new Set(
      phones
        .map((p) => (p.brand || "").toString().toLowerCase())
        .filter(Boolean)
    )
    return Array.from(set).sort()
  }, [phones])
 const damageLabel = (damage) => {
    return {
      no_broken: "No Damage",
      light_broken: "Light Damage",
      moderately_broken: "Moderate Damage",
      severe_broken: "Severe Damage",
    }[damage] || damage
  }

  const damageStyle = (damage) => {
    if (damage === "no_broken")
      return "bg-green-50 text-green-700 border border-green-200"
    if (damage === "light_broken")
      return "bg-yellow-50 text-yellow-700 border border-yellow-200"
    if (damage === "moderately_broken")
      return "bg-orange-50 text-orange-700 border border-orange-200"
    return "bg-red-50 text-red-700 border border-red-200"
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-400 font-medium">Loading Marketplace...</p>
      </div>
    )

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Refurbished phones marketplace
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              AI-verified devices with transparent, fair pricing.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-medium">
            <button
              onClick={() => setView("on_sale")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                view === "on_sale"
                  ? "bg-green-600 text-white"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              <Tag size={14} />
              <span>On Sale</span>
            </button>
            <button
              onClick={() => setView("sold")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                view === "sold"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              <CheckCircle2 size={14} />
              <span>Sold</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand or specs"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 justify-start sm:justify-end">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="min-w-[9rem] px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All brands</option>
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b.charAt(0).toUpperCase() + b.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="min-w-[10rem] px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="price_asc">Price · Low to High</option>
              <option value="price_desc">Price · High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {filteredPhones.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
          <Smartphone className="mx-auto text-slate-400 mb-4" size={40} />
          <p className="text-sm text-slate-500">
            No {view.replace("_", " ")} devices match your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
          {filteredPhones.map((phone) => {
            
            const userId = user?._id?.toString()

            const sellerId =
              typeof phone?.seller_id === "object"
                ? phone.seller_id.$oid ||
                  phone.seller_id._id ||
                  phone.seller_id.toString()
                : phone.seller_id?.toString()

            const isOwner = userId && sellerId && userId === sellerId

            return (
              <motion.div
                key={phone._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group relative"
              >
                {phone.status?.toLowerCase() === "sold" && (
                  <div className="absolute inset-0 z-10 bg-slate-900/5 flex items-center justify-center">
                    <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-wide shadow-sm">
                      SOLD
                    </div>
                  </div>
                )}

                <div className="relative bg-slate-100 overflow-hidden">
                  <div className="pt-[100%]" />
                  <img
                    src={`http://localhost:8000/${phone.image_path}`}
                    alt={phone.brand}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-green-50 px-3 py-1 rounded-full border border-green-100 text-[11px] font-medium text-green-700 flex items-center gap-1">
                    <ShieldCheck size={12} /> AI Verified
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 capitalize">
                        {phone.brand}
                      </h3>
                       <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      {phone.ram}GB RAM · {phone.storage}GB Storage · {phone.age} Year Old
                    </p>
                    {phone.damage && (
                      <div className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ${damageStyle(phone.damage)}`}>
                        {damageLabel(phone.damage)}
                      </div>
                    )}
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                        Price
                      </p>
                      <p className="text-xl font-semibold text-green-600">
                        ₹{phone.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    {phone.status?.toLowerCase() === "on_sale" && (
                      <>
                        {isOwner ? (
                          <button
                            onClick={() => handleMarkSold(phone._id)}
                            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={18} /> Mark as Sold
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuy(phone)}
                            disabled={buyingId === phone._id}
                            className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                              buyingId === phone._id
                                ? "bg-green-100 text-green-700 animate-pulse"
                                : "bg-green-600 hover:bg-green-700 text-white shadow-md"
                            }`}
                          >
                            {buyingId === phone._id ? "Opening..." : "Buy now"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
