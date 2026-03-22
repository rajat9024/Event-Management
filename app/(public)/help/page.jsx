"use client";

import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, FileText, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
    const sections = [
        {
            title: "Getting Started",
            icon: <HelpCircle className="w-6 h-6 text-purple-400" />,
            content: "Learn how to create your first event, customize your profile, and start discovering experiences."
        },
        {
            title: "Safety & Privacy",
            icon: <Shield className="w-6 h-6 text-emerald-400" />,
            content: "We take your security seriously. Read about our encryption protocols and community guidelines."
        },
        {
            title: "Account Management",
            icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
            content: "Need help with your subscription or account settings? Our support team is here 24/7."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400 mb-4">
                    How can we help?
                </h1>
                <p className="text-gray-400 text-lg">
                    Everything you need to know about using the Spott platform.
                </p>
            </motion.div>

            <div className="grid gap-6">
                {sections.map((section, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                            <CardHeader className="flex flex-row items-center gap-4">
                                {section.icon}
                                <CardTitle className="text-xl font-bold text-white">{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 font-light leading-relaxed">
                                    {section.content}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
