import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addReview = mutation({
    args: {
        vendorId: v.id("vendors"),
        rating: v.number(),
        comment: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) throw new Error("User not found");

        // Add the review
        await ctx.db.insert("vendorReviews", {
            vendorId: args.vendorId,
            authorId: user._id,
            authorName: user.name,
            rating: args.rating,
            comment: args.comment,
            createdAt: Date.now(),
        });

        // Update vendor's average rating
        const vendor = await ctx.db.get(args.vendorId);
        if (vendor) {
            const newReviewCount = vendor.reviewCount + 1;
            const newRating = (vendor.rating * vendor.reviewCount + args.rating) / newReviewCount;

            await ctx.db.patch(args.vendorId, {
                rating: newRating,
                reviewCount: newReviewCount,
            });
        }
    },
});

export const getVendorReviews = query({
    args: { vendorId: v.id("vendors") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("vendorReviews")
            .withIndex("by_vendor", (q) => q.eq("vendorId", args.vendorId))
            .order("desc")
            .collect();
    },
});
