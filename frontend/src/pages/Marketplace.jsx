import { useEffect, useState } from "react"
import { getMarketplace, createPhoneOrder, verifyPhonePayment, markSold } from "../api"
import { motion } from "framer-motion"
import { Smartphone, ShieldCheck, Tag, CheckCircle2 } from "lucide-react"

export default function Marketplace({ user, fetchUser }) {
  const [phones, setPhones] = useState([])
  const [loading, setLoading] = useState(true)
  const [buyingId, setBuyingId] = useState(null)
  const [view, setView] = useState("on_sale") 

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
        theme: { color: "#6366f1" },
        modal: { ondismiss: () => setBuyingId(null) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      setBuyingId(null)
    }
  }

  const filteredPhones = phones.filter(
    (p) => p.status?.toLowerCase() === view.toLowerCase()
  )

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-400 font-medium">Loading Marketplace...</p>
      </div>
    )

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white">Marketplace</h1>
          <p className="text-gray-400 mt-2">
            Verified devices at AI-calculated prices
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => setView("on_sale")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              view === "on_sale"
                ? "bg-indigo-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Tag size={18} /> On Sale
          </button>
          <button
            onClick={() => setView("sold")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              view === "sold"
                ? "bg-emerald-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <CheckCircle2 size={18} /> Sold
          </button>
        </div>
      </div>

      {filteredPhones.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <Smartphone className="mx-auto text-gray-600 mb-4" size={48} />
          <p className="text-gray-500">
            No {view.replace("_", " ")} devices found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group relative"
              >
                {phone.status?.toLowerCase() === "sold" && (
                  <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-emerald-500 text-white px-5 py-1.5 rounded-full font-black text-sm uppercase tracking-widest shadow-xl border-2 border-white">
                      SOLD
                    </div>
                  </div>
                )}

                <div className="relative h-48 bg-gray-800 overflow-hidden">
                  <img
                    src={`http://localhost:8000/${phone.image_path}`}
                    alt={phone.brand}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-indigo-300 flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white capitalize">
                        {phone.brand}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {phone.ram}GB / {phone.storage}GB · {phone.age} Year Old
                      </p>
                    </div>
                    <div className="text-right text-emerald-400 font-bold text-xl">
                      ₹{phone.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="pt-2">
                    {phone.status?.toLowerCase() === "on_sale" && (
                      <>
                        {isOwner ? (
                          <button
                            onClick={() => handleMarkSold(phone._id)}
                            className="w-full py-3 rounded-xl font-bold bg-emerald-500/10 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={18} /> Mark as Sold
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuy(phone)}
                            disabled={buyingId === phone._id}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                              buyingId === phone._id
                                ? "bg-indigo-900 text-indigo-300 animate-pulse"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
                            }`}
                          >
                            {buyingId === phone._id ? "Opening..." : "Buy Now"}
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
