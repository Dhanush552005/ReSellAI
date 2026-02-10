import { useState } from "react"
import UploadForm from "../components/UploadForm"
import ResultCard from "../components/ResultCard"

export default function Predict({ user, fetchUser }) {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const currentStep = prediction ? 3 : 2

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          Sell Your Phone with AI Pricing
        </h1>
        <p className="text-sm text-slate-500">
          Upload your device, add a few details, and let ReSellAI estimate a fair resale price instantly.
        </p>
      </div>

      {/* Step indicator */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6">
            <StepPill label="Upload" step={1} currentStep={currentStep} />
            <StepConnector />
            <StepPill label="Details" step={2} currentStep={currentStep} />
            <StepConnector />
            <StepPill label="Result" step={3} currentStep={currentStep} />
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500">
            {prediction ? "Step 3 · AI result ready" : "Step 1–2 · Upload image & add device details"}
          </p>
        </div>
      </div>

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
  )
}

function StepPill({ label, step, currentStep }) {
  const isCompleted = currentStep > step
  const isActive = currentStep === step || (currentStep > step && step !== 3)

  const baseClasses =
    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"

  const activeClasses = "border-green-200 bg-green-50 text-green-700"
  const completedClasses = "border-green-200 bg-green-100 text-green-700"
  const inactiveClasses = "border-slate-200 bg-white text-slate-500"

  const classes =
    currentStep >= step
      ? isCompleted
        ? `${baseClasses} ${completedClasses}`
        : `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`

  return (
    <div className={classes}>
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white border border-green-200 text-[11px]">
        {step}
      </span>
      <span>{label}</span>
    </div>
  )
}

function StepConnector() {
  return <div className="hidden sm:block h-px w-6 bg-slate-200" />
}
