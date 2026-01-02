import { useState } from "react"
import { motion } from "framer-motion"
import UploadForm from "./components/UploadForm"
import ResultCard from "./components/ResultCard"

export default function App() {
  const [result, setResult] = useState(null)

  return (
    <div className="relative min-h-screen overflow-x-hidden 
                     bg-gradient-to-br from-gray-900 via-black to-gray-900
                     flex items-start justify-center pt-16 pb-24 sm:pt-24 px-4 
                     text-white">

      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-indigo-500/20 blur-[150px] animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500/20 blur-[150px] animate-pulse-slow-reverse" />

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        @keyframes pulse-slow-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -20px); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s infinite alternate ease-in-out;
        }
        .animate-pulse-slow-reverse {
          animation: pulse-slow-reverse 20s infinite alternate ease-in-out;
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg lg:max-w-2xl
                     rounded-3xl border border-white/10
                     bg-white/5 backdrop-blur-xl
                     shadow-2xl shadow-indigo-900/60
                     p-6 sm:p-10"
      >
        
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center
                         bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400
                         bg-clip-text text-transparent leading-tight">
            ReSellAI
          </h1>

          <p className="text-center text-indigo-300/80 mt-2 text-sm sm:text-base">
            AI-powered Mobile Resale valuation System
          </p>
        </header>

        <div className="flex flex-col items-center">
          
          <UploadForm onResult={setResult} />

          <ResultCard result={result} />
          
        </div>
      </motion.div>

      <footer className="absolute bottom-3 sm:bottom-6 text-xs text-indigo-300/40 tracking-wide text-center px-4">
        <p>
          Built with YOLO · CNN · XGBoost · FastAPI · React & Tailwind CSS
        </p>
      </footer>
    </div>
  )
}