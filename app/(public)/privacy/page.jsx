"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert max-w-none"
            >
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400 mb-8">
                    Privacy Policy
                </h1>

                <section className="space-y-6">
                    <p className="text-gray-400 text-lg font-light leading-relaxed">
                        Last updated: March 7, 2026
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8">1. Information We Collect</h2>
                    <p className="text-gray-400 font-light leading-relaxed">
                        We collect information you provide directly to us when you create an account, create an event, or communicate with us.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8">2. How We Use Your Information</h2>
                    <p className="text-gray-400 font-light leading-relaxed">
                        We use the information we collect to provide, maintain, and improve our services, and to develop new ones.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-8">3. Data Security</h2>
                    <p className="text-gray-400 font-light leading-relaxed">
                        We use industry-standard encryption protocols to protect your data across our decentralized network.
                    </p>
                </section>
            </motion.div>
        </div>
    );
}
