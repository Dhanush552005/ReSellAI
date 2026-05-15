import { useState } from "react"
import { motion } from "framer-motion"
import UploadForm from "../components/UploadForm"
import ResultCard from "../components/ResultCard"
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"

export default function Predict({ user, fetchUser }) {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const currentStep = prediction ? 3 : 2

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider"
        >
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Value Your Device
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Our advanced spatial intelligence engine will analyze your device condition and market trends in real-time.
        </p>
      </div>

      {/* Modern Glass Step Indicator */}
      <div className="glass-panel p-2 flex items-center justify-between max-w-2xl mx-auto border-white/20">
        <div className="flex items-center gap-1 w-full">
          <StepItem label="Analysis" step={1} currentStep={currentStep} isFirst />
          <StepItem label="Details" step={2} currentStep={currentStep} />
          <StepItem label="Valuation" step={3} currentStep={currentStep} isLast />
        </div>
      </div>

      <div className="relative">
        {!prediction ? (
          <UploadForm
            setPrediction={setPrediction}
            setLoading={setLoading}
            loading={loading}
            fetchUser={fetchUser}
          />
        ) : (
          <ResultCard prediction={prediction} setPrediction={setPrediction} />
        )}
      </div>
    </div>
  )
}

function StepItem({ label, step, currentStep, isFirst, isLast }) {
  const isActive = currentStep === step
  const isCompleted = currentStep > step

  return (
    <div className={`flex-1 relative flex items-center justify-center py-3 px-4 rounded-2xl transition-all duration-500 ${isActive ? 'bg-white shadow-sm border border-slate-100' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${
          isCompleted ? 'bg-brand-success text-white' : 
          isActive ? 'bg-brand-primary text-white' : 
          'bg-slate-100 text-slate-400'
        }`}>
          {isCompleted ? <CheckCircle2 size={14} /> : step}
        </div>
        <span className={`text-sm font-semibold transition-all duration-500 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
          {label}
        </span>
      </div>
    </div>
  )
}

