import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Smartphone, UploadCloud, Sparkles, ShieldCheck, IndianRupee,
  Zap, Lock, Award, MessageCircle, Star, ArrowRight
} from "lucide-react"
import appleLogo from "../assets/apple.svg"
import samsungLogo from "../assets/samsung.svg"
import oneplusLogo from "../assets/oneplus.svg"
import xiaomiLogo from "../assets/xiaomi.svg"

export default function Home() {
  const FloatingCard = () => (
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-600 rounded-3xl blur-2xl opacity-20"></div>
      <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl p-6 sm:p-8 max-w-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Device Valuation</p>
              <p className="text-lg font-bold text-gray-900">iPhone 12 128GB</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white">
              <Smartphone size={20} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Condition</span>
              <span className="text-sm font-semibold text-gray-900">Moderate Damage</span>
            </div>
            <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Market Value</span>
              <span className="text-lg font-bold text-gray-900">₹32,500</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
            <p className="text-xs text-green-700 font-semibold mb-2">ReSellAI Offer</p>
            <p className="text-2xl font-bold text-green-600">₹33,800</p>
            <p className="text-xs text-green-600 mt-1">+4% above market</p>
          </div>

          <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
            Accept Offer
          </button>
        </div>
      </div>
    </motion.div>
  )

  const BrandLogo = ({ name, logo }) => (
    <motion.div
      whileHover={{ scale: 1.12 }}
      className="group cursor-pointer flex flex-col items-center gap-3"
    >
      <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-lg group-hover:shadow-xl group-hover:bg-white/80 transition-all duration-300">
        <img 
          src={logo} 
          alt={name} 
          className="h-10 w-10 object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
        />
      </div>
      <p className="text-xs font-medium text-gray-600 text-center group-hover:text-gray-900 transition-colors">{name}</p>
    </motion.div>
  )

  const brands = [
    { name: "Apple", logo: appleLogo },
    { name: "Xiaomi", logo: xiaomiLogo },
    { name: "Samsung", logo: samsungLogo },
    { name: "OnePlus", logo: oneplusLogo },
    { name: "Redmi", logo: xiaomiLogo }
  ]

  const features = [
    {
      icon: Zap,
      title: "AI Damage Detection",
      description: "Powered by YOLO and CNN for accurate screen analysis."
    },
    {
      icon: Award,
      title: "Smart ML Pricing",
      description: "XGBoost-based resale scoring engine."
    },
    {
      icon: Lock,
      title: "Secure Razorpay Payments",
      description: "Bank-grade secure transactions."
    },
    {
      icon: Smartphone,
      title: "Verified Marketplace",
      description: "Every listing AI-scored before going live."
    }
  ]

  const stats = [
    { number: "5+", label: "Brands Supported" },
    { number: "100+", label: "Devices Scanned" },
    { number: "₹10L+", label: "Estimated Value Generated" },
    { number: "98%", label: "AI Accuracy Rate" }
  ]

  const testimonials = [
    {
      quote: "ReSellAI gave me the best price for my iPhone 12. The AI analysis was spot-on and the entire process was seamless!",
      name: "Arjun Mehta",
      city: "Bangalore"
    },
    {
      quote: "I was skeptical about AI pricing, but ReSellAI proved me wrong. Fair valuation and instant payment. Highly recommended!",
      name: "Priya Sharma",
      city: "Delhi"
    },
    {
      quote: "The marketplace feature is brilliant. Found great deals on verified phones. Trust the AI scoring completely.",
      name: "Rohit Verma",
      city: "Mumbai"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <div className="space-y-0">
      <section className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16 py-16 lg:py-20">
        <div className="w-full lg:w-1/2 space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
            Sell Your Old Phone{" "}
            <span className="text-green-600">Instantly</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            ReSellAI uses computer vision and pricing intelligence to evaluate your device in seconds,
            giving you a transparent, market-ready offer powered by AI.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/predict"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-md hover:bg-green-700 transition-colors"
            >
              Sell Now
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 hover:border-green-200 hover:text-green-700 hover:bg-green-50 transition-colors"
            >
              Browse Phones
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-[13px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-green-500" />
              <span>Verified devices</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={16} className="text-green-500" />
              <span>AI-powered pricing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IndianRupee size={16} className="text-green-500" />
              <span>Instant offers</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 shadow-md p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-md">
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">AI Device Check</p>
                    <p className="text-xs text-slate-500">Example: iPhone 12, 128GB</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  Instant Valuation
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100 px-3 py-2">
                  <span className="text-slate-500">Market Estimate</span>
                  <span className="font-semibold text-slate-900">₹ 32,500</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white border border-slate-100 px-3 py-2">
                  <span className="text-slate-500">ReSellAI Offer</span>
                  <span className="font-semibold text-green-600">₹ 33,800</span>
                </div>
                <div className="rounded-xl bg-green-50 border border-green-100 px-3 py-2 text-[11px] text-green-800">
                  AI considers model, storage, condition and live marketplace trends to generate the best price
                  for your device.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4 py-16 lg:py-20">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            How it works
          </h2>
          <p className="text-sm text-slate-500">
            A simple, transparent journey from upload to payout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-xl bg-white border border-slate-200 shadow-md p-4 sm:p-5 space-y-3 hover:shadow-lg transition-shadow"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <UploadCloud size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Upload Image
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Snap or upload photos of your phone along with basic details like brand, model and storage.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-xl bg-white border border-slate-200 shadow-md p-4 sm:p-5 space-y-3 hover:shadow-lg transition-shadow"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <Sparkles size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              AI Evaluates
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Our models analyse condition, defects and current market trends to recommend the right price.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-xl bg-white border border-slate-200 shadow-md p-4 sm:p-5 space-y-3 hover:shadow-lg transition-shadow"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <IndianRupee size={20} />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">
              Get Best Price
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Lock in your offer, complete pickup and receive secure payment with full tracking.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="space-y-8 py-16 lg:py-20">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Supported Brands
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            AI-powered valuation available for leading smartphone brands
          </p>
        </div>

        <div className="flex justify-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full max-w-6xl"
          >
            {brands.map((brand, idx) => (
              <motion.div key={idx} variants={itemVariants} className="flex justify-center">
                <BrandLogo name={brand.name} logo={brand.logo} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            More brands coming soon.
          </p>
        </div>
      </section>

      <section className="space-y-8 py-16 lg:py-20">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Why Choose ReSellAI
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="rounded-xl bg-white border border-slate-200 shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      <section className="rounded-2xl bg-slate-100 p-8 sm:p-12 lg:p-16 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            Trusted by Users Across India
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 text-center space-y-2"
            >
              <div className="text-3xl sm:text-4xl font-bold text-green-600">
                {stat.number}
              </div>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="space-y-8 py-16 lg:py-20">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            What Our Users Say
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="rounded-xl bg-white border border-slate-200 shadow-md p-6 space-y-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-green-500 text-green-500" />
                ))}
              </div>

              <div className="flex gap-2">
                <MessageCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <p className="text-sm text-slate-700 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm font-semibold text-slate-900">
                  {testimonial.name}
                </p>
                <p className="text-xs text-slate-500">
                  {testimonial.city}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="rounded-2xl bg-green-50 p-8 sm:p-12 lg:p-16 py-16 lg:py-20 border border-green-200">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">
              Ready to Know Your Phone's True Value?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Get an AI-powered valuation in seconds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/predict"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-8 py-3 text-base font-semibold text-white shadow-md hover:bg-green-700 transition-colors w-full sm:w-auto"
            >
              Start AI Scan
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-green-300 bg-white px-8 py-3 text-base font-semibold text-green-700 hover:bg-green-50 transition-colors w-full sm:w-auto"
            >
              Browse Marketplace
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-4 py-16 lg:py-20">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Why people trust ReSellAI
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-xl bg-white border border-slate-200 shadow-md p-4 space-y-2 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sparkles size={18} className="text-green-500" />
              <span>AI Verified Devices</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Every listing is scored by AI for authenticity and condition, reducing surprises for buyers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-xl bg-white border border-slate-200 shadow-md p-4 space-y-2 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldCheck size={18} className="text-green-500" />
              <span>Secure Razorpay Payments</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Payouts are handled via Razorpay, giving you bank-grade safety for every transaction.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-xl bg-white border border-slate-200 shadow-md p-4 space-y-2 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Smartphone size={18} className="text-green-500" />
              <span>Instant Valuation</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              See a live indicative price in seconds before you decide to list or sell your phone.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}