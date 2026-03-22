import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    // Clerk auth
    email: v.string(),
    tokenIdentifier: v.string(), // Clerk user ID for auth
    name: v.string(),
    imageUrl: v.optional(v.string()),

    // Onboarding
    hasCompleteOnboarding: v.boolean(),

    // Attendee preferences (from onboarding)
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.optional(v.string()), // Added state field
        country: v.string(),
      })
    ),
    interests: v.optional(v.array(v.string())), // Min 3 categories

    // Organizer tracking (User Subscription)
    freeEventsCreated: v.number(), // Track free event limit (1 free)

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]), // Primary auth lookup

  // Events table
  events: defineTable({
    title: v.string(),
    description: v.string(),
    slug: v.string(),

    // Organizer
    organizerId: v.id("users"),
    organizerName: v.string(),

    // Event details
    category: v.string(),
    tags: v.array(v.string()),

    // Date & Time
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),

    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    timezone: v.string(),

    // Location
    locationType: v.union(v.literal("physical"), v.literal("online")),
    venue: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.string(),
    state: v.optional(v.string()), // Added state field
    country: v.string(),

    // Capacity & Ticketing
    capacity: v.number(),
    ticketType: v.union(v.literal("free"), v.literal("paid")),
    ticketPrice: v.optional(v.number()), // Paid at event offline
    registrationCount: v.number(),

    // Customization
    coverImage: v.optional(v.string()),
    themeColor: v.optional(v.string()),

    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organizer", ["organizerId"])
    .index("by_category", ["category"])
    .index("by_start_date", ["startDate"])
    .index("by_slug", ["slug"])
    .searchIndex("search_title", { searchField: "title" }),

  // Registrations/Tickets
  registrations: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),

    // Attendee info
    attendeeName: v.string(),
    attendeeEmail: v.string(),

    // QR Code for entry
    qrCode: v.string(), // Unique ID for QR

    // Check-in
    checkedIn: v.boolean(),
    checkedInAt: v.optional(v.number()),

    // Status
    status: v.union(v.literal("confirmed"), v.literal("cancelled")),

    registeredAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_user", ["eventId", "userId"])
    .index("by_qr_code", ["qrCode"]),

  // Vendor Marketplace
  vendors: defineTable({
    userId: v.id("users"), // The user who owns this vendor profile
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
    rating: v.number(), // Average rating
    reviewCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_category", ["category"])
    .index("by_rating", ["rating"]),

  vendorReviews: defineTable({
    vendorId: v.id("vendors"),
    authorId: v.id("users"),
    authorName: v.string(),
    rating: v.number(),
    comment: v.string(),
    createdAt: v.number(),
  })
    .index("by_vendor", ["vendorId"])
    .index("by_author", ["authorId"]),

  vendorAvailability: defineTable({
    vendorId: v.id("vendors"),
    date: v.number(), // Timestamp for the day (e.g., midnight UTC)
    status: v.union(v.literal("available"), v.literal("booked"), v.literal("unavailable")),
    eventId: v.optional(v.id("events")), // If booked for a specific event
  })
    .index("by_vendor", ["vendorId"])
    .index("by_vendor_date", ["vendorId", "date"]),

  // Messaging System
  conversations: defineTable({
    participantOne: v.id("users"),
    participantTwo: v.id("users"),
    lastMessageAt: v.number(),
  })
    .index("by_participants", ["participantOne", "participantTwo"])
    .index("by_last_message", ["lastMessageAt"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_created_at", ["createdAt"]),

  // AI Event Simulation ("Event Digital Twin")
  simulations: defineTable({
    eventId: v.id("events"),
    crowdFlow: v.array(
      v.object({
        time: v.string(),
        count: v.number(),
      })
    ),
    budgetBreakdown: v.array(
      v.object({
        category: v.string(),
        value: v.number(),
      })
    ),
    risks: v.array(
      v.object({
        name: v.string(),
        level: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
        description: v.string(),
      })
    ),
    profitEstimation: v.object({
      revenue: v.number(),
      expenses: v.number(),
      net: v.number(),
    }),
    successProbability: v.optional(v.number()),
    trafficDensity: v.optional(v.number()),
    heatmapData: v.array(
      v.object({
        x: v.number(),
        y: v.number(),
        intensity: v.number(),
      })
    ),
    scenario: v.optional(v.union(v.literal("realistic"), v.literal("optimistic"), v.literal("pessimistic"))),
    createdAt: v.number(),
  }).index("by_event", ["eventId"]),
});