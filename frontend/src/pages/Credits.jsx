import { useState } from "react"
import { createCreditOrder, verifyCreditPayment } from "../api"
import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"


const PLANS = [
  { id: "basic", name: "Starter", credits: 5, price: 50, color: "from-blue-500 to-cyan-500" },
  { id: "pro", name: "Professional", credits: 10, price: 90, color: "from-indigo-500 to-purple-500", popular: true },
  { id: "premium", name: "Enterprise", credits: 20, price: 150, color: "from-orange-500 to-red-500" },
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
        description: `Adding ${plan.credits} credits to your account`,
        order_id: order.order_id, 
        handler: async (response) => {
          const verifyData = new FormData()
          verifyData.append("razorpay_order_id", response.razorpay_order_id)
          verifyData.append("razorpay_payment_id", response.razorpay_payment_id)
          verifyData.append("razorpay_signature", response.razorpay_signature)
          verifyData.append("credits", plan.credits) 

          const result = await verifyCreditPayment(verifyData)
          
          if (result.message) {
            alert("Payment Successful! Credits added.")
            if (fetchUser) await fetchUser() 
          } else {
            alert(result.error || "Payment verification failed")
          }
          setLoading(null)
        },
        prefill: {
          name: "Test User",
          email: "test@example.com"
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: () => setLoading(null) 
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
      
    } catch (err) {
      console.error(err)
      alert("Could not initialize payment")
      setLoading(null)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
          Top up your credits
        </h1>
        <p className="text-sm text-slate-500">
          Simple, transparent pricing to keep using AI-powered valuations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -4, scale: 1.01 }}
            className={`relative p-6 sm:p-7 rounded-2xl bg-white border shadow-md ${
              plan.popular ? "border-2 border-green-600" : "border-slate-200"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-[0.18em]">
                Most Popular
              </span>
            )}
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-3xl sm:text-4xl font-semibold text-slate-900">
                ₹{plan.price}
              </span>
              <span className="text-xs text-slate-500">/ one-time</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              {plan.credits} AI scan credits to evaluate your devices.
            </p>

            <ul className="space-y-2 mb-6 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <span>{plan.credits} AI scan credits</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <span>Instant AI valuation access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                <span>Secure Razorpay payments</span>
              </li>
            </ul>

            <button
              onClick={() => handleBuy(plan)}
              disabled={loading !== null}
              className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                loading === plan.id
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-md"
              }`}
            >
              {loading === plan.id ? "Opening Checkout..." : "Buy Credits"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}