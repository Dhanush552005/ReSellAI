import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { sellFromPrediction } from "../api"

const DAMAGE_STYLES = {
  no_broken: {
    text: "text-green-700",
    border: "border-green-100",
    bg: "bg-green-50",
  },
  light_broken: {
    text: "text-amber-700",
    border: "border-amber-100",
    bg: "bg-amber-50",
  },
  moderately_broken: {
    text: "text-orange-700",
    border: "border-orange-100",
    bg: "bg-orange-50",
  },
  severe_broken: {
    text: "text-red-700",
    border: "border-red-100",
    bg: "bg-red-50",
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

  if (status === "rejected") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-6 w-full max-w-md p-6 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-center font-semibold shadow-md mx-auto"
      >
        <span className="text-lg block mb-2">Detection Rejected</span>
        <p className="text-sm font-normal">{prediction.message}</p>
        <button 
          onClick={() => setPrediction(null)}
          className="mt-4 text-xs text-red-700 underline hover:text-red-800 transition"
        >
          Try again with a clearer photo
        </button>
      </motion.div>
    )
  }

  const damageStyle = DAMAGE_STYLES[prediction.damage] || DAMAGE_STYLES.light_broken
  const confidencePct = Math.max(
    0,
    Math.min(100, ((Number(prediction?.cnn_score) || 0) * 100))
  )
  const mlPct = Math.max(0, Math.min(100, ((Number(prediction?.ml_score) || 0) * 100)))

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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mt-6 w-full max-w-lg p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-md space-y-6 mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Step 3
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
            AI resale estimate
          </h3>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${damageStyle.bg} ${damageStyle.border} ${damageStyle.text}`}>
          <span className="font-semibold">
            {prediction.damage?.replace(/_/g, " ").toUpperCase()}
          </span>
        </div>
      </div>
      
      <div className="text-center py-6 rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-xs sm:text-sm font-medium mb-1 uppercase tracking-wide text-slate-500">
          Predicted resale price
        </p>
        <p className="text-4xl sm:text-5xl font-bold text-green-600 tracking-tight">
          {formattedPrice}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-900">Confidence</p>
          <p className="text-sm font-semibold text-slate-900">
            {confidencePct.toFixed(1)}%
          </p>
        </div>
        <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidencePct}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-green-600"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          ML score: <span className="font-medium text-slate-700">{mlPct.toFixed(1)}%</span>
        </p>
      </div>

      {sold ? (
        <div className="text-center py-4 bg-green-50 border border-green-100 rounded-xl">
           <p className="text-green-700 font-semibold">Successfully listed for sale</p>
           <p className="text-xs text-green-600 mt-1">Check the Marketplace to see your listing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSell}
            disabled={selling}
            className="py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-70 shadow-md"
          >
            {selling ? "Listing..." : "List in Marketplace"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPrediction(null)}
            className="py-3 rounded-xl bg-white text-slate-700 font-semibold hover:bg-slate-50 transition border border-slate-200"
          >
            Scan another device
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

function ScoreCard({ title, value, color }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
      <p className="text-[11px] text-slate-500 uppercase tracking-widest">{title}</p>
      <p className={`text-sm font-semibold mt-1 ${color}`}>{value}</p>
    </div>
  )
}