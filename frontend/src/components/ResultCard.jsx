import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { sellFromPrediction } from "../api"
import { TrendingUp, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, Smartphone, BarChart3 } from "lucide-react"

const DAMAGE_STYLES = {
  no_broken: {
    label: "Excellent",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  light_broken: {
    label: "Minor Wear",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  moderately_broken: {
    label: "Moderate Damage",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  severe_broken: {
    label: "Severe Damage",
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
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
    const step = Math.max(1, Math.ceil(resalePrice / 50))
    const timer = setInterval(() => {
      current += step
      if (current >= resalePrice) {
        current = resalePrice
        clearInterval(timer)
      }
      setDisplayPrice(current)
    }, 30)

    return () => clearInterval(timer)
  }, [prediction, resalePrice, status])

  if (!prediction) return null

  if (status === "rejected") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-10 max-w-md mx-auto text-center space-y-6 border-red-500/20"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-800">Scan Rejected</h3>
          <p className="text-slate-500">{prediction.message}</p>
        </div>
        <button 
          onClick={() => setPrediction(null)}
          className="glass-button-secondary w-full"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </motion.div>
    )
  }

  const damageStyle = DAMAGE_STYLES[prediction.damage] || DAMAGE_STYLES.light_broken
  const confidencePct = Math.max(0, Math.min(100, ((Number(prediction?.cnn_score) || 0) * 100)))
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8"
    >
      {/* Left Column: Price Summary */}
      <div className="lg:col-span-3 space-y-8">
        <div className="glass-panel p-8 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col items-center text-center py-10 space-y-6">
            <div className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${damageStyle.bg} ${damageStyle.color} ${damageStyle.border} border`}>
              {damageStyle.label} Condition Detected
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Calculated Resale Value</p>
              <h3 className="text-6xl sm:text-7xl font-bold text-slate-900 tracking-tighter">
                {formattedPrice}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-brand-success font-bold text-sm bg-brand-success/10 px-4 py-2 rounded-full">
              <TrendingUp size={16} />
              AI Recommended Price
            </div>
          </div>
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-transparent opacity-50 pointer-events-none" />
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence mode="wait">
            {sold ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full glass-panel p-6 bg-brand-success/10 border-brand-success/20 flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-brand-success text-white flex items-center justify-center shadow-lg shadow-brand-success/20">
                  <CheckCircle2 size={24} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800">Successfully Listed</p>
                  <p className="text-sm text-slate-500">Your device is now live in the global marketplace.</p>
                </div>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={handleSell}
                  disabled={selling}
                  className="glass-button-primary py-5 text-lg"
                >
                  {selling ? <RefreshCw size={20} className="animate-spin" /> : <Smartphone size={20} />}
                  {selling ? "Listing Device..." : "List in Marketplace"}
                </button>
                <button
                  onClick={() => setPrediction(null)}
                  className="glass-button-secondary py-5 text-lg"
                >
                  <RefreshCw size={20} />
                  Scan New Device
                </button>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: AI Analytics */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/40">
            <BarChart3 className="text-brand-primary" />
            <h4 className="font-bold text-slate-800">Neural Insights</h4>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Image Confidence</p>
                  <p className="text-xl font-bold text-slate-800">{confidencePct.toFixed(1)}%</p>
                </div>
                <ShieldCheck className="text-brand-primary" size={24} />
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePct}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-brand-primary rounded-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Alignment</p>
                  <p className="text-xl font-bold text-slate-800">{mlPct.toFixed(1)}%</p>
                </div>
                <TrendingUp className="text-brand-premium" size={24} />
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${mlPct}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-brand-premium rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/40 border border-white/40 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Device Metadata</p>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-slate-500">Brand</span>
              <span className="text-right font-semibold text-slate-800 capitalize">{prediction.brand}</span>
              <span className="text-slate-500">Memory</span>
              <span className="text-right font-semibold text-slate-800">{prediction.ram}GB</span>
              <span className="text-slate-500">Storage</span>
              <span className="text-right font-semibold text-slate-800">{prediction.storage}GB</span>
              <span className="text-slate-500">Age</span>
              <span className="text-right font-semibold text-slate-800">{prediction.age}y</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 bg-brand-primary/5 border-brand-primary/10">
          <p className="text-xs text-slate-500 leading-relaxed italic">
            "The AI resale estimate is generated using a combination of deep learning image classification and historical market volatility data."
          </p>
        </div>
      </div>
    </motion.div>
  )
}