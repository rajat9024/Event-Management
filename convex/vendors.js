import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createVendor = mutation({
    args: {
        name: v.string(),
        bio: v.string(),
        category: v.union(
            v.literal("Decorator"),
            v.literal("DJ"),
            v.literal("Caterer"),
            v.literal("Photographer")
        ),
        imageUrl: v.optional(v.string()),
        location: v.object({
            city: v.string(),
            state: v.optional(v.string()),
            country: v.string(),
        }),
        basePrice: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) throw new Error("User not found");

        const vendorId = await ctx.db.insert("vendors", {
            userId: user._id,
            ...args,
            rating: 0,
            reviewCount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return vendorId;
    },
});

export const updateVendor = mutation({
    args: {
        vendorId: v.id("vendors"),
        name: v.optional(v.string()),
        bio: v.optional(v.string()),
        category: v.optional(v.union(
            v.literal("Decorator"),
            v.literal("DJ"),
            v.literal("Caterer"),
            v.literal("Photographer")
        )),
        imageUrl: v.optional(v.string()),
        location: v.optional(v.object({
            city: v.string(),
            state: v.optional(v.string()),
            country: v.optional(v.string()),
        })),
        basePrice: v.optional(v.number()),
    },
    
    handler: async (ctx, args) => {
        const { vendorId, ...updates } = args;
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const vendor = await ctx.db.get(vendorId);
        if (!vendor) throw new Error("Vendor not found");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user || vendor.userId !== user._id) throw new Error("Unauthorized");

        await ctx.db.patch(vendorId, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});

export const deleteUser = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();

    if (!user) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", user.subject))
      .first();

    if (!existing) throw new Error("User not found");

    await ctx.db.delete(existing._id);

    return { success: true };
  },
});

export const getVendorByUserId = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) return null;

        return await ctx.db
            .query("vendors")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .unique();
    },
});

export const getVendorById = query({
    args: { vendorId: v.id("vendors") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.vendorId);
    },
});

export const listVendors = query({
    args: { category: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (args.category) {
            return await ctx.db
                .query("vendors")
                .withIndex("by_category", (q) => q.eq("category", args.category))
                .order("desc")
                .collect();
        }
        return await ctx.db.query("vendors").order("desc").collect();
    },
});
