import { useState } from "react"
import { createCreditOrder, verifyCreditPayment } from "../api"
import { motion } from "framer-motion"
import { Zap, ShieldCheck, CreditCard } from "lucide-react"


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
        theme: { color: "#6366f1" },
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Top Up Your <span className="text-indigo-400">Credits</span>
        </h1>
        <p className="text-gray-400">Choose a plan to continue using the AI Device Scanner</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -10 }}
            className={`relative p-8 rounded-3xl bg-white/5 border ${
              plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'border-white/10'
            } backdrop-blur-xl`}
          >
            {plan.popular && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </span>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <div className={`text-5xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent mb-6`}>
              ₹{plan.price}
            </div>
            
            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex items-center gap-3"><Zap size={18} className="text-indigo-400"/> {plan.credits} AI Scan Credits</li>
              <li className="flex items-center gap-3"><ShieldCheck size={18} className="text-indigo-400"/> Instant Verification</li>
              <li className="flex items-center gap-3"><CreditCard size={18} className="text-indigo-400"/> Secure Payment</li>
            </ul>

            <button
              onClick={() => handleBuy(plan)}
              disabled={loading !== null}
              className={`w-full py-4 rounded-xl font-bold transition-all active:scale-95 ${
                loading === plan.id ? 'bg-gray-700' : `bg-gradient-to-r ${plan.color} text-white shadow-lg`
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