import { useState } from "react"
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

  function badgeColor(decision) {
    if (decision === "approve") return "bg-green-500/20 text-green-400"
    if (decision === "deny") return "bg-red-500/20 text-red-400"
    if (decision === "partial") return "bg-yellow-500/20 text-yellow-400"
    return "bg-orange-500/20 text-orange-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          AI Support Assistant
        </h1>

        <p className="text-zinc-400 mb-8">
          Smart marketplace issue resolution powered by RAG AI.
        </p>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
          <textarea
            rows="6"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            placeholder="Describe your issue..."
            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-400 resize-none"
          />

          <button
            onClick={handleSubmit}
            className="mt-5 px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition font-semibold"
          >
            {loading ? "Resolving..." : "Resolve Ticket"}
          </button>
        </div>

        {result && (
          <div className="mt-8 space-y-5">

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-bold">
                    {result.classification}
                  </h2>
                  <p className="text-zinc-400 mt-1">
                    Issue Type: {result.issue_type}
                  </p>
                </div>

                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${badgeColor(result.decision)}`}>
                  {result.decision}
                </span>
              </div>
            </div>

            <Section title="Clarifying Questions" value={result.clarifying_questions} />
            <Section title="Rationale" value={result.rationale} />
            <Section title="Citations" value={result.citations} />
            <Section title="Customer Response" value={result.customer_response} />
            <Section title="Next Steps" value={result.next_steps} />

          </div>
        )}

      </div>
    </div>
  )
}

function Section({ title, value }) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-zinc-300 whitespace-pre-line leading-7">
        {value}
      </p>
    </div>
  )
}