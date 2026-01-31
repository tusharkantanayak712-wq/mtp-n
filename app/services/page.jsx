"use client";

import { motion } from "framer-motion";
import { FiUsers, FiGlobe, FiZap, FiCode, FiArrowRight } from "react-icons/fi";

export default function ServicesPage() {
  const whatsappLink = "https://wa.me/916372305866";

  const services = [
    {
      title: "Be a Reseller",
      desc: "Become a reseller and start selling game topups instantly. Cheapest rates in the market with high profit margins.",
      icon: FiUsers,
      badge: "Available • Cheapest",
      active: true,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Website Whitelabel",
      desc: "Launch your own branded topup website. Cheapest whitelabel solution with full control and support.",
      icon: FiGlobe,
      badge: "Available • Cheapest",
      active: true,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Custom Topup Website",
      desc: "Get a fully custom-built topup website tailored to your business needs.",
      icon: FiZap,
      badge: "Available",
      active: true,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "API Services",
      desc: "Integrate topup services directly into your app or website using our APIs.",
      icon: FiCode,
      badge: "Coming Soon",
      active: false,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="min-h-screen px-4 py-7 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Our Services
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto">
            Cheapest & reliable solutions to grow your topup business
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {services.map((service, i) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={service.active ? { y: -4 } : {}}
                onClick={() => service.active && window.open(whatsappLink, "_blank")}
                className={`group relative p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] transition-all ${service.active
                  ? "cursor-pointer hover:border-[var(--accent)] hover:shadow-xl"
                  : "opacity-50 cursor-not-allowed"
                  }`}
              >
                {/* Badge */}
                <span
                  className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full font-medium ${service.active
                    ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "bg-[var(--muted)]/10 text-[var(--muted)]"
                    }`}
                >
                  {service.badge}
                </span>

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg ${service.active && "group-hover:scale-110"
                    } transition-transform`}
                >
                  <Icon size={24} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                  {service.desc}
                </p>

                {service.active && (
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--accent)] group-hover:gap-3 transition-all">
                    Contact on WhatsApp
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-br from-[var(--accent)]/10 to-transparent border border-[var(--border)]"
        >
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-[var(--muted)] mb-6 max-w-xl mx-auto">
            Contact us on WhatsApp to discuss your requirements and get the best pricing
          </p>

        </motion.div>
      </div>
    </section>
  );
}
