"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Minus, Maximize2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AICompanion = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { role: "assistant", content: "Hello! I'm SpottAI. How can I help you today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            setAvailableVoices(voices);
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        let voices = availableVoices;
        if (voices.length === 0) {
            voices = window.speechSynthesis.getVoices();
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Robust "Sweet Voice" matching
        const sweetVoice = voices.find(v =>
            v.name.includes("Google UK English Female") ||
            v.name.includes("Microsoft Zira") ||
            v.name.includes("Samantha") ||
            v.name.includes("Emma") ||
            (v.name.toLowerCase().includes("female") && v.lang.includes("en"))
        ) || voices[0];

        if (sweetVoice) utterance.voice = sweetVoice;
        utterance.rate = 0.95;
        utterance.pitch = 1.25; // Slightly higher for sweeter tone

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const clearHistory = () => {
        setChat([{ role: "assistant", content: "Memory cleared! How can I help you starting fresh?" }]);
        stopSpeaking();
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = { role: "user", content: message };
        setChat((prev) => [...prev, userMessage]);
        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: chat.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                }),
            });

            const data = await response.json();
            if (data.text) {
                const assistantMessage = { role: "assistant", content: data.text };
                setChat((prev) => [...prev, assistantMessage]);
                speak(data.text);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setChat((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">SpottAI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearHistory}
                                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                                    title="Clear Conversation"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
                            {chat.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                        ? "bg-purple-600 text-white rounded-tr-none"
                                        : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-none"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-white/5 border-t border-white/5">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Ask SpottAI..."
                                    className="w-full bg-black/50 border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !message.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? "bg-white text-black rotate-90" : "bg-purple-600 text-white"
                    }`}
            >
                {isOpen ? <X size={32} /> : <Bot size={32} />}
            </motion.button>
        </div>
    );
};
