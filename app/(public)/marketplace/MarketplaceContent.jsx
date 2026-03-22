"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import {
    Search,
    MapPin,
    Star,
    Filter,
    Music,
    Camera,
    Utensils,
    Paintbrush
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

const categories = [
    { name: "All", icon: Filter },
    { name: "Decorator", icon: Paintbrush },
    { name: "DJ", icon: Music },
    { name: "Caterer", icon: Utensils },
    { name: "Photographer", icon: Camera },
];

const MOCK_VENDORS = [
    {
        _id: "mock1",
        name: "Neon Rhythm DJs",
        category: "DJ",
        location: { city: "Mumbai", state: "Maharashtra" },
        rating: 4.9,
        bio: "Premium electronic music experience with state-of-the-art sound and lighting systems. Specialized in high-energy raves and corporate events.",
        imageUrl: "data:image/webp;base64,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",
        basePrice: "500"
    },
    {
        _id: "mock2",
        name: "Artisan Blooms & Decor",
        category: "Decorator",
        location: { city: "Delhi", state: "NCR" },
        rating: 4.8,
        bio: "Transforming spaces into dreamscapes. We specialize in luxury floral arrangements and immersive thematic event decor.",
        imageUrl: "https://th.bing.com/th/id/OIP.BR16gImgMO3kUxh3XnCo-gHaLV?w=89&h=89&c=1&rs=1&qlt=70&r=0&o=7&dpr=1.5&pid=InlineBlock&rm=3",
        basePrice: "300"
    },
    {
        _id: "mock3",
        name: "Gourmet Gala Catering",
        category: "Caterer",
        location: { city: "Bangalore", state: "Karnataka" },
        rating: 4.7,
        bio: "Exquisite culinary journeys. From traditional delicacies to modern fusion, we bring a world of flavors to your table.",
        imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
        basePrice: "1000"
    },
    {
        _id: "mock4",
        name: "Lumina Vision Studio",
        category: "Photographer",
        location: { city: "Udaipur", state: "Rajasthan" },
        rating: 5.0,
        bio: "Capturing souls, not just poses. Professional event photography and cinematography for weddings and luxury retreats.",
        imageUrl: "https://th.bing.com/th/id/OIP.hnTjBSnZK8TNyqeKV6M9ZQHaDt?w=302&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
        basePrice: "450"
    },
];

export default function MarketplacePage() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState("");

    // Sync selectedCategory with searchParams if it changes via nav
    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) setSelectedCategory(cat);
    }, [searchParams]);

    const remoteVendors = useQuery(api.vendors.listVendors, {
        category: selectedCategory === "All" ? undefined : selectedCategory
    });

    // Use mock vendors if remote ones aren't available yet or are empty
    const vendors = (remoteVendors && remoteVendors.length > 0) ? remoteVendors :
        (selectedCategory === "All" ? MOCK_VENDORS : MOCK_VENDORS.filter(v => v.category === selectedCategory));

    const filteredVendors = vendors?.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-pink-500 via-purple-500 to-orange-500 mb-4">
                    Vendor Marketplace
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Find the perfect professionals to make your event unforgettable.
                    From stunning decor to soulful beats, we've got it all.
                </p>
            </motion.div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <Button
                            key={cat.name}
                            variant={selectedCategory === cat.name ? "default" : "outline"}
                            className={`rounded-full px-6 py-6 border-white/10 transition-all duration-300 ${selectedCategory === cat.name
                                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                : "hover:bg-white/5 bg-black/40 backdrop-blur-xl"
                                }`}
                            onClick={() => setSelectedCategory(cat.name)}
                        >
                            <Icon className="w-5 h-5 mr-2" />
                            {cat.name}
                        </Button>
                    );
                })}
            </div>

            {/* Vendor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredVendors?.map((vendor, index) => (
                        <motion.div
                            key={vendor._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/marketplace/${vendor._id}`}>
                                <Card className="group relative overflow-hidden h-full border-white/10 bg-gray-800 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-500">
                                    <div className="aspect-video relative overflow-hidden">
                                        <Image
                                            src={vendor.imageUrl || "/hero.png"}
                                            alt={vendor.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <Badge className="absolute top-4 right-4 bg-purple-500 backdrop-blur-md border-white/10">
                                            {vendor.category}
                                        </Badge>
                                    </div>

                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-xl rounded-sm font-bold group-hover:text-purple-400 transition-colors">
                                                    {vendor.name}
                                                </CardTitle>
                                                <div className="flex items-center text-sm text-gray-400 mt-1">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {vendor.location.city}, {vendor.location.state}
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-purple-500/20 px-2 py-1 rounded text-purple-400 text-sm font-bold">
                                                <Star className="w-3 h-3 mr-1 fill-purple-400" />
                                                {vendor.rating.toFixed(1)}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-sm rounded-sm text-gray-300 line-clamp-2">
                                            {vendor.bio}
                                        </p>
                                    </CardContent>

                                    <CardFooter className="border-t border-white/5 pt-4 flex justify-between items-center">
                                        <div className="text-sm text-gray-400">
                                            Starts from <span className="text-white font-bold ml-1">${vendor.basePrice || "0"}</span>
                                        </div>
                                        <Button size="sm" variant="ghost" className="text-purple-400 hover:text-purple-300">
                                            View Profile
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {vendors?.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <p className="text-gray-500 text-lg italic">No vendors found in this category yet.</p>
                    </div>
                )}

                {!vendors && (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-96 w-full bg-white/5 animate-pulse rounded-2xl" />
                    ))
                )}
            </div>
        </div>
    );
}