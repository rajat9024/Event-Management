"use client";
export const dynamic = "force-dynamic";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    Send,
    Search,
    MoreVertical,
    Phone,
    Video,
    ArrowLeft,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export default function MessagesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const conversationId = searchParams.get("id");
    const scrollRef = useRef(null);

    const conversations = useQuery(api.chat.listConversations);
if (!conversations) return null;
    const messages = useQuery(
  api.chat.getMessages,
  conversationId ? { conversationId } : "skip"
);

if (conversationId && !messages) return null;
    const sendMessage = useMutation(api.chat.sendMessage);

    const [inputText, setInputText] = useState("");

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || !conversationId) return;

        await sendMessage({
            conversationId: conversationId,
            text: inputText,
        });
        setInputText("");
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const currentUser = useQuery(api.users.getCurrentUser);
    const activeConversation = conversations.find(c => c._id === conversationId);

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 h-full border border-white/10 bg-black/40 backdrop-blur-3xl rounded-3xl overflow-hidden shadow-2xl">

                <div className={`md:col-span-1 border-r border-white/5 flex flex-col ${conversationId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-white/5">
                        <h2 className="text-xl font-bold mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <Input placeholder="Search chats..." className="pl-10 bg-white/5 border-white/5 h-10" />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {conversations.map((c) => (
                                <button
                                    key={c._id}
                                    onClick={() => router.push(`/messages?id=${c._id}`)}
                                    className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${conversationId === c._id ? "bg-purple-600/20 border border-purple-500/30" : "hover:bg-white/5 border border-transparent"
                                        }`}
                                >
                                    <Avatar>
                                        <AvatarImage src={c.otherParticipant?.imageUrl} />
                                        <AvatarFallback className="bg-purple-900 text-purple-200">{c.otherParticipant?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 text-left overflow-hidden rounded-sm">
                                        <p className="font-bold truncate">{c.otherParticipant?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {c.lastMessageAt
  ? formatDistanceToNow(new Date(c.lastMessageAt))
  : ""} ago
                                        </p>
                                    </div>
                                </button>
                            ))}
                            {conversations.length === 0 && (
                                <div className="p-8 text-center text-gray-500 text-sm">No conversations yet.</div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className={`md:col-span-3 flex flex-col ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
                    {conversationId && activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="icon" onClick={() => router.push('/messages')} className="md:hidden">
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    <Avatar>
                                        <AvatarImage src={activeConversation.otherParticipant?.imageUrl} />
                                        <AvatarFallback className="bg-purple-900 text-purple-200">
                                            {activeConversation.otherParticipant?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold">{activeConversation.otherParticipant?.name}</p>
                                        <p className="text-xs text-green-500 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-white/5"><Phone size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-white/5"><Video size={18} /></Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-white/5"><MoreVertical size={18} /></Button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-6">
                                    {messages?.map((m, i) => {
                                        const isMe = currentUser?._id === m.senderId;
                                        return (
                                            <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] p-4 rounded-2xl ${isMe
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-white/5 border border-white/5 text-gray-200'
                                                    }`}>
                                                    <p className="text-sm">{m.text}</p>
                                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-purple-200' : 'text-gray-500'}`}>
                                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Chat Input */}
                            <div className="p-6 border-t border-white/5">
                                <form onSubmit={handleSend} className="flex gap-4">
                                    <Input
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-white/5 border-white/10 h-14 rounded-2xl px-6 focus:border-purple-500"
                                    />
                                    <Button type="submit" className="h-14 w-14 rounded-2xl bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20">
                                        <Send size={20} />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <div className="p-6 bg-purple-500/10 rounded-full">
                                <MessageSquare className="w-12 h-12 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold">Your Messages</h3>
                            <p className="text-gray-500 max-w-sm">Select a conversation from the sidebar to start chatting with your event partners.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
