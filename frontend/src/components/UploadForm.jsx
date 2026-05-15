import { useState } from "react"
import { predictResale } from "../api"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload,
  Smartphone,
  Database,
  MemoryStick,
  Calendar,
  AlertCircle,
  Scan,
  Cpu,
  ArrowRight
} from "lucide-react"
const RAM_OPTIONS = {
  apple: [4, 6, 8, 12],
  samsung: [4, 6, 8, 12, 16, 24],
  redmi: [4, 6, 8, 12],
  oneplus: [8, 12, 16, 24],
  xiaomi: [4, 6, 8, 12, 16],
}

const STORAGE_OPTIONS = [64, 128, 256, 512, 1024, 2048]
const AGE_OPTIONS = [0, 1, 2, 3, 4, 5]

export default function UploadForm({ setPrediction, setLoading, loading, fetchUser }) {
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [brand, setBrand] = useState("")
  const [ram, setRam] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.target)
      const result = await predictResale(formData)
      
      if (result.error) {
        setError(result.error)
      } else {
        // Add a slight delay for cinematic effect
        setTimeout(async () => {
          setPrediction(result)
          await fetchUser() 
          setLoading(false)
        }, 1500)
        return
      }
    } catch {
      setError("Something went wrong. Try again.")
    }
    setLoading(false)
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-8 sm:p-10 space-y-10 relative overflow-hidden"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Cpu className="text-brand-primary" />
          Device Configuration
        </h2>
        <p className="text-sm text-slate-500">Provide device specifics for high-fidelity ML analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Upload Section */}
        <div className="space-y-6">
          <label className="block space-y-4">
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Upload size={16} className="text-brand-primary" />
              1. Physical Scan
            </span>
            <div className={`relative group cursor-pointer h-64 rounded-[2rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden ${preview ? 'border-brand-primary/50 bg-white/20' : 'border-slate-200 bg-slate-50/50 hover:bg-white/40 hover:border-brand-primary/30'}`}>
              {preview ? (
                <>
                  <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-bold">Replace Image</p>
                  </div>
                  {loading && (
                    <motion.div 
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1 bg-brand-primary shadow-[0_0_15px_rgba(91,140,255,0.8)] z-20"
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-500">
                    <Scan size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800">Upload Device Photo</p>
                    <p className="text-xs text-slate-500 mt-1">Front-facing, clear lighting</p>
                  </div>
                </>
              )}
              <input
                type="file"
                name="file"
                required
                accept="image/*"
                onChange={(e) => setPreview(URL.createObjectURL(e.target.files[0]))}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
            </div>
          </label>
        </div>

        {/* Specifications Section */}
        <div className="space-y-6">
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Database size={16} className="text-brand-primary" />
            2. Core Specifications
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">Original Price (MRP)</label>
              <input name="mrp" required type="number" placeholder="₹ Amount" className="glass-input" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">Brand</label>
              <select
                name="brand"
                required
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value)
                  setRam("")
                }}
                className="glass-input"
              >
                <option value="">Select Brand</option>
                {Object.keys(RAM_OPTIONS).map((b) => (
                  <option key={b} value={b}>
                    {b.charAt(0).toUpperCase() + b.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">Memory (RAM)</label>
              <select
                name="ram"
                required
                value={ram}
                disabled={!brand}
                onChange={(e) => setRam(e.target.value)}
                className={`glass-input ${!brand && "opacity-50 cursor-not-allowed"}`}
              >
                <option value="">{brand ? "Select RAM" : "Select Brand First"}</option>
                {brand &&
                  RAM_OPTIONS[brand].map((r) => (
                    <option key={r} value={r}>
                      {r} GB
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">Storage</label>
              <select name="storage" required className="glass-input">
                <option value="">Select Storage</option>
                {STORAGE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s} GB
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">Device Age</label>
              <select name="age" required className="glass-input">
                <option value="">Select Age</option>
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a} {a === 1 ? 'Year' : 'Years'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 ml-1">Cosmetic Condition</label>
              <select name="body_broken" required className="glass-input">
                <option value="false">Excellent / Good</option>
                <option value="true">Visible Damage / Broken</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/40">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full py-5 rounded-[2rem] text-lg font-bold bg-brand-primary text-white shadow-xl shadow-brand-primary/20 hover:bg-brand-primary/90 disabled:opacity-70 flex items-center justify-center gap-3 transition-all duration-300"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Scan size={24} />
              </motion.div>
              Neural Analysis in Progress...
            </>
          ) : (
            <>
              Generate Resale Valuation
              <ArrowRight size={22} />
            </>
          )}
        </motion.button>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 text-red-500 text-sm mt-4 justify-center"
            >
              <AlertCircle size={16} />
              <p className="font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Blob */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-brand-primary/5 blur-3xl rounded-full pointer-events-none" />
    </motion.form>
  )
}
