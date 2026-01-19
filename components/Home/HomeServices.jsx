import {
  FaStore,
  FaGlobe,
  FaCogs,
  FaWhatsapp,
} from "react-icons/fa";

const services = [
  {
    title: "Be a Reseller",
    description:
      "Start selling game topups instantly with industry-leading prices and reliable delivery. Built for scale and long-term profit.",
    badge: {
      text: "Best Value",
      className:
        "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    },
    icon: FaStore,
  },
  {
    title: "Website Whitelabel",
    description:
      "Launch your own branded topup platform with full control, automated systems, and ongoing technical support.",
    badge: {
      text: "Available",
      className:
        "bg-blue-500/10 text-blue-600 border-blue-500/30",
    },
    icon: FaGlobe,
  },
  {
    title: "Custom Topup Platform",
    description:
      "Enterprise-grade custom solutions designed around your business requirements, security needs, and growth plans.",
    badge: {
      text: "Custom",
      className:
        "bg-purple-500/10 text-purple-600 border-purple-500/30",
    },
    icon: FaCogs,
  },
];

export default function HomeServices() {
  return (
    <section className="py-14 sm:py-16 px-4 sm:px-6 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10 sm:mb-12 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            Additional Services
          </h2>

          <p className="text-[var(--muted)] text-sm sm:text-base leading-relaxed">
            Planning to start or expand a game topup business?
            We provide reliable reseller programs and professional website solutions.
          </p>
        </div>

        {/* Services */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="
                  rounded-2xl p-6 sm:p-7
                  bg-[var(--card)]
                  border border-[var(--border)]
                  transition-all duration-200
                  hover:border-[var(--accent)]
                  hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)]
                "
              >
                {/* Icon */}
                <div className="mb-4">
                  <Icon className="text-lg text-[var(--accent)]" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-medium mb-2">
                  {service.title}
                </h3>

                <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] px-3 py-1 rounded-full border ${service.badge.className}`}
                  >
                    {service.badge.text}
                  </span>

                  <a
                    href="https://wa.me/916372305866"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center gap-2
                      text-sm font-medium
                      text-[var(--accent)]
                      hover:underline
                    "
                  >
                    <FaWhatsapp className="text-sm" />
                    Contact
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-14 border-t border-[var(--border)] pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)] max-w-xl">
            Want to discuss pricing, customization, or reseller onboarding?
            Our team is available for direct consultation.
          </p>
        </div>

      </div>
    </section>
  );
}
