import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    try {
        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Format history for Groq (OpenAI-like format)
        const messages = [
            {
                role: "system",
                content: `You are SpottAI, the advanced virtual companion for Spott, an elite event management platform. 
        You are helpful, professional, and tech-savvy. 
        You help users discover events, explain how to create events, and provide insights about the platform.
        Keep your responses concise and engaging.`
            },
            ...(history || []).map(m => ({
                role: m.role === "assistant" ? "assistant" : "user",
                content: m.content
            })),
            { role: "user", content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
        });

        const text = completion.choices[0]?.message?.content || "";

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Groq Chat error:", error);
        return NextResponse.json({ error: "Failed to communicate with AI" }, { status: 500 });
    }
}
