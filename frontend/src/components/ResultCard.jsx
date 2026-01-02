import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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
};

export default function ResultCard({ result }) {
  const [displayPrice, setDisplayPrice] = useState(0);

  const status = result?.status;
  const resalePrice = Math.round(Number(result?.resale_price)) || 0;

  useEffect(() => {
    if (!result || status !== "accepted") return;

    let current = 0;
    const step = Math.max(1, Math.ceil(resalePrice / 30));

    const timer = setInterval(() => {
      current += step;
      if (current >= resalePrice) {
        current = resalePrice;
        clearInterval(timer);
      }
      setDisplayPrice(current);
    }, 50);

    return () => clearInterval(timer);
  }, [result, resalePrice, status]);

  if (!result) return null;

  if (status === "rejected") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-10 w-full max-w-md p-6 rounded-2xl
                     bg-red-600/15 border border-red-500/50
                     text-red-300 text-center font-semibold backdrop-blur-lg
                     shadow-xl shadow-red-900/50"
      >
        <span className="text-xl block mb-2">🚫 Prediction Rejected</span>
        <p>{result.message}</p>
      </motion.div>
    );
  }

  const damageStyle =
    DAMAGE_STYLES[result.damage] || DAMAGE_STYLES.light_broken;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayPrice);


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        mt-10 w-full max-w-lg p-6 sm:p-8 rounded-3xl
        ${damageStyle.bg} backdrop-blur-md
        border ${damageStyle.border}
        ${damageStyle.glow}
        space-y-6
        transform transition-all duration-500
      `}
    >
      <h3 className="text-xl font-bold text-white text-center">
        Your AI Resale Price Estimate
      </h3>
      <div className="h-0.5 w-16 bg-indigo-500/70 mx-auto" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center py-4 sm:py-6 rounded-2xl bg-black/20 border border-white/10"
      >
        <p className="text-indigo-300 text-base sm:text-lg font-medium mb-2 uppercase tracking-wider">
          Predicted Value
        </p>
        <p className={`text-5xl sm:text-6xl font-extrabold ${damageStyle.text}`}>
          {formattedPrice}
        </p>
        <p className="text-sm text-indigo-300/80 mt-2">
          (Estimate based on current market and condition)
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        
        <div className={`rounded-xl bg-black/20 p-3 sm:p-4 border ${damageStyle.border} sm:col-span-1`}>
            <p className="text-indigo-300/70 text-xs sm:text-sm uppercase tracking-widest">
              Damage Level
            </p>
            <p className={`text-base sm:text-xl font-extrabold mt-1 ${damageStyle.text}`}>
              {result.damage.replace(/_/g, " ").toUpperCase()}
            </p>
        </div>

        <ScoreCard 
            title="ML Model Score" 
            value={`${(result.ml_score * 100).toFixed(1)}%`} 
            color="text-indigo-400"
        />

        <ScoreCard 
            title="Image Confidence" 
            value={`${(result.cnn_confidence * 100).toFixed(1)}%`} 
            color="text-fuchsia-400"
        />

      </div>

      <p className="pt-2 text-xs text-center text-indigo-300/50 font-mono">
        System Confidence: YOLO · CNN · XGBoost
      </p>
    </motion.div>
  );
}

function ScoreCard({ title, value, color }) {
    return (
        <div className="rounded-xl bg-black/20 p-3 sm:p-4 border border-white/10">
            <p className="text-indigo-300/70 text-xs sm:text-sm uppercase tracking-widest">
                {title}
            </p>
            <p className={`text-base sm:text-xl font-extrabold mt-1 ${color}`}>
                {value}
            </p>
        </div>
    );
}