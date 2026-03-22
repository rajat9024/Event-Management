import { query } from "./_generated/server";

export const dumpEvents = query({
    handler: async (ctx) => {
        const events = await ctx.db.query("events").collect();
        return events.map(e => `${e._id} | ${e.slug} | ${e.title}`).join("\n");
    },
});
