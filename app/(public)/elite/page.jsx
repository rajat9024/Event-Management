"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Shield, Users, MapPin } from "lucide-react";
import Image from "next/image";

const ElitePage = () => {
    const organizers = [
        { name: "Vikram Malhotra", specialized: "Techno Raves", events: 42, score: 9.8, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400" },
        { name: "Sarah Jenkins", specialized: "Tech Summits", events: 15, score: 9.9, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400" },
        { name: "Elena Rossi", specialized: "Art Galas", events: 28, score: 9.7, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" },
        { name: "Marcus Thorne", specialized: "VIP Lounges", events: 56, score: 9.6, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400" },
    ];

    return (
        <div className="min-h-screen pb-32 pt-20">
            <div className="max-w-7xl mx-auto px-6 space-y-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-12 border-b border-white/5 pb-12">
                    <div className="space-y-6 max-w-2xl">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-[0.4em] font-black px-4 py-1">The 0.1% List</Badge>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white leading-none">ELITE ORGANIZERS</h1>
                        <p className="text-gray-500 text-lg">Every organizer on this list has a minimum rating of 9.5 and has hosted over 10 verified Spott events. They are the true masters of the vibe.</p>
                    </div>
                    <div className="flex gap-8">
                        <div className="text-center">
                            <span className="block text-4xl font-black italic text-white leading-none">124</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2 block">Total Masters</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-4xl font-black italic text-purple-500 leading-none">9.8</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-2 block">Avg. Score</span>
                        </div>
                    </div>
                </div>

                {/* Organizer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {organizers.map((org, i) => (
                        <motion.div
                            key={org.name}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="group relative bg-zinc-900/40 p-1 rounded-[3rem] border border-white/5 hover:border-emerald-500/30 transition-all overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row gap-8 p-8 items-center sm:items-stretch">
                                <div className="relative w-40 h-40 rounded-[2rem] overflow-hidden border-2 border-white/10 group-hover:border-emerald-500/50 transition-colors">
                                    <Image src={org.image} alt={org.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-2 text-center sm:text-left">
                                    <div>
                                        <h2 className="text-3xl font-black italic text-white uppercase group-hover:text-emerald-400 transition-colors">{org.name}</h2>
                                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">Specialized in {org.specialized}</p>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-6 mt-6">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-emerald-500" />
                                            <span className="text-sm font-bold text-gray-300">{org.events} Verified</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Crown size={14} className="text-purple-500" />
                                            <span className="text-sm font-bold text-gray-300">{org.score} Score</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Background Decorative */}
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity">
                                <Crown size={64} className="text-emerald-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Global Network Section */}
                <div className="relative h-[500px] rounded-[4rem] bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent animate-pulse" />
                    </div>
                    <div className="relative z-10 text-center space-y-6 px-6">
                        <MapPin size={48} className="mx-auto text-emerald-500" />
                        <h3 className="text-5xl font-black italic text-white uppercase tracking-tighter">GLOBAL NETWORK</h3>
                        <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed font-light">
                            Our organizers operate across 12 countries, ensuring the Spott vibe is consistent from <span className="text-white font-bold">Berlin</span> to <span className="text-white font-bold">Bangalore</span>.
                        </p>
                        <div className="flex gap-4 justify-center pt-8 grayscale opacity-50">
                            <span className="text-xs font-black tracking-widest italic border border-white/20 px-4 py-2 rounded-full">LONDON</span>
                            <span className="text-xs font-black tracking-widest italic border border-white/20 px-4 py-2 rounded-full">NEW YORK</span>
                            <span className="text-xs font-black tracking-widest italic border border-white/20 px-4 py-2 rounded-full">TOKYO</span>
                            <span className="text-xs font-black tracking-widest italic border border-white/20 px-4 py-2 rounded-full">DELHI</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElitePage;
