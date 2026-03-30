import type { Metadata } from "next";
import BlogPostLayout from "@/components/Blog/BlogPostLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MLBB Roles Explained: Tank, Fighter, Mage, Assassin, Marksman, Support – 2026",
  description: "Learn the 6 main roles in Mobile Legends: Bang Bang. Understand how to play Tank, Fighter, Mage, Assassin, Marksman, and Support to win more games.",
  alternates: { canonical: "https://mlbbtopup.in/blog/mlbb/mlbb-roles-guide" },
};

export default function BlogPage() {
  return (
    <BlogPostLayout
      title="MLBB ROLES EXPLAINED: TANK, FIGHTER, MAGE, ASSASSIN, MARKSMAN, SUPPORT"
      category="Game Guide"
      readTime="15 min read"
      date="March 30, 2026"
      image="/blog/mlbb-roles.png"
      game="MLBB"
    >
      <p className="text-lg md:text-xl font-medium !opacity-100 italic border-l-4 border-[var(--accent)] pl-6 py-2 bg-[var(--accent)]/5 rounded-r-2xl">
        To win in Mobile Legends, you must know your job. Each hero has a special "Role." If your team has the right roles, you will win easily. Here is our complete, in-depth guide to all 6 MLBB roles, from the front-line Tanks to the late-game Marksmen.
      </p>

      <p>
        In Mobile Legends: Bang Bang (MLBB), teamwork is everything. You can't just pick five high-damage heroes and expect to win. A balanced team needs a mix of defense, crowd control, and damage. Understanding these 6 roles will help you choose the right hero for every match. Each role has a unique playstyle, rotation, and item build that you must master to climb the ranks in 2026.
      </p>

      <h2>1. Tank (The Shield)</h2>
      <p>
        Tanks are the heavy-hitters with a lot of health and defense. Their job is to stay in the front and take all the damage for their team. They also use "Crowd Control" (CC) to stop enemies.
      </p>
      <ul>
        <li><strong>Job:</strong> Protect the team and start fights. Tanks must peel for their Marksman and Mage to keep them alive.</li>
        <li><strong>Rotation:</strong> Usually moves between lanes to help teammates and provide vision in bushes (Roaming).</li>
        <li><strong>Playstyle:</strong> You should never be afraid to take damage. A good Tank knows when to sacrifice themselves to save the team carry.</li>
        <li><strong>Popular Heroes:</strong> Tigreal, Khufra, Akai, Franco, Atlas.</li>
      </ul>

      <h2>2. Fighter (The Warrior)</h2>
      <p>
        Fighters are a mix of damage and defense. They usually play in the <strong>Exp Lane</strong>. They are strong in 1v1 fights and can survive for a long time.
      </p>
      <ul>
        <li><strong>Job:</strong> Hold the side lane and dive into the backline during teamfights to kill the enemy Mage or Marksman.</li>
        <li><strong>Rotation:</strong> Stays in the Exp Lane until they reach Level 4, then joins the team for Turtle or Lord fights. Fighters are the "second front line."</li>
        <li><strong>Playstyle:</strong> Aggressive and sustained. Fighters need to stay in the middle of a fight for as long as possible.</li>
        <li><strong>Popular Heroes:</strong> Chou, Alpha, Terizla, Yu Zhong, Martis.</li>
      </ul>

      <h2>3. Mage (The Magic Dealer)</h2>
      <p>
        Mages deal massive Magic Damage from a distance. They usually stay in the <strong>Mid Lane</strong>. They use their skills to kill enemies quickly (Burst damage).
      </p>
      <ul>
        <li><strong>Job:</strong> Control the middle of the map and deal damage from a safe distance. Mages focus on clearing waves and then rotating to the Gold Lane or Exp Lane to gank.</li>
        <li><strong>Rotation:</strong> Clears the Mid Lane minions quickly then helps the Top or Bottom lane. Mages provide the "Magic Burst" needed to kill enemies instantly.</li>
        <li><strong>Playstyle:</strong> Tactical and careful. Mages have low health, so you must always position yourself safely behind your Tank.</li>
        <li><strong>Popular Heroes:</strong> Nana, Vexana, Kadita, Lunox, Gord.</li>
      </ul>

      <div className="bg-[var(--card)] border border-[var(--border)] p-10 rounded-[40px] my-16 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--accent)]" />
        <h3 className="italic font-black uppercase text-[var(--accent)] mb-4">Pro Strategy 💎</h3>
        <p className="text-sm italic opacity-70 m-0 leading-relaxed">
          A balanced team usually has 1 Tank, 1 Fighter, 1 Mage, 1 Assassin (Jungler), and 1 Marksman. This is the <strong>best MLBB team setup</strong> to reach Mythic. If your team has two Marksmen or two Junglers, you will likely lose due to a lack of resources and defense.
        </p>
      </div>

      <h2>4. Assassin (The Killer)</h2>
      <p>
        Assassins have very high damage but low health. Most of them are <strong>Junglers</strong>. They move fast and can kill the enemy's Marksman or Mage in one second.
      </p>
      <ul>
        <li><strong>Job:</strong> Farm the jungle and kill the "weak" targets (Mages/Marksmen). Assassins are responsible for taking the Turtle and the Lord.</li>
        <li><strong>Rotation:</strong> Loops through the jungle buffs (Blue and Red) and ganks the lanes to get early kills. You must always be looking for a way into the enemy's backline.</li>
        <li><strong>Playstyle:</strong> High-risk, high-reward. You need "fast hands" and quick reflexes. Timing is everything.</li>
        <li><strong>Popular Heroes:</strong> Gusion, Lancelot, Helcurt, Fanny, Ling.</li>
      </ul>

      <h2>5. Marksman (The Shooter)</h2>
      <p>
        Marksmen (MM) start weak but get very strong later. They play in the <strong>Gold Lane</strong>. They deal damage from far away with their "Basic Attacks."
      </p>
      <ul>
        <li><strong>Job:</strong> Farm gold early and "carry" the team to win the late game. Marksmen deal the most consistent damage during teamfights.</li>
        <li><strong>Rotation:</strong> Stays in the Gold Lane to get as much money as possible. Do not join fights unless you have at least two core items.</li>
        <li><strong>Playstyle:</strong> Survival is key. A dead Marksman deals zero damage. Always stay behind your frontline and focus on the closest enemy.</li>
        <li><strong>Popular Heroes:</strong> Layla, Miya, Brody, Ixia, Lesley.</li>
      </ul>

      <h2>6. Support (The Helper)</h2>
      <p>
        Support heroes don't need much gold. Their job is to heal teammates, give them speed, or shield them. They are the "Guardian Angels" of the team.
      </p>
      <ul>
        <li><strong>Job:</strong> Assist the team with heals, buffs, and vision. Support heroes often use Roam equipment to help their teammates get more gold.</li>
        <li><strong>Rotation:</strong> Moves with the Jungler or Marksman to keep them alive. Support heroes help control the tempo of the game.</li>
        <li><strong>Playstyle:</strong> Altruistic. You should focus on keeping your teammates alive and using your abilities at the right time to save lives or secure kills.</li>
        <li><strong>Popular Heroes:</strong> Estes, Angela, Diggie, Floryn, Mathilda.</li>
      </ul>

      <h2>Advanced Role Table: Role Comparison</h2>
      <div className="overflow-x-auto my-8 rounded-2xl border border-white/5">
        <table className="w-full text-left text-[10px] uppercase font-bold italic tracking-tighter">
          <thead className="bg-white/5 text-[var(--accent)]">
            <tr>
              <th className="p-3">Role</th>
              <th className="p-3">Primary Lane</th>
              <th className="p-3">Main Focus</th>
              <th className="p-3">Scaling</th>
            </tr>
          </thead>
          <tbody className="opacity-60">
            <tr className="border-b border-white/5">
              <td className="p-3">Tank</td>
              <td className="p-3">Roam</td>
              <td className="p-3">Defense / CC</td>
              <td className="p-3">Early-Mid</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-3">Fighter</td>
              <td className="p-3">Exp Lane</td>
              <td className="p-3">Sustainability</td>
              <td className="p-3">Mid-Late</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-3">Mage</td>
              <td className="p-3">Mid Lane</td>
              <td className="p-3">Magic Burst</td>
              <td className="p-3">Mid Game</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-3">Assassin</td>
              <td className="p-3">Jungle</td>
              <td className="p-3">Burst / Gank</td>
              <td className="p-3">Early-Mid</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="p-3">Marksman</td>
              <td className="p-3">Gold Lane</td>
              <td className="p-3">Late Game Carry</td>
              <td className="p-3">Late Game</td>
            </tr>
            <tr>
              <td className="p-3">Support</td>
              <td className="p-3">Roam</td>
              <td className="p-3">Healing / Buffs</td>
              <td className="p-3">All Game</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Which Role Should You Choose?</h2>
      <p>
        Selecting a role depends entirely on your personality and playstyle. If you like being the center of attention and leading the charge, the <strong>Tank</strong> or <strong>Fighter</strong> role is for you. If you prefer precision and waiting for the perfect moment to strike, consider becoming an <strong>Assassin</strong> or <strong>Mage</strong>.
      </p>
      <p>
        For players who enjoy being the hero of the story and winning the game in the final minutes, the <strong>Marksman</strong> role is the most rewarding. Lastly, if you find joy in helping others and making your teammates look like gods, you will excel as a <strong>Support</strong>.
      </p>

      <p>
        Need more diamonds to unlock these pro heroes or the latest skins? Get the <strong>cheapest MLBB top up in India</strong> instantly at our <Link href="/games/mobile-legends988" className="text-[var(--accent)] underline transition-opacity">Diamond Store</Link>. We provide pure, safe top-ups with 24/7 automated delivery.
      </p>

      <div className="mt-20 pt-10 border-t border-[var(--border)]">
        <h4 className="text-xl font-black italic uppercase tracking-widest mb-8 opacity-40 transition-colors">Role Strategy FAQ</h4>
        <div className="space-y-8">
          <div className="group">
            <h5 className="text-[var(--accent)] font-black uppercase tracking-tight text-base mb-2 group-hover:translate-x-1 transition-transform italic">What is the hardest role to play?</h5>
            <p className="text-sm opacity-60">Timing and reflexes are key. The <strong>Assassin</strong> role is often considered the hardest because you need very fast reflexes, high energy management (for heroes like Fanny), and perfect timing to avoid being killed instantly.</p>
          </div>
          <div className="group">
            <h5 className="text-[var(--accent)] font-black uppercase tracking-tight text-base mb-2 group-hover:translate-x-1 transition-transform italic">Can one hero have multiple roles?</h5>
            <p className="text-sm opacity-60">Yes! Many heroes are hybrid. For example, <strong>Edith</strong> is a Tank/Marksman, and <strong>Jawhead</strong> can be played as either a Fighter or a Tank. This flexibility is great for counter-picking in high ranks like Mythical Glory.</p>
          </div>
          <div className="group">
            <h5 className="text-[var(--accent)] font-black uppercase tracking-tight text-base mb-2 group-hover:translate-x-1 transition-transform italic">Why does everyone want to be a Jungler?</h5>
            <p className="text-sm opacity-60">The Jungler role (often an Assassin or Fighter) has the most impact on the early game. Successful ganks and securing objectives like the Turtle make the Jungler feel like the leader of the match, which is why it's a very popular pick.</p>
          </div>
        </div>
      </div>
    </BlogPostLayout>
  );
}
