"use client";

import { motion } from "framer-motion";
import { Search, Calendar, Ticket, BarChart3, Users, Zap, Globe, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Image from "next/image";

export const StatsSection = () => {
    const stats = [
        { label: "Active Events", value: "10k+", icon: <Calendar className="w-5 h-5 text-blue-400" /> },
        { label: "Community Members", value: "50k+", icon: <Users className="w-5 h-5 text-purple-400" /> },
        { label: "Tickets Sold", value: "200k+", icon: <Ticket className="w-5 h-5 text-orange-400" /> },
        { label: "Global Reach", value: "24", icon: <Globe className="w-5 h-5 text-emerald-400" /> },
    ];

    return (
        <section className="py-20 relative px-6 border-5 border-red">
            <div className="max-w-7xl mx-auto bg-transparent p-12 relative overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    whileHover={{ rotate: 15, scale: 1.1 }}
                                    className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-500"
                                >
                                    {stat.icon}
                                </motion.div>
                            </div>
                            <div className="text-4xl font-extrabold mb-2 text-white italic tracking-tighter">{stat.value}</div>
                            <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const FeatureCard = ({ icon, title, description, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-8 rounded-3xl bg-transparent border border-white/5 hover:border-purple-500/50 transition-all group"
        >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
            <p className="text-gray-400 font-light leading-relaxed">{description}</p>
        </motion.div>
    );
};

export const FeaturesSection = () => {
    const features = [
        {
            icon: <Search className="w-8 h-8" />,
            title: "AI Discovery",
            description: "Our neural network analyzes your preferences to suggest events you'll actually love.",
            className: "md:col-span-2 md:row-span-2 bg-transparent",
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Instant Launch",
            description: "From idea to live in 60 seconds.",
            className: "md:col-span-1 md:row-span-1 border-white/5",
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure Node",
            description: "Encrypted ticketing on the edge.",
            className: "md:col-span-1 md:row-span-1 border-white/5",
        },
        {
            icon: <BarChart3 className="w-10 h-10" />,
            title: "Live Analytics Engine",
            description: "Deep insights into attendee behavior and conversion funnels with real-time heatmaps.",
            className: "md:col-span-2 md:row-span-1 bg-white/5",
        },
    ];

    return (
        <section className="py-32 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter"
                        >
                            The Next <span className="text-gray-500 italic">Evolution</span> <br />
                            of Event Management.
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-gray-400 text-xl max-w-sm font-light leading-relaxed mb-4"
                    >
                        A suite of high-performance tools designed for the modern creator economy.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            className={`p-8 rounded-[2.5rem] border border-white/5 bg-transparent flex flex-col justify-between group transition-all duration-500 ${feature.className}`}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-black transition-all duration-500">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2 text-white group-hover:tracking-tight transition-all">{feature.title}</h3>
                                <p className="text-gray-400 font-light leading-relaxed text-lg">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const SpottPulse = () => {
    const feeds = [
        {
            id: 1,
            event: "Neon Nights Rave",
            location: "Mumbai, IN",
            activity: "500+ tickets sold in last hour",
            time: "2m ago",
            image: "https://images.unsplash.com/photo-1514525253361-bee8718a7439?q=80&w=200&auto=format&fit=crop",
            status: "Trending"
        },
        {
            id: 2,
            event: "Zen Garden Retreat",
            location: "Udaipur, IN",
            activity: "New 5-star review received",
            time: "15m ago",
            image: "https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=200&auto=format&fit=crop",
            status: "verified"
        },
        {
            id: 3,
            event: "Tech Summit 2026",
            location: "Bangalore, IN",
            activity: "Capacity reached (2000 attendees)",
            time: "45m ago",
            image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=200&auto=format&fit=crop",
            status: "Sold Out"
        },
    ];

    const metrics = [
        { label: "Network Load", value: "89.4%", color: "text-purple-400" },
        { label: "Active Nodes", value: "4,201", color: "text-blue-400" },
        { label: "Sync Speed", value: "12ms", color: "text-emerald-400" },
    ];

    return (
        <section className="py-24 relative overflow-hidden px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Visualizer */}
                    <div className="relative aspect-square max-w-xl mx-auto w-full">
                        {/* Recursive Pulse Rings */}
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: [0, 0.2, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: i * 1.3 }}
                                className="absolute inset-0 border border-purple-500/20 rounded-full"
                            />
                        ))}

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-2/3 h-2/3">
                                {/* Simulated Global Nodes */}
                                {[
                                    { t: "10%", l: "20%" }, { t: "30%", l: "70%" },
                                    { t: "60%", l: "15%" }, { t: "80%", l: "60%" },
                                    { t: "40%", l: "40%" }, { t: "20%", l: "85%" }
                                ].map((pos, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                        className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"
                                        style={{ top: pos.t, left: pos.l }}
                                    />
                                ))}
                                {/* Center Core */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-white/5 rounded-full backdrop-blur-3xl border border-white/10 flex items-center justify-center">
                                        <div className="w-4 h-4 bg-white rounded-full animate-ping" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Metrics Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 gap-4">
                            {metrics.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="p-4 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl text-center"
                                >
                                    <div className="text-[10px] font-black uppercase tracking-tighter text-gray-500 mb-1">{m.label}</div>
                                    <div className={`text-xl font-bold tracking-tighter ${m.color}`}>{m.value}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Content & Feed */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <Badge className="bg-white/5 text-white border-white/10 py-2 px-4 italic font-bold tracking-tighter">LIVE NETWORK FEED</Badge>
                            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85]">
                                The Pulse of <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-blue-400 to-emerald-400">Atmosphere.</span>
                            </h2>
                            <p className="text-gray-400 text-xl font-light leading-relaxed max-w-xl">
                                Real-time activity synchronization across the Spott Decentralized Network. Witness experiences being born in every corner of the world.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {feeds.map((feed, i) => (
                                <motion.div
                                    key={feed.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-6 p-4 rounded-[2rem] bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                                >
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                                        <Image src={feed.image} alt={feed.event} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-white text-lg font-bold truncate tracking-tight uppercase italic">{feed.event}</h4>
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-full">{feed.status}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 font-light">
                                            <span>{feed.location}</span>
                                            <div className="w-1 h-1 rounded-full bg-gray-700" />
                                            <span className="text-gray-300 italic">{feed.activity}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};
