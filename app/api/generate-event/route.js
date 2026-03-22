import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const systemPrompt = `You are an event planning assistant. Generate event details based on the user's description.
    
    CRITICAL: Return ONLY valid JSON block.
    
    Return this exact JSON structure:
    {
      "title": "Catchy event title",
      "description": "Informative description (2-3 sentences)",
      "category": "one of: tech, music, sports, art, food, business, health, education, gaming, networking, outdoor, community",
      "suggestedCapacity": 50,
      "suggestedTicketType": "free"
    }`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User's event idea: ${prompt}` }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const eventData = JSON.parse(text);

    return NextResponse.json(eventData);
  } catch (error) {
    console.error("Groq Event Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate event" },
      { status: 500 }
    );
  }
}