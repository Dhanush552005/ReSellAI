import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  Send, 
  CheckCircle, 
  FileText, 
  AlertCircle, 
  Quote, 
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from "lucide-react"
import { resolveSupport } from "../api"

export default function Support() {
  const [ticket, setTicket] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleSubmit() {
    if (!ticket.trim()) return

    setLoading(true)
    setResult(null)

    const data = await resolveSupport(ticket)

    setResult(data)
    setLoading(false)
  }

  function badgeStyles(decision) {
    if (decision?.toLowerCase() === "approve") return "bg-emerald-100 text-emerald-700 border-emerald-200"
    if (decision?.toLowerCase() === "deny") return "bg-rose-100 text-rose-700 border-rose-200"
    if (decision?.toLowerCase() === "partial") return "bg-amber-100 text-amber-700 border-amber-200"
    return "bg-slate-100 text-slate-700 border-slate-200"
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-vision-gradient text-slate-800 px-6 py-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-premium/10 rounded-full blur-[100px] animate-pulse-slow-reverse" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-semibold mb-6">
            <Zap size={14} />
            <span>AI-Powered Resolution</span>
          </div>
          
          <h1 className="text-6xl font-extrabold tracking-tight mb-4 text-slate-900">
            Support <span className="text-brand-primary">Assistant</span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Experience the future of marketplace support. Our RAG-enhanced AI analyzes your issues with precision and provides instant, documented resolutions.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="glass-panel p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-xl font-bold">Describe your issue</h2>
          </div>

          <textarea
            rows="5"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            placeholder="Type your marketplace concern here... (e.g., 'I received a damaged item and the seller is not responding')"
            className="glass-input resize-none mb-6"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !ticket.trim()}
            className={`glass-button-primary w-full md:w-auto min-w-[200px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Ticket...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Resolve Ticket</span>
              </>
            )}
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              {/* Main Classification Card */}
              <motion.div variants={containerVariants} className="glass-card p-8 border-l-4 border-l-brand-primary">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-brand-primary mb-2">
                      <ShieldCheck size={18} />
                      <span className="text-xs font-bold uppercase tracking-wider">Official Classification</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                      {result.classification}
                    </h2>
                    <div className="flex items-center gap-2 text-slate-500">
                      <HelpCircle size={16} />
                      <span>Issue Type: <span className="font-medium text-slate-700">{result.issue_type}</span></span>
                    </div>
                  </div>

                  <div className={`px-5 py-2 rounded-xl border font-bold text-sm uppercase tracking-wide shadow-sm ${badgeStyles(result.decision)}`}>
                    {result.decision}
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                <ResultCard 
                  icon={<HelpCircle className="text-brand-secondary" />}
                  title="Clarifying Questions" 
                  value={result.clarifying_questions} 
                  variants={containerVariants}
                />
                <ResultCard 
                  icon={<AlertCircle className="text-brand-premium" />}
                  title="Decision Rationale" 
                  value={result.rationale} 
                  variants={containerVariants}
                />
              </div>

              <ResultCard 
                icon={<Quote className="text-brand-primary" />}
                title="Recommended Response" 
                value={result.customer_response} 
                isFull
                variants={containerVariants}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <ResultCard 
                  icon={<FileText className="text-slate-400" />}
                  title="Knowledge Base Citations" 
                  value={result.citations} 
                  variants={containerVariants}
                />
                <ResultCard 
                  icon={<ArrowRight className="text-brand-success" />}
                  title="Recommended Next Steps" 
                  value={result.next_steps} 
                  variants={containerVariants}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

function ResultCard({ icon, title, value, isFull = false, variants }) {
  if (!value) return null

  return (
    <motion.div variants={variants} className={`glass-card p-6 ${isFull ? 'col-span-full' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-white/50 border border-white/80 shadow-sm">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      <div className="text-slate-600 whitespace-pre-line leading-relaxed text-sm md:text-base">
        {value}
      </div>
    </motion.div>
  )
}