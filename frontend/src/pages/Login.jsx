import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ fetchUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await loginUser({ email, password });

    if (res.error) {
      setError(res.error);
    } else {
      await fetchUser();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <div className="text-center space-y-4 px-8">
          <h1 className="text-4xl font-bold">ReSellAI</h1>
          <p className="text-lg font-medium">
            AI-powered resale platform for your devices.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md px-6">
          <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-xl border border-slate-200 p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center text-white text-lg font-semibold mb-2">
                AI
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to access your ReSellAI dashboard.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg mb-4 text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow-md transition-all"
              >
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-green-700 hover:text-green-800 font-medium"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}