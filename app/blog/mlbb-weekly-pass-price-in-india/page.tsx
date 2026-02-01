import type { Metadata } from "next";
import BlogPostLayout from "@/components/Blog/BlogPostLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MLBB Weekly Pass Price in India (Updated 2025)",
  description: "Check the latest MLBB weekly pass price in India (2025). Learn benefits, rewards, validity, and safe buying guide.",
  alternates: { canonical: "https://mlbbtopup.in/blog/mlbb-weekly-pass-price-in-india" },
};

export default function BlogPage() {
  return (
    <BlogPostLayout
      title="MLBB WEEKLY PASS PRICE IN INDIA (2025)"
      category="Guide"
      readTime="4 min read"
      date="Jan 10, 2025"
      image="https://res.cloudinary.com/dk0sslz1q/image/upload/v1765619191/ideogram-v3.0_A_high-quality_horizontal_rectangular_website_banner_for_a_gaming_top-up_website-0_2_rgpuck.png"
    >
      <p className="text-lg md:text-xl font-medium !opacity-100 italic border-l-4 border-[var(--accent)] pl-6 py-2 bg-[var(--accent)]/5 rounded-r-2xl">
        The <strong>MLBB weekly pass</strong> is one of the most cost-effective recharge options for Mobile Legends players in India. It provides daily diamond rewards for 7 days at a much lower cost.
      </p>

      <h2>What is the Weekly Pass?</h2>
      <p>
        The weekly pass grants diamonds daily for seven consecutive days. Once activated, diamonds are automatically credited to your account upon login. It is ideal for players aiming for skins, heroes, and seasonal events.
      </p>

      <h2>Latest Price in India (2025)</h2>
      <p>
        The current <strong>MLBB weekly pass price in India</strong> typically ranges between <strong>₹130 – ₹150</strong>. This price point remains the best value-for-money option compared to direct diamond recharges.
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] p-10 rounded-[40px] my-16 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
        <h3 className="italic font-black uppercase text-[var(--accent)] mb-4">Quick Fact 🔍</h3>
        <p className="text-sm italic opacity-70 m-0">
          Buying the Weekly Pass gives you up to 4x value compared to normal diamond packs of the same price.
        </p>
      </div>

      <h2>Top Benefits</h2>
      <ul>
        <li>Unbeatable value-to-diamond ratio</li>
        <li>Steady daily flow of premium currency</li>
        <li>Perfect for stacking up for Limited-Time skins</li>
        <li>Affordable entry point for budget players</li>
      </ul>

      <h2>How to Buy Safely?</h2>
      <p>
        Always prioritize trusted top-up platforms that only require your <strong>Player ID</strong> and <strong>Server ID</strong>. Official partners ensure your diamonds arrive instantly without compromising your security.
      </p>

      <p>
        Stay away from sellers asking for your Google or Moonton password. A genuine transaction never requires your account credentials.
      </p>

      <div className="mt-20 pt-10 border-t border-[var(--border)]">
        <h4 className="text-xl font-black italic uppercase tracking-widest mb-8 opacity-40 transition-colors">Pricing FAQ</h4>
        <div className="space-y-8">
          <div className="group">
            <h5 className="text-[var(--accent)] font-black uppercase tracking-tight text-base mb-2 group-hover:translate-x-1 transition-transform italic">Can I buy multiple passes?</h5>
            <p className="text-sm opacity-60">Yes! Stacking usually extends the duration of your daily rewards. Check the platform specific limits before purchasing.</p>
          </div>
          <div className="group">
            <h5 className="text-[var(--accent)] font-black uppercase tracking-tight text-base mb-2 group-hover:translate-x-1 transition-transform italic">Is it cheaper than diamonds?</h5>
            <p className="text-sm opacity-60">Per diamond, the Weekly Pass is significantly cheaper than buying any other standard pack in the game.</p>
          </div>
        </div>
      </div>
    </BlogPostLayout>
  );
}
