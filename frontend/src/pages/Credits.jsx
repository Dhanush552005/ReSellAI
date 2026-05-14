import { useState } from "react"
import { createCreditOrder, verifyCreditPayment } from "../api"
import { motion } from "framer-motion"
import { CheckCircle2, ShieldCheck, Zap, Sparkles, Crown, ArrowRight, Coins } from "lucide-react"

const PLANS = [
  { 
    id: "basic", 
    name: "Starter", 
    credits: 5, 
    price: 50, 
    icon: <Zap size={24} />,
    description: "Perfect for single device valuation",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  { 
    id: "pro", 
    name: "Professional", 
    credits: 10, 
    price: 90, 
    icon: <Sparkles size={24} />,
    popular: true,
    description: "The most balanced intelligence tier",
    color: "from-brand-primary/20 to-brand-premium/20"
  },
  { 
    id: "premium", 
    name: "Enterprise", 
    credits: 20, 
    price: 150, 
    icon: <Crown size={24} />,
    description: "High-volume scanning for resellers",
    color: "from-amber-500/20 to-orange-500/20"
  },
]

export default function Credits({ fetchUser }) {
  const [loading, setLoading] = useState(null)

  const handleBuy = async (plan) => {
    setLoading(plan.id)
    const formData = new FormData()
    formData.append("credits", plan.credits) 

    try {
      const order = await createCreditOrder(formData)
      if (order.error) {
        alert(typeof order.error === 'object' ? JSON.stringify(order.error) : order.error)
        setLoading(null)
        return
      }

      const options = {
        key: order.key, 
        amount: order.amount,
        currency: "INR",
        name: "ReSellAI",
        description: `Neural Credits: ${plan.credits} Units`,
        order_id: order.order_id, 
        handler: async (response) => {
          const verifyData = new FormData()
          verifyData.append("razorpay_order_id", response.razorpay_order_id)
          verifyData.append("razorpay_payment_id", response.razorpay_payment_id)
          verifyData.append("razorpay_signature", response.razorpay_signature)
          verifyData.append("credits", plan.credits) 

          const result = await verifyCreditPayment(verifyData)
          if (result.message) {
            if (fetchUser) await fetchUser() 
          } else {
            alert(result.error || "Neural link verification failed")
          }
          setLoading(null)
        },
        prefill: {
          name: "Operator",
          email: "operator@resellai.com"
        },
        theme: { color: "#10b981" },
        modal: { ondismiss: () => setLoading(null) }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert("Neural link failed to initialize")
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16 pb-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest border border-brand-primary/20"
        >
          <Coins size={14} />
          Neural Credit Marketplace
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tighter">
          Power your valuations
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          Secure AI compute units to fuel your resale business. Instant allocation, enterprise-grade precision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative group h-full`}
          >
            <div className={`h-full glass-panel p-8 flex flex-col border-white transition-all duration-500 group-hover:border-brand-primary/40 group-hover:shadow-2xl group-hover:shadow-brand-primary/5 ${plan.popular ? 'border-brand-primary shadow-xl shadow-brand-primary/5' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/20">
                  Most Optimized
                </div>
              )}

              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-slate-900 shadow-inner`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-slate-900 tracking-tighter">₹{plan.price}</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">/ flat</span>
                  </div>
                  <div className="flex items-center gap-2 text-brand-primary font-bold text-sm">
                    <CheckCircle2 size={16} />
                    <span>{plan.credits} Scanning Units</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {[
                    "Instant AI Activation",
                    "Advanced Market Deep-Dive",
                    "Full Inventory Management",
                    "Priority Backend Compute"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                      <ShieldCheck size={16} className="text-slate-300" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleBuy(plan)}
                disabled={loading !== null}
                className={`mt-10 w-full py-4 rounded-2xl text-base font-bold transition-all flex items-center justify-center gap-2 ${
                  loading === plan.id
                    ? "bg-slate-100 text-slate-400"
                    : plan.popular 
                      ? "bg-slate-900 text-white hover:bg-black shadow-xl shadow-slate-900/10" 
                      : "glass-button-secondary"
                }`}
              >
                {loading === plan.id ? "Initializing..." : "Authorize Purchase"}
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel p-8 bg-slate-900/5 border-white text-center">
        <p className="text-sm text-slate-500 font-medium">
          Need a custom allocation? <span className="text-brand-primary font-bold cursor-pointer hover:underline">Contact our protocol team</span> for institutional access.
        </p>
      </div>
    </div>
  )
}