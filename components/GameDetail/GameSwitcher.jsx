"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function GameSwitcher() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const scrollContainerRef = useRef(null);

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper: check if weekly pass variant is active
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

                // Duplicate Weekly Pass (same as GamesPage logic)
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
                        // Add Weekly Pass as a distinct item
                        fetchedGames.push({
                            ...weeklyPassSource,
                            gameName: "Weekly Pass",
                            _variant: "weekly-pass",
                            gameSlug: WEEKLY_PASS_SLUG,
                            gameImageId: {
                                image:
                                    "https://res.cloudinary.com/dk0sslz1q/image/upload/v1768536006/WhatsApp_Image_2026-01-16_at_08.50.36_tviv2b.jpg", // Distinct image
                            },
                        });
                    }
                }

                // Sort: Weekly Pass first, then alpha or by popularity?
                // Let's put Weekly Pass near MLBB or at start.
                // Simple alpha sort for now
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

    // Handle scroll to active item
    useEffect(() => {
        if (!loading && games.length > 0 && scrollContainerRef.current) {
            // Find index of current game
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
                    // Center the active element
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
        <div className="w-full h-24 bg-[var(--card)]/30 animate-pulse rounded-xl mb-6" />
    );

    return (
        <div className="w-full mb-6 relative z-20">
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-black text-[var(--muted)] uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                    Quick Switch
                </h3>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {games.map((game, idx) => {
                    const isVariant = game._variant === "weekly-pass";
                    const isActive = (isVariant && isWeeklyPassQuery && game.gameSlug === currentSlug) ||
                        (!isVariant && !isWeeklyPassQuery && game.gameSlug === currentSlug);

                    return (
                        <motion.button
                            key={`${game.gameSlug}-${idx}-${isVariant ? 'wp' : 'reg'}`}
                            onClick={() => handleSwitch(game)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                        relative flex-shrink-0 w-[4.5rem] h-[4.5rem] md:w-20 md:h-20 rounded-2xl overflow-hidden transition-all duration-300 snap-center group
                        ${isActive
                                    ? "ring-2 ring-[var(--accent)] shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] opacity-100 scale-105"
                                    : "ring-1 ring-[var(--border)] opacity-60 hover:opacity-100 hover:ring-[var(--foreground)]/20 grayscale hover:grayscale-0"
                                }
                    `}
                        >
                            <img
                                src={game.gameImageId?.image || "/placeholder.jpg"}
                                alt={game.gameName}
                                className="w-full h-full object-cover"
                            />

                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive ? 'opacity-100' : ''}`} />

                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute inset-0 border-2 border-[var(--accent)] rounded-2xl" />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
