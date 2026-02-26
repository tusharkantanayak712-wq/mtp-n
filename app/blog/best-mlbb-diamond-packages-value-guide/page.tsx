import type { Metadata } from "next";
import BlogPostLayout from "@/components/Blog/BlogPostLayout";

export const metadata: Metadata = {
    title: "Best MLBB Diamond Packages in India – Real Price & Value Guide (2026)",
    description: "Actual MLBB diamond prices in India with real cost-per-diamond breakdown. Find out which package gives you maximum value for your rupee in 2026.",
    alternates: { canonical: "https://mlbbtopup.in/blog/best-mlbb-diamond-packages-value-guide" },
};

// All prices sourced directly from the MLBB in-app store for India (INR), 2026
const PACKAGES = [
    { dm: "86", price: "₹118", original: "₹146", off: "19%", cpd: "₹1.37", best: false },
    { dm: "172", price: "₹235", original: "₹291", off: "19%", cpd: "₹1.37", best: false },
    { dm: "257", price: "₹353", original: "₹437", off: "19%", cpd: "₹1.37", best: false },
    { dm: "343", price: "₹460", original: "₹539", off: "14%", cpd: "₹1.34", best: false },
    { dm: "429", price: "₹578", original: "₹672", off: "14%", cpd: "₹1.35", best: false },
    { dm: "514", price: "₹685", original: "₹773", off: "11%", cpd: "₹1.33", best: false },
    { dm: "706", price: "₹888", original: "₹936", off: "5%", cpd: "₹1.26", best: false },
    { dm: "792", price: "₹1,006", original: "₹1,050", off: "5%", cpd: "₹1.27", best: false },
    { dm: "878", price: "₹1,124", original: "₹1,232", off: "9%", cpd: "₹1.28", best: false },
    { dm: "963", price: "₹1,214", original: "₹1,333", off: "9%", cpd: "₹1.26", best: false },
    { dm: "1049", price: "₹1,328", original: "₹1,458", off: "9%", cpd: "₹1.27", best: false },
    { dm: "1136", price: "₹1,440", original: "₹1,568", off: "8%", cpd: "₹1.27", best: false },
    { dm: "1412", price: "₹1,776", original: "₹1,960", off: "9%", cpd: "₹1.26", best: false },
    { dm: "2195", price: "₹2,685", original: "₹3,024", off: "11%", cpd: "₹1.22", best: true },
    { dm: "2901", price: "₹3,574", original: "₹4,032", off: "11%", cpd: "₹1.23", best: true },
    { dm: "3688", price: "₹4,494", original: "₹5,040", off: "11%", cpd: "₹1.22", best: true },
    { dm: "5532", price: "₹6,762", original: "₹7,504", off: "10%", cpd: "₹1.22", best: true },
    { dm: "9288", price: "₹11,235", original: "₹12,330", "off": "9%", cpd: "₹1.21", best: true },
];

