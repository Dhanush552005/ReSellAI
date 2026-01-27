import { useState } from "react"
import { predictResale } from "../api"
import { motion } from "framer-motion"

const RAM_OPTIONS = {
  apple: [4, 6, 8, 12],
  samsung: [4, 6, 8, 12, 16, 24],
  redmi: [4, 6, 8, 12],
  oneplus: [8, 12, 16, 24],
  xiaomi: [4, 6, 8, 12, 16],
}

const STORAGE_OPTIONS = [64, 128, 256, 512, 1024, 2048]
const AGE_OPTIONS = [0, 1, 2, 3, 4, 5]

const inputBaseClasses = `
  w-full px-4 py-3 rounded-xl border border-indigo-400/20 bg-white/5
  text-white placeholder-indigo-300/70 focus:outline-none
  focus:ring-2 focus:ring-indigo-500 transition duration-300
  text-sm sm:text-base appearance-none
`

const fileInputClasses = `
  block w-full text-sm text-gray-500
  file:mr-4 file:py-2 file:px-4 file:rounded-xl
  file:border-0 file:text-sm file:font-semibold
  file:bg-indigo-600/90 file:text-white file:cursor-pointer
  hover:file:bg-indigo-500 transition duration-300 cursor-pointer
`

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
        setPrediction(result)
        await fetchUser() 
      }
    } catch {
      setError("Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-indigo-500/30 shadow-2xl shadow-indigo-900/40 space-y-6 max-w-lg mx-auto"
    >
      <h2 className="text-3xl font-extrabold text-white text-center mb-6">
        Mobile Device Scanner
      </h2>

      <div className="space-y-4">
        <label className="block">
          <span className="text-indigo-300 text-sm font-medium mb-2 block">Upload Phone Image</span>
          <input
            type="file"
            name="file"
            required
            accept="image/*"
            onChange={(e) => setPreview(URL.createObjectURL(e.target.files[0]))}
            className={fileInputClasses}
          />
        </label>

        {preview && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex justify-center">
            <img src={preview} alt="Preview" className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl object-cover border-4 border-indigo-600 shadow-xl shadow-indigo-900/60" />
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input name="mrp" placeholder="MRP (₹)" type="number" />

        <select
          name="brand"
          required
          value={brand}
          onChange={(e) => { setBrand(e.target.value); setRam(""); }}
          className={inputBaseClasses + " text-indigo-200"}
        >
          <option value="" className="bg-gray-800">Select Brand</option>
          {Object.keys(RAM_OPTIONS).map(b => (
            <option key={b} value={b} className="bg-gray-800">{b.charAt(0).toUpperCase() + b.slice(1)}</option>
          ))}
        </select>

        <select
          name="ram"
          required
          value={ram}
          disabled={!brand}
          onChange={(e) => setRam(e.target.value)}
          className={`${inputBaseClasses} text-indigo-200 ${!brand && "opacity-60"}`}
        >
          <option value="">{brand ? "Select RAM" : "Select Brand First"}</option>
          {brand && RAM_OPTIONS[brand].map((r) => (
            <option key={r} value={r} className="bg-gray-800">{r} GB</option>
          ))}
        </select>

        <select name="storage" required className={inputBaseClasses + " text-indigo-200"}>
          <option value="">Storage</option>
          {STORAGE_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-gray-800">{s} GB</option>
          ))}
        </select>

        <select name="age" required className={inputBaseClasses + " text-indigo-200"}>
          <option value="">Age</option>
          {AGE_OPTIONS.map((a) => (
            <option key={a} value={a} className="bg-gray-800">{a} Year</option>
          ))}
        </select>

        <select name="body_broken" required className={inputBaseClasses + " sm:col-span-2 text-indigo-200"}>
          <option value="false" className="bg-gray-800">Body OK</option>
          <option value="true" className="bg-gray-800">Body Broken</option>
        </select>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className="w-full py-3 rounded-xl text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-900/50 disabled:opacity-70"
      >
        {loading ? "AI is Scanning..." : "Check Resale Price"}
      </motion.button>

      {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
    </motion.form>
  )
}

function Input({ name, placeholder, type = "text" }) {
  return (
    <input name={name} required type={type} placeholder={placeholder} className={inputBaseClasses} />
  )
}