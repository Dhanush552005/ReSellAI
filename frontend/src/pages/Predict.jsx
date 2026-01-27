import { useState } from "react"
import UploadForm from "../components/UploadForm"
import ResultCard from "../components/ResultCard"

export default function Predict({ user, fetchUser }) {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">
         <span className="text-indigo-400">ReSellAI</span>
        </h1>
        <p className="text-gray-400">
          AI-Powered Mobile Resale Valuation System
        </p>
      </div>

      {!prediction ? (
        <UploadForm 
          setPrediction={setPrediction} 
          setLoading={setLoading} 
          loading={loading}
          fetchUser={fetchUser} 
        />
      ) : (
        <ResultCard 
          prediction={prediction} 
          setPrediction={setPrediction} 
        />
      )}
    </div>
  )
}