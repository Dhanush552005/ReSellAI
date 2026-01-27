import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { sellFromPrediction } from "../api"

const DAMAGE_STYLES = {
  no_broken: {
    text: "text-emerald-400",
    border: "border-emerald-600/50",
    glow: "shadow-[0_0_40px_rgba(52,211,153,0.7)]",
    bg: "bg-emerald-500/10",
  },
  light_broken: {
    text: "text-amber-400",
    border: "border-amber-600/50",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.7)]",
    bg: "bg-amber-500/10",
  },
  moderately_broken: {
    text: "text-orange-400",
    border: "border-orange-600/50",
    glow: "shadow-[0_0_40px_rgba(251,146,60,0.7)]",
    bg: "bg-orange-500/10",
  },
  severe_broken: {
    text: "text-red-400",
    border: "border-red-600/50",
    glow: "shadow-[0_0_40px_rgba(239,68,68,0.7)]",
    bg: "bg-red-500/10",
  },
}

export default function ResultCard({ prediction, setPrediction }) {
  const [displayPrice, setDisplayPrice] = useState(0)
  const [selling, setSelling] = useState(false)
  const [sold, setSold] = useState(false)

  const status = prediction?.status
  const resalePrice = Math.round(Number(prediction?.resale_price)) || 0

  
  useEffect(() => {
    if (!prediction || status !== "accepted") return

    let current = 0
    const step = Math.max(1, Math.ceil(resalePrice / 30))

    const timer = setInterval(() => {
      current += step
      if (current >= resalePrice) {
        current = resalePrice
        clearInterval(timer)
      }
      setDisplayPrice(current)
    }, 40)

    return () => clearInterval(timer)
  }, [prediction, resalePrice, status])

  if (!prediction) return null

  // Rejection View
  if (status === "rejected") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-10 w-full max-w-md p-6 rounded-2xl bg-red-600/15 border border-red-500/50 text-red-300 text-center font-semibold backdrop-blur-lg shadow-xl shadow-red-900/50 mx-auto"
      >
        <span className="text-xl block mb-2">🚫 Detection Rejected</span>
        <p>{prediction.message}</p>
        <button 
          onClick={() => setPrediction(null)}
          className="mt-4 text-sm text-red-200 underline hover:text-white transition"
        >
          Try again with a clearer photo
        </button>
      </motion.div>
    )
  }

  const damageStyle = DAMAGE_STYLES[prediction.damage] || DAMAGE_STYLES.light_broken

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayPrice)

  async function handleSell() {
    if (selling || sold) return
    setSelling(true)

    try {
      const form = new FormData()
      form.append("image_path", prediction.image_path)
      form.append("brand", prediction.brand)
      form.append("ram", prediction.ram)
      form.append("storage", prediction.storage)
      form.append("age", prediction.age)
      form.append("damage", prediction.damage)
      form.append("price", prediction.resale_price)

      const res = await sellFromPrediction(form)
      if (res?.message) setSold(true)
    } finally {
      setSelling(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`mt-10 w-full max-w-lg p-6 sm:p-8 rounded-3xl ${damageStyle.bg} backdrop-blur-md border ${damageStyle.border} ${damageStyle.glow} space-y-6 mx-auto transition-all duration-500`}
    >
      <h3 className="text-xl font-bold text-white text-center">AI Resale Estimate</h3>
      
      <div className="text-center py-6 rounded-2xl bg-black/20 border border-white/10">
        <p className="text-indigo-300 text-sm font-medium mb-1 uppercase tracking-wider">Predicted Value</p>
        <p className={`text-5xl sm:text-6xl font-extrabold ${damageStyle.text}`}>{formattedPrice}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className={`rounded-xl bg-black/20 p-3 border ${damageStyle.border}`}>
          <p className="text-indigo-300/70 text-xs uppercase tracking-widest">Condition</p>
          <p className={`text-base font-extrabold mt-1 ${damageStyle.text}`}>
            {prediction.damage?.replace(/_/g, " ").toUpperCase()}
          </p>
        </div>

        <ScoreCard 
          title="ML Score" 
          value={`${((Number(prediction?.ml_score) || 0) * 100).toFixed(1)}%`} 
          color="text-indigo-400" 
        />
        <ScoreCard 
          title="CNN Score" 
          value={`${((Number(prediction?.cnn_score) || 0) * 100).toFixed(1)}%`} 
          color="text-fuchsia-400" 
        />
      </div>

      {sold ? (
        <div className="text-center py-4 bg-emerald-500/20 border border-emerald-500/50 rounded-xl">
           <p className="text-emerald-400 font-bold">Successfully Listed for Sale!</p>
           <p className="text-xs text-emerald-300/70 mt-1">Check the Marketplace to see your listing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSell}
            disabled={selling}
            className="py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition disabled:opacity-70 shadow-lg shadow-emerald-900/40"
          >
            {selling ? "Listing..." : "Sell Device"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPrediction(null)}
            className="py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition border border-white/10"
          >
            Scan New
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

function ScoreCard({ title, value, color }) {
  return (
    <div className="rounded-xl bg-black/20 p-3 border border-white/10">
      <p className="text-indigo-300/70 text-xs uppercase tracking-widest">{title}</p>
      <p className={`text-base font-extrabold mt-1 ${color}`}>{value}</p>
    </div>
  )
}