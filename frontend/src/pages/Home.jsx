import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Smartphone, UploadCloud, Sparkles, ShieldCheck, IndianRupee,
  Zap, Lock, Award, MessageCircle, Star, ArrowRight,
  TrendingUp, Globe, MousePointer2
} from "lucide-react"
import appleLogo from "../assets/apple.svg"
import samsungLogo from "../assets/samsung.svg"
import oneplusLogo from "../assets/oneplus.svg"
import xiaomiLogo from "../assets/xiaomi.svg"

export default function Home() {
  const brands = [
    { name: "Apple", logo: appleLogo },
    { name: "Xiaomi", logo: xiaomiLogo },
    { name: "Samsung", logo: samsungLogo },
    { name: "OnePlus", logo: oneplusLogo },
    { name: "Google", logo: oneplusLogo },
    { name: "Vivo", logo: xiaomiLogo }
  ]

  const features = [
    {
      icon: Zap,
      title: "AI Damage Analysis",
      description: "Advanced YOLOv8 models detect screen cracks and body damage with surgical precision.",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Dynamic ML Pricing",
      description: "Our XGBoost algorithm scans live market data to ensure you get the maximum value.",
      color: "bg-purple-500/10 text-purple-500"
    },
    {
      icon: ShieldCheck,
      title: "Verified Authenticity",
      description: "Every device listing is AI-verified to prevent fraud and ensure quality for buyers.",
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      icon: Globe,
      title: "Seamless Ecosystem",
      description: "Connect your wallet, track listings, and get paid instantly through Razorpay.",
      color: "bg-orange-500/10 text-orange-500"
    }
  ]

  const stats = [
    { number: "98.4%", label: "AI Prediction Accuracy" },
    { number: "₹15Cr+", label: "Market Value Analyzed" },
    { number: "50k+", label: "Scans Completed" },
    { number: "4.9/5", label: "User Satisfaction" }
  ]

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative pt-10 pb-20 overflow-visible">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-3/5 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-semibold mb-4">
              <Sparkles size={16} />
              <span>Next-Gen Smartphone Resale</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              The Future of <br />
              <span className="text-brand-primary">Smartphone Resale</span> <br />
              is Spatial.
            </h1>
            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
              Experience the world's most advanced AI-powered marketplace. 
              Upload, analyze, and sell your device in a premium glass interface designed for the next decade.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/predict" className="glass-button-primary px-10 py-4 text-lg">
                Start AI Scan
                <ArrowRight size={20} />
              </Link>
              <Link to="/marketplace" className="glass-button-secondary px-8 py-4 text-lg">
                Explore Marketplace
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-primary flex items-center justify-center text-[10px] text-white font-bold">
                  +2k
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Trusted by <span className="text-slate-900 font-bold">2,000+</span> users worldwide
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-2/5 relative"
          >
            {/* Main Floating Card */}
            <div className="glass-panel p-8 relative z-10 animate-float shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Live Analysis</span>
                  <h3 className="text-2xl font-bold text-slate-800">iPhone 14 Pro</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Smartphone size={28} />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/40 shadow-sm">
                  <span className="text-sm text-slate-500">Physical Condition</span>
                  <span className="text-sm font-bold text-brand-success">Like New</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/40 shadow-sm">
                  <span className="text-sm text-slate-500">Market Demand</span>
                  <span className="text-sm font-bold text-slate-800">High</span>
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-brand-primary to-brand-premium text-white shadow-xl shadow-brand-primary/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-xs opacity-80 font-medium mb-1">Estimated Value</p>
                  <p className="text-4xl font-bold">₹ 78,500</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full w-fit">
                    <TrendingUp size={12} />
                    <span>+12% vs. local dealers</span>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
              </div>
            </div>

            {/* Background Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-secondary/20 blur-3xl rounded-full animate-pulse-slow" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-premium/20 blur-3xl rounded-full animate-pulse-slow-reverse" />
          </motion.div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-10">
        <div className="glass-panel py-10 px-8 flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center gap-3 group cursor-pointer">
              <img src={brand.logo} alt={brand.name} className="h-8 w-8 object-contain" />
              <span className="font-bold text-xl text-slate-400 group-hover:text-slate-800 transition-colors">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Intelligence in every pixel.</h2>
          <p className="text-lg text-slate-500">
            Our proprietary AI stack combines computer vision and predictive modeling to deliver the most accurate device valuation on the planet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="glass-card p-8 space-y-6"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center`}>
                  <Icon size={28} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="glass-panel p-12 sm:p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-3xl rounded-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2">
              <p className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tighter">{stat.number}</p>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="glass-panel p-12 sm:p-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-primary blur-[100px] rounded-full" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-brand-premium blur-[100px] rounded-full" />
          </div>
          
          <div className="relative z-10 text-center space-y-10 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
              Ready to enter the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">spatial era</span> of resale?
            </h2>
            <p className="text-xl text-slate-400">
              Join thousands of users who are getting the best value for their devices using ReSellAI. 
              No hidden fees, no low-ball offers, just pure AI intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link to="/predict" className="w-full sm:w-auto px-12 py-5 bg-white text-slate-900 rounded-[2rem] font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
                Start Free Scan
              </Link>
              <Link to="/support" className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 backdrop-blur-md rounded-[2rem] font-bold text-lg hover:bg-white/20 transition-all">
                Talk to Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}