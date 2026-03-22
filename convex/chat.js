import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreateConversation = mutation({
    args: { participantTwo: v.id("users") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) throw new Error("User not found");

        const participantOne = user._id;
        const participantTwo = args.participantTwo;

        // Sort to ensure unique pairs
        const [p1, p2] = participantOne < participantTwo
            ? [participantOne, participantTwo]
            : [participantTwo, participantOne];

        const existing = await ctx.db
            .query("conversations")
            .withIndex("by_participants", (q) => q.eq("participantOne", p1).eq("participantTwo", p2))
            .unique();

        if (existing) return existing._id;

        return await ctx.db.insert("conversations", {
            participantOne: p1,
            participantTwo: p2,
            lastMessageAt: Date.now(),
        });
    },
});

export const sendMessage = mutation({
    args: { conversationId: v.id("conversations"), text: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) throw new Error("User not found");

        const messageId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            senderId: user._id,
            text: args.text,
            createdAt: Date.now(),
        });

        await ctx.db.patch(args.conversationId, {
            lastMessageAt: Date.now(),
        });

        return messageId;
    },
});

export const getMessages = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .order("asc")
            .collect();
    },
});

export const listConversations = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) return [];

        const conversations1 = await ctx.db
            .query("conversations")
            .withIndex("by_participants", (q) => q.eq("participantOne", user._id))
            .collect();

        const conversations2 = await ctx.db
            .query("conversations")
            .withIndex("by_participants")
            .filter(q => q.eq(q.field("participantTwo"), user._id))
            .collect();

        const all = [...conversations1, ...conversations2].sort((a, b) => b.lastMessageAt - a.lastMessageAt);

        // Fetch other participant info
        return await Promise.all(all.map(async (c) => {
            const otherId = c.participantOne === user._id ? c.participantTwo : c.participantOne;
            const other = await ctx.db.get(otherId);
            return { ...c, otherParticipant: other };
        }));
    },
});
