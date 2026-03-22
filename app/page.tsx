"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from 'next/link';
import { motion } from "framer-motion";
import { FeaturesSection, SpottPulse, StatsSection } from "@/components/home-sections";
import { ChevronRight, Sparkles } from "lucide-react";
import { Magnetic } from "@/components/magnetic";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const headingWords = "Discover & create extraordinary events.".split(" ");

  return (
    <div className="flex flex-col min-h-screen mesh-gradient ">
      {/* Hero Section */}
      <section className="pt-10 pb-20 relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2 animate-pulse delay-700" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800 text-gray-400 text-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Event platform for the future</span>
              <div className="w-1 h-1 rounded-full bg-gray-700" />
              <span className="text-purple-400 font-medium">Coming soon</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[0.9] tracking-tighter text-white">
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="inline-block mr-4 last:mr-0"
                >
                  {word === "extraordinary" ? (
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-400 to-orange-400">
                      {word}
                    </span>
                  ) : word}
                </motion.span>
              ))}
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl font-light leading-relaxed mx-auto lg:mx-0">
              Host memorable experiences or find your next adventure. Spott is the ultimate tool for event creators and seekers.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Magnetic strength={0.2}>
                <Link href="/explore">
                  <Button size="lg" className="rounded-full px-10 py-7 h-auto text-xl bg-white text-black hover:bg-gray-200 group transition-all duration-300">
                    Explore Events
                    <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link href="/create-event">
                  <Button size="lg" variant="outline" className="rounded-full px-10 py-7 h-auto text-xl border-gray-700 hover:bg-gray-900/50 hover:border-gray-500 transition-all">
                    Host an Event
                  </Button>
                </Link>
              </Magnetic>
            </div>
          </motion.div>

          {/* Right Content - Animated Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-gray-800 shadow-2xl shadow-blue-500/10">
              <Image
                src="/hero.gif"
                alt="Hero Animation"
                width={800}
                height={800}
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>

            {/* Decorative Floating Cards (Visual trick with Divs) */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 rounded-3xl -z-10"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 w-40 h-40 bg-linear-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 rounded-3xl -z-10"
            />
          </motion.div>
        </div>
      </section>

      {/* Spott Pulse - Live Analytics */}
      <SpottPulse />

      {/* Vendor Marketplace Preview */}
      <section className="py-24 relative overflow-hidden px-6">
        <div className="max-w-7xl mx-auto bg-transparent p-12 md:p-20 grid lg:grid-cols-2 gap-16 items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-purple-500/5 -z-10" />
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/20 mb-6 px-4 py-1">Network Expansion</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              A Complete <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-orange-500 uppercase italic">Marketplace</span> for your Events
            </h2>
            <p className="text-xl text-gray-400 mb-8 font-light leading-relaxed">
              Don't just host events, build them with the best. Hire top-rated DJs, photographers, and caterers directly through the Spott Decentralized Marketplace.
            </p>
            <div className="space-y-4 mb-10">
              {[
                "Real-time node availability synced globally",
                "Direct neural messaging with providers",
                "On-chain verified ratings and reviews",
                "Unified project management protocol"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-sm font-light text-gray-400">{item}</span>
                </div>
              ))}
            </div>
            <Link href="/marketplace">
              <Button size="lg" className="rounded-full px-12 py-8 bg-white text-black hover:bg-gray-200 font-bold italic uppercase tracking-tighter">
                Browse Marketplace
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Visual cards representing categories */}
            {[
              { name: "DJs", img: "https://images.unsplash.com/photo-1571266028243-3716f0267d2e?q=80&w=400&auto=format&fit=crop", color: "from-blue-500" },
              { name: "Decor", img: "https://images.unsplash.com/photo-1519225495806-7ad3779e27c0?q=80&w=400&auto=format&fit=crop", color: "from-purple-500" },
              { name: "Catering", img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=400&auto=format&fit=crop", color: "from-orange-500" },
              { name: "Photo", img: "https://images.unsplash.com/photo-1520856629106-ac95624c718a?q=80&w=400&auto=format&fit=crop", color: "from-pink-500" },
            ].map((cat, i) => (
              <div key={i} className={`relative aspect-square rounded-3xl overflow-hidden border border-white/10 group shadow-2xl ${i % 2 !== 0 ? 'mt-8' : ''}`}>
                <Image src={cat.img} alt={cat.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-60" />
                <div className={`absolute inset-0 bg-linear-to-t ${cat.color} to-transparent opacity-40 group-hover:opacity-60 transition-opacity`} />
                <div className="absolute bottom-4 left-4 font-bold text-xl">{cat.name}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-24 rounded-[4rem] bg-transparent border border-white/5 relative overflow-hidden"
          >
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter mb-8 text-white leading-none transition-all">Ready to start your <br /> next <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-emerald-400">big thing?</span></h2>
            <p className="text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto tracking-normal">Join thousands of creators who use Spott to manage their most professional events.</p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-16 py-10 h-auto text-2xl bg-purple-600 hover:bg-purple-500 text-white shadow-2xl shadow-purple-500/25 transition-all font-bold active:scale-95">
                Join Now
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Background glow for CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] -z-10" />
      </section>
    </div>
  );
}
