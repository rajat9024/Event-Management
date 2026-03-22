import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateAvailability = mutation({
    args: {
        vendorId: v.id("vendors"),
        date: v.number(), // Timestamp for midnight UTC
        status: v.union(v.literal("available"), v.literal("booked"), v.literal("unavailable")),
        eventId: v.optional(v.id("events")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const vendor = await ctx.db.get(args.vendorId);
        if (!vendor) throw new Error("Vendor not found");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user || vendor.userId !== user._id) throw new Error("Unauthorized");

        const existing = await ctx.db
            .query("vendorAvailability")
            .withIndex("by_vendor_date", (q) => q.eq("vendorId", args.vendorId).eq("date", args.date))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                status: args.status,
                eventId: args.eventId,
            });
        } else {
            await ctx.db.insert("vendorAvailability", {
                vendorId: args.vendorId,
                date: args.date,
                status: args.status,
                eventId: args.eventId,
            });
        }
    },
});

export const getVendorAvailability = query({
    args: { vendorId: v.id("vendors"), startDate: v.number(), endDate: v.number() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("vendorAvailability")
            .withIndex("by_vendor_date", (q) =>
                q.eq("vendorId", args.vendorId)
                    .gte("date", args.startDate)
                    .lte("date", args.endDate)
            )
            .collect();
    },
});
