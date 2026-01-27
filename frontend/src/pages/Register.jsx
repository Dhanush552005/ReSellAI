import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../api"

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const res = await registerUser({ username, email, password })

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => navigate("/login"), 2000)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2 text-center">
        Create Account
      </h2>
      <p className="text-gray-400 text-center mb-8">Join ReSellAI to start scanning</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-xl mb-6 text-sm text-center">
          Registration successful! Redirecting to login...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
            placeholder="Dhanush S"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-600"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]"
        >
          Create Account
        </button>
      </form>

      <p className="mt-8 text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  )
}