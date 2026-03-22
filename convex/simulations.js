import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateSimulation = mutation({
  args: {
    eventId: v.id("events"),
    scenario: v.optional(
      v.union(
        v.literal("realistic"),
        v.literal("optimistic"),
        v.literal("pessimistic")
      )
    ),
  },

  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) throw new Error("Event not found");

    const scenario = args.scenario || "realistic";

    // 🧹 Remove old simulation
    const existing = await ctx.db
      .query("simulations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .unique();

    if (existing) await ctx.db.delete(existing._id);

    const baseCapacity = event.capacity || 200;
    const category = event.category || "General";

    // 🎯 Scenario multipliers (more balanced)
    const multipliers = {
      optimistic: { crowd: 1.25, revenue: 1.2, risk: 0.4 },
      realistic: { crowd: 0.9, revenue: 1.0, risk: 0.6 },
      pessimistic: { crowd: 0.6, revenue: 0.75, risk: 0.85 },
    };

    const m = multipliers[scenario];
    const peakCapacity = Math.floor(baseCapacity * m.crowd);

    // =========================
    // ✅ 1. REALISTIC CROWD FLOW (12 hours + smooth curve)
    // =========================
    const crowdFlow = Array.from({ length: 12 }).map((_, i) => {
      let factor;

      if (i < 3) factor = 0.3;         // early
      else if (i < 6) factor = 0.7;    // buildup
      else if (i < 9) factor = 1.2;    // peak
      else factor = 0.5;               // decline

      const noise = 0.85 + Math.random() * 0.3;

      return {
        time: `${12 + i}:00`,
        count: Math.floor(peakCapacity * factor * noise),
      };
    });

    // =========================
    // ✅ 2. SMART HEATMAP (stage-centric crowd)
    // =========================
    const heatmapData = Array.from({ length: 40 }).map(() => {
      const isNearStage = Math.random() > 0.5;

      return {
        x: isNearStage ? 40 + Math.random() * 20 : Math.random() * 100,
        y: isNearStage ? 40 + Math.random() * 20 : Math.random() * 100,
        intensity: isNearStage
          ? 0.6 + Math.random() * 0.4
          : 0.2 + Math.random() * 0.4,
      };
    });

    // =========================
    // ✅ 3. BUDGET (dynamic by category)

    const costPerPerson =
      category === "Concert" ? 1800 :
      category === "Clubbing" ? 1500 :
      700;

    const totalBudget = baseCapacity * costPerPerson;

    const budgetBreakdown = [
      { name: "Venue", value: Math.floor(totalBudget * 0.35) },
      { name: "Talent", value: Math.floor(totalBudget * 0.25) },
      { name: "Marketing", value: Math.floor(totalBudget * 0.2) },
      { name: "Operations", value: Math.floor(totalBudget * 0.2) },
    ];

    const risks = [
      {
        name: "Overcrowding",
        level: peakCapacity > baseCapacity ? "high" : "medium",
        description:
          peakCapacity > baseCapacity
            ? "Peak crowd exceeds planned capacity"
            : "Manageable crowd levels",
      },
      {
        name: "Traffic",
        level: scenario === "pessimistic" ? "high" : "medium",
        description: "Entry/exit congestion expected",
      },
      {
        name: "Weather",
        level: Math.random() < m.risk ? "medium" : "low",
        description: "Possible weather fluctuations",
      },
    ];

    const revenue = Math.floor(
      peakCapacity *
      (event.ticketPrice || 1000) *
      m.revenue
    );

    const expenses = totalBudget;
    const net = revenue - expenses;

    const profitEstimation = { revenue, expenses, net };

    const successProbability = Math.min(
      95,
      Math.max(
        40,
        Math.floor(
          60 +
          (scenario === "optimistic" ? 20 : scenario === "pessimistic" ? -25 : 5) +
          (net > 0 ? 10 : -10) +
          Math.random() * 10
        )
      )
    );

    const trafficDensity = Math.min(
      95,
      Math.max(
        20,
        Math.floor(
          50 +
          (scenario === "optimistic" ? 30 : scenario === "pessimistic" ? -20 : 10) +
          Math.random() * 10
        )
      )
    );

    return await ctx.db.insert("simulations", {
      eventId: args.eventId,
      crowdFlow,
      heatmapData,
      budgetBreakdown,
      risks,
      profitEstimation,
      successProbability,
      trafficDensity,
      scenario,
      createdAt: Date.now(),
    });
  },
});