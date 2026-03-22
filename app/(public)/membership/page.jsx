"use client";

import { motion } from "framer-motion";
import { Check, Shield, Zap, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MembershipPage = () => {
    const tiers = [
        {
            name: "Standard",
            price: "FREE",
            icon: <Star className="text-gray-400" />,
            features: ["Browse public events", "AI Assistant access", "Basic profile"],
            color: "bg-zinc-900/50"
        },
        {
            name: "Elite",
            price: "$29/mo",
            icon: <Crown className="text-yellow-500" />,
            features: ["Private Rave access", "Priority booking", "Elite badge", "Ad-free vibe"],
            color: "bg-purple-600/20",
            featured: true
        },
        {
            name: "Master",
            price: "$99/mo",
            icon: <Shield className="text-indigo-400" />,
            features: ["0.1% List access", "Dedicated host manager", "Unlimited free raves", "Global VIP access"],
            color: "bg-indigo-600/20"
        }
    ];

    return (
        <div className="min-h-screen pb-32 pt-20">
            <div className="max-w-7xl mx-auto px-6 space-y-24">
                {/* Hero */}
                <div className="text-center space-y-6">
                    <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase tracking-[0.3em] font-black px-6 py-2">The Membership</Badge>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white leading-none">CHOOSE YOUR VIBE</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">Join the most exclusive event community on the planet. Curated by AI, experienced by you.</p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`relative rounded-[3rem] p-12 border ${tier.featured ? 'border-purple-500' : 'border-white/10'} ${tier.color} backdrop-blur-3xl overflow-hidden group`}
                        >
                            {tier.featured && (
                                <div className="absolute top-0 right-0 bg-purple-500 px-6 py-2 rounded-bl-3xl text-[10px] font-black italic tracking-widest text-white">BEST SELLER</div>
                            )}

                            <div className="space-y-6 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
                                    {tier.icon}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic text-white uppercase">{tier.name}</h2>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-white">{tier.price}</span>
                                        {tier.price !== 'FREE' && <span className="text-gray-500 font-bold uppercase text-[10px]">Per Month</span>}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/5">
                                    {tier.features.map(feature => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                                <Check size={12} />
                                            </div>
                                            <span className="text-gray-300 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button className={`w-full h-16 rounded-full font-black italic text-lg tracking-tight mt-8 ${tier.featured ? 'bg-purple-500 text-white' : 'bg-white text-black hover:bg-gray-200'}`}>
                                    INITIALIZE {tier.name.toUpperCase()}
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ/Trust */}
                <div className="pt-20 text-center">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Curated for the Elite</p>
                    <div className="flex flex-wrap justify-center gap-12 mt-8 opacity-30 grayscale saturate-0">
                        <span className="text-3xl font-black italic">MASTERCARD</span>
                        <span className="text-3xl font-black italic">STRIPE</span>
                        <span className="text-3xl font-black italic">APPLE PAY</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembershipPage;
