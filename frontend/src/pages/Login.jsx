import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { loginUser } from "../api"

export default function Login({ fetchUser }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const res = await loginUser({ email, password })

    if (res.error) {
      setError(res.error)
    } else {
      await fetchUser()
      navigate("/predict")
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2 text-center">
        Welcome Back
      </h2>
      <p className="text-gray-400 text-center mb-8">Login to access the AI Resale engine</p>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
          Sign In
        </button>
      </form>

      <p className="mt-8 text-center text-gray-500 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
          Create one now
        </Link>
      </p>
    </div>
  )
}