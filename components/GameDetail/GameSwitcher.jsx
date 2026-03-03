"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function GameSwitcher() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const scrollContainerRef = useRef(null);

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    const isWeeklyPassQuery = searchParams.get("type") === "weekly-pass";
    const currentSlug = params?.slug;
    const WEEKLY_PASS_SLUG = "mobile-legends988";

    useEffect(() => {
        let mounted = true;

        async function fetchGames() {
            try {
                const res = await fetch("/api/games");
                const json = await res.json();

                if (!mounted) return;

                let fetchedGames = json?.data?.games || [];

                const weeklyPassSource = fetchedGames.find(
                    (g) => g.gameSlug === WEEKLY_PASS_SLUG
                );

                if (weeklyPassSource) {
                    const alreadyExists = fetchedGames.some(
                        (g) =>
                            g.gameSlug === WEEKLY_PASS_SLUG &&
                            g.gameName === "Weekly Pass"
                    );

                    if (!alreadyExists) {
                        fetchedGames.push({
                            ...weeklyPassSource,
                            gameName: "Weekly Pass",
                            _variant: "weekly-pass",
                            gameSlug: WEEKLY_PASS_SLUG,
                            gameImageId: {
                                image: "/game-assets/weeklypass.jpg",
                            },
                        });
                    }
                }

                fetchedGames.sort((a, b) => a.gameName.localeCompare(b.gameName));
                setGames(fetchedGames);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load games for switcher:", err);
                setLoading(false);
            }
        }

        fetchGames();
        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        if (!loading && games.length > 0 && scrollContainerRef.current) {
            const activeIndex = games.findIndex(g => {
                const isVariant = g._variant === "weekly-pass";
                if (isVariant && isWeeklyPassQuery && g.gameSlug === currentSlug) return true;
                if (!isVariant && !isWeeklyPassQuery && g.gameSlug === currentSlug) return true;
                return false;
            });

            if (activeIndex !== -1) {
                const container = scrollContainerRef.current;
                const element = container.children[activeIndex];
                if (element) {
                    const scrollLeft = element.offsetLeft - (container.clientWidth / 2) + (element.clientWidth / 2);
                    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                }
            }
        }
    }, [loading, games, currentSlug, isWeeklyPassQuery]);

    const handleSwitch = (game) => {
        if (game._variant === "weekly-pass") {
            router.push(`/games/${game.gameSlug}?type=weekly-pass`);
        } else {
            router.push(`/games/${game.gameSlug}`);
        }
    };

    if (loading) return (
        <div className="w-full flex gap-4 overflow-hidden mb-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 animate-pulse" />
            ))}
        </div>
    );

    return (
        <div className="w-full mb-8 relative z-20">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-[var(--accent)]" />
                    <h3 className="text-[10px] md:text-xs font-black text-[var(--foreground)] uppercase tracking-[0.3em] opacity-50">
                        Quick Switch
                    </h3>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {games.map((game, idx) => {
                    const isVariant = game._variant === "weekly-pass";
                    const isActive = (isVariant && isWeeklyPassQuery && game.gameSlug === currentSlug) ||
                        (!isVariant && !isWeeklyPassQuery && game.gameSlug === currentSlug);

                    return (
                        <div
                            key={`${game.gameSlug}-${idx}-${isVariant ? 'wp' : 'reg'}`}
                            className="flex-shrink-0 flex flex-col items-center gap-1.5 snap-center transition-all duration-500"
                        >
                            <motion.button
                                onClick={() => handleSwitch(game)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    relative w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] transition-all duration-500 group
                                    ${isActive
                                        ? "ring-2 ring-[var(--accent)] shadow-[0_8px_20px_-5px_rgba(var(--accent-rgb),0.4)]"
                                        : "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                                    }
                                `}
                            >
                                {/* Reflection Shimmer */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[1.25rem] z-20">
                                    <motion.div
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "linear", repeatDelay: 2 }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full skew-x-[-20deg]"
                                    />
                                </div>

                                <div className="relative w-full h-full rounded-[1.25rem] overflow-hidden bg-[var(--card)] ring-1 ring-white/10 group-hover:ring-white/20">
                                    <Image
                                        src={game.gameImageId?.image || "/placeholder.jpg"}
                                        alt={game.gameName}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100' : ''}`} />
                                </div>

                                {/* Active Glow Backdrop */}
                                {isActive && (
                                    <div className="absolute inset-0 -z-10 bg-[var(--accent)] blur-xl opacity-20 scale-125 rounded-[1.25rem]" />
                                )}
                            </motion.button>

                            {/* Game Name Label - Always Visible */}
                            <p className={`
                                text-[7px] md:text-[8px] font-black uppercase tracking-wider text-center max-w-[4rem] md:max-w-[4.5rem] line-clamp-1 transition-colors duration-300
                                ${isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)] opacity-60 group-hover:opacity-100'}
                            `}>
                                {game.gameName}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