export default function BlogPage() {
    return (
        <BlogPostLayout
            title="BEST MLBB DIAMOND PACKAGES IN INDIA — REAL PRICE & VALUE GUIDE (2026)"
            category="Value Guide"
            readTime="5 min read"
            date="Feb 26, 2026"
            image="https://res.cloudinary.com/dk0sslz1q/image/upload/v1765619191/ideogram-v3.0_A_high-quality_horizontal_rectangular_website_banner_for_a_gaming_top-up_website-0_2_rgpuck.png"
        >
            <p className="text-lg md:text-xl font-medium !opacity-100 italic border-l-4 border-[var(--accent)] pl-6 py-2 bg-[var(--accent)]/5 rounded-r-2xl">
                Spending your money wisely on <strong>MLBB diamonds</strong> can mean the difference between one skin and two. Below are the <strong>real, actual prices</strong> from the MLBB in-app store for India — with a full cost-per-diamond breakdown so you know exactly where your rupee goes.
            </p>

            <h2>Why Package Size Matters</h2>
            <p>
                Mobile Legends uses a tiered pricing model — the larger the package, the lower your <strong>cost-per-diamond (CPD)</strong>. Buying 86 diamonds five separate times will always cost you more than buying a 429-diamond bundle at once. Understanding this is the foundation of smart spending.
            </p>

            <h2>All MLBB Diamond Prices in India (2026) — With Cost Per Diamond</h2>
            <p>
                These are the <strong>real prices from the in-app store</strong> for Indian players, including the current discount percentage off the original price:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-[var(--border)] my-8">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[var(--border)] bg-[var(--card)]">
                            <th className="text-left px-4 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">Diamonds 💎</th>
                            <th className="text-left px-4 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">Price (₹)</th>
                            <th className="text-left px-4 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">Original</th>
                            <th className="text-left px-4 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">Discount</th>
                            <th className="text-left px-4 py-4 text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">CPD (₹/💎)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {PACKAGES.map((row, i) => (
                            <tr key={i} className={`${row.best ? "bg-[var(--accent)]/5" : ""} transition-colors`}>
                                <td className="px-4 py-3 font-black text-[var(--foreground)]">
                                    {row.dm}
                                    {row.best && <span className="ml-2 text-[8px] font-black bg-[var(--accent)] text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Best Value</span>}
                                </td>
                                <td className="px-4 py-3 font-black text-[var(--foreground)]">{row.price}</td>
                                <td className="px-4 py-3 font-mono text-[var(--muted)] opacity-50 line-through text-xs">{row.original}</td>
                                <td className="px-4 py-3">
                                    <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{row.off} OFF</span>
                                </td>
                                <td className={`px-4 py-3 font-black ${row.best ? "text-[var(--accent)]" : "text-[var(--muted)] opacity-70"}`}>{row.cpd}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p>
                As you can see, the <strong>CPD stays around ₹1.37</strong> for small packages (86–257 diamonds) and drops meaningfully to <strong>₹1.21–₹1.22</strong> for the largest bundles (2195–9288 diamonds). The sweet spot for most players is the <strong>2195+ range</strong> where you consistently get the best rate.
            </p>

            <h2>Special Passes — Worth It?</h2>
            <p>
                Two special passes also appear in the store's top-up section:
            </p>
            <ul>
                <li><strong>Weekly Diamond Pass – ₹139</strong> (was ₹198, 17% OFF) — You get an immediate batch of diamonds plus a daily diamond reward for 7 days. If you log in every day, the effective total value far exceeds what you'd get from a flat ₹139 purchase.</li>
                <li><strong>Twilight Pass – ₹738</strong> (was ₹865, ~8% OFF) — A seasonal pass with exclusive cosmetics and diamonds. Only recommended if you actively play during the season.</li>
            </ul>

            <div className="bg-[var(--card)] border border-[var(--border)] p-10 rounded-[40px] my-16 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
                <h3 className="italic font-black uppercase text-[var(--accent)] mb-4">Pro Tip 💡</h3>
                <p className="text-sm italic opacity-70 m-0">
                    Combine the <strong>Weekly Diamond Pass (₹139)</strong> with any large diamond bundle. You pay a little extra but get 7 days of bonus diamonds on top — making your total CPD even lower than the standalone package rate.
                </p>
            </div>

            <h2>Which Package Should You Buy?</h2>
            <p>
                Here's a practical guide based on your goal:
            </p>
            <ul>
                <li><strong>Just testing the service:</strong> 86 diamonds at ₹118 — minimal commitment</li>
                <li><strong>Weekly Diamond Pass habit:</strong> ₹139/week — best long-term value for casual players</li>
                <li><strong>Buying a basic skin (150–300 diamonds):</strong> 257 diamonds at ₹353</li>
                <li><strong>Starlight Membership (~300 diamonds):</strong> 257 diamonds at ₹353 covers it</li>
                <li><strong>Premium skins (600–750 diamonds):</strong> 706 diamonds at ₹888 is efficient</li>
                <li><strong>Big spender / best CPD:</strong> 2195 or above — ₹1.22/diamond or lower</li>
            </ul>

            <h2>Using Your Wallet for Extra Savings</h2>
            <p>
                Topping up your <strong>site wallet</strong> on MLBTopUp.in lets you skip per-transaction payment gateway fees, checkout faster, and split payments if needed. For regular buyers, wallet top-up is the most efficient method to manage your diamond budget.
            </p>

            <div className="mt-20 pt-10 border-t border-[var(--border)]">
                <h4 className="text-xl font-black italic uppercase tracking-widest mb-8 opacity-40 transition-colors">Value FAQ</h4>
                <div className="space-y-8">
                    <div className="group">
                        <h5 className="text-[var(--accent)] font-black uppercase tracking-tight text-base mb-2 group-hover:translate-x-1 transition-transform italic">Are these India-specific prices?</h5>
                        <p className="text-sm opacity-60">Yes. All prices listed above are sourced directly from the MLBB in-app top-up store for Indian players and are shown in Indian Rupees (₹). Prices may vary by region.</p>
                    </div>
                    <div className="group">
                        <h5 className="text-[var(--accent)] font-black uppercase tracking-tight text-base mb-2 group-hover:translate-x-1 transition-transform italic">Do prices change during events?</h5>
                        <p className="text-sm opacity-60">The base INR price stays the same, but Moonton adds bonus diamonds on top during events — effectively lowering your cost-per-diamond without changing the listed price.</p>
                    </div>
                    <div className="group">
                        <h5 className="text-[var(--accent)] font-black uppercase tracking-tight text-base mb-2 group-hover:translate-x-1 transition-transform italic">Is it cheaper to top up via MLBTopUp.in?</h5>
                        <p className="text-sm opacity-60">Top-up sites offer competitive pricing, faster processing, and wallet-based savings that the in-game store doesn't provide. Combined with referral rewards and wallet bonuses, the total cost can be meaningfully lower.</p>
                    </div>
                    <div className="group">
                        <h5 className="text-[var(--accent)] font-black uppercase tracking-tight text-base mb-2 group-hover:translate-x-1 transition-transform italic">Can I buy multiple packages in one session?</h5>
                        <p className="text-sm opacity-60">Absolutely. There's no limit. Many players buy the Weekly Pass <em>and</em> a large diamond bundle together to stack maximum value in a single transaction.</p>
                    </div>
                </div>
            </div>
        </BlogPostLayout>
    );
}
