"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Plus, Compass, Command, X } from "lucide-react";
import { useRouter } from "next/navigation";

export const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const actions = [
        { icon: <Compass size={18} />, label: "Explore Events", href: "/explore", shortcut: "E" },
        { icon: <Plus size={18} />, label: "Create New Event", href: "/create-event", shortcut: "C" },
        { icon: <Calendar size={18} />, label: "My Events", href: "/my-events", shortcut: "M" },
    ].filter(a => a.label.toLowerCase().includes(search.toLowerCase()));

    const navigate = (href: string) => {
        router.push(href);
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-zinc-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl"
                    >
                        {/* Search Input */}
                        <div className="flex items-center p-6 border-b border-white/5 gap-4">
                            <Search className="text-gray-400" size={20} />
                            <input
                                autoFocus
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white text-lg font-light outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-gray-400 font-mono">
                                <span>ESC</span>
                            </div>
                        </div>

                        {/* Actions List */}
                        <div className="p-2">
                            {actions.length > 0 ? (
                                actions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => navigate(action.href)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors">
                                            {action.icon}
                                            <span className="font-light">{action.label}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                            {action.shortcut}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500 font-light">
                                    No commands found for "{search}"
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 uppercase tracking-widest">
                            <div className="flex items-center gap-4">
                                <span>↑↓ Navigate</span>
                                <span>↵ Enter</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Command size={10} />
                                <span>K to toggle</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
