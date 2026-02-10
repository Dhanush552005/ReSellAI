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
  w-full px-4 py-3 rounded-xl border border-slate-200 bg-white
  text-slate-900 placeholder-slate-400 focus:outline-none
  focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200
  text-sm sm:text-base appearance-none
`

const fileInputClasses = `
  block w-full text-sm text-slate-600
  file:mr-4 file:py-2 file:px-4 file:rounded-xl
  file:border-0 file:text-sm file:font-medium
  file:bg-green-600 file:text-white file:cursor-pointer
  hover:file:bg-green-700 transition duration-200 cursor-pointer
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
      transition={{ duration: 0.4 }}
      className="w-full p-5 sm:p-6 lg:p-7 rounded-2xl bg-white border border-slate-200 shadow-md space-y-6"
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
        Tell us about your device
      </h2>

      {/* Step 1: Image upload */}
      <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Step 1
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-900">
              Upload phone image
            </p>
          </div>
        </div>

        <label className="block">
          <span className="text-xs sm:text-sm font-medium text-slate-700 mb-2 block">
            Phone photo
          </span>
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
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl object-cover border border-slate-200 shadow-md"
            />
          </motion.div>
        )}
      </section>

      {/* Step 2: Device details */}
      <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Step 2
            </p>
            <p className="text-sm sm:text-base font-semibold text-slate-900">
              Add device details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="mrp" placeholder="MRP (₹)" type="number" />

          <select
            name="brand"
            required
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value)
              setRam("")
            }}
            className={inputBaseClasses}
          >
            <option value="">Select Brand</option>
            {Object.keys(RAM_OPTIONS).map((b) => (
              <option key={b} value={b}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </option>
            ))}
          </select>

          <select
            name="ram"
            required
            value={ram}
            disabled={!brand}
            onChange={(e) => setRam(e.target.value)}
            className={`${inputBaseClasses} ${!brand && "opacity-60"}`}
          >
            <option value="">{brand ? "Select RAM" : "Select Brand First"}</option>
            {brand &&
              RAM_OPTIONS[brand].map((r) => (
                <option key={r} value={r}>
                  {r} GB
                </option>
              ))}
          </select>

          <select name="storage" required className={inputBaseClasses}>
            <option value="">Storage</option>
            {STORAGE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s} GB
              </option>
            ))}
          </select>

          <select name="age" required className={inputBaseClasses}>
            <option value="">Age</option>
            {AGE_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a} Year
              </option>
            ))}
          </select>

          <select name="body_broken" required className={`${inputBaseClasses} sm:col-span-2`}>
            <option value="false">Body OK</option>
            <option value="true">Body Broken</option>
          </select>
        </div>
      </section>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className="w-full py-3 rounded-xl text-sm sm:text-base font-semibold bg-green-600 text-white shadow-md hover:bg-green-700 disabled:opacity-70"
      >
        {loading ? "AI is scanning your phone..." : "Get AI resale estimate"}
      </motion.button>

      {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
    </motion.form>
  )
}

function Input({ name, placeholder, type = "text" }) {
  return (
    <input name={name} required type={type} placeholder={placeholder} className={inputBaseClasses} />
  )
}