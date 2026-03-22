"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    MapPin,
    MessageSquare,
    Calendar,
    ChevronRight,
    ArrowLeft,
    DollarSign,
    User,
    Quote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Image from "next/image";

export default function VendorDetailPage() {
    const { vendorId } = useParams();
    const router = useRouter();
    const vendor = useQuery(api.vendors.getVendorById, { vendorId: vendorId });
    const reviews = useQuery(api.reviews.getVendorReviews, { vendorId: vendorId });
    const getOrCreateConversation = useMutation(api.chat.getOrCreateConversation);

    const [activeTab, setActiveTab] = useState("about");

    const handleContact = async () => {
        if (!vendor) return;
        try {
            const conversationId = await getOrCreateConversation({ participantTwo: vendor.userId });
            router.push(`/messages?id=${conversationId}`);
        } catch (err) {
            toast.error("Failed to start conversation");
        }
    };


    if (!vendor) return <div className="h-screen flex items-center justify-center font-bold text-2xl animate-pulse">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-8 hover:bg-white/5 text-gray-400"
            >
                <ArrowLeft className="w-5 h-5 mr-1 cursor-pointer" /> Back to Marketplace
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Side: Profile & Sticky Actions */}
                <div className="lg:col-span-1 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Card className="border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden sticky top-32">
                            <div className="aspect-square relative">
                                <Image
                                    src={vendor.imageUrl || "/spott.png"}
                                    alt={vendor.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black via-black/40 to-transparent">
                                    <h1 className="text-3xl font-bold">{vendor.name}</h1>
                                    <Badge className="mt-2 bg-purple-600/80">{vendor.category}</Badge>
                                </div>
                            </div>

                            <CardContent className="p-6 space-y-6">
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="text-center">
                                        <div className="text-xl font-bold flex items-center justify-center text-purple-400">
                                            <Star className="w-4 h-4 mr-1 fill-purple-400" />
                                            {vendor.rating.toFixed(1)}
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Rating</div>
                                    </div>
                                     
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-green-400">${vendor.basePrice}</div>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">Starting</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Button onClick={handleContact} className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-lg font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                        <MessageSquare className="w-5 h-5 mr-2" /> Message Vendor
                                    </Button>
                                    <Button variant="outline" className="w-full h-14 border-white/10 bg-white/5 text-lg font-bold">
                                        <Calendar className="w-5 h-5 mr-2" /> Check Availability
                                    </Button>
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-3">
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                                        {vendor.location.city}, {vendor.location.state}
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <User className="w-4 h-4 mr-3 text-purple-400" />
                                        Service Provider since {new Date(vendor.createdAt).getFullYear()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Right Side: Details, Portfolio, Reviews */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Tabs */}
                    <div className="flex gap-8 border-b border-white/10 pb-4">
                        {["about"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-lg font-medium transition-colors relative ${activeTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <motion.div layoutId="tab-underline" className="absolute -bottom-[17px] left-0 right-0 h-1 bg-purple-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="min-h-[400px]"
                    >
                        {activeTab === "about" && (
                            <div className="space-y-8">
                                <section className="space-y-4">
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        <Quote className="w-6 h-6 text-purple-400 rotate-180" />
                                        About the Service
                                    </h3>
                                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                                        {vendor.bio}
                                    </p>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-2xl font-bold">Location & Reach</h3>
                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-500 text-sm uppercase">Base Location</p>
                                                <p className="text-xl font-bold">{vendor.location.city}, {vendor.location.state}</p>
                                            </div>
                                            <div className="p-4 bg-purple-500/10 rounded-full">
                                                <MapPin className="w-8 h-8 text-purple-400" />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
