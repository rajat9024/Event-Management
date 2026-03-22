"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CATEGORIES } from "@/lib/data";
import Autoplay from "embla-carousel-autoplay";
import EventCard from "@/components/event-card";

import { motion } from "framer-motion";

const ExplorePage = () => {
  const router = useRouter();
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  const { data: featuredEvents, isLoading: featuredEventsLoading } =
    useConvexQuery(api.explore.getFeaturedEvents, { limit: 3 });

  const { data: localEvents } =
    useConvexQuery(api.explore.getEventsByLocation, {
      city: currentUser?.location?.city || "Gurugram",
      state: currentUser?.location?.state || "Haryana",
      limit: 4
    });

  const { data: popularEvents } =
    useConvexQuery(api.explore.getPopularEvents, { limit: 6 });

  const { data: categoryCounts } = useConvexQuery(api.explore.getCategoryCounts);

  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/explore/${categoryId}`);
  };

  const handleViewLocalEvents = () => {
    const city = currentUser?.location?.city || "Gurugram";
    const state = currentUser?.location?.state || "Haryana";
    const slug = createLocationSlug(city, state);
    router.push(`/explore/${slug}`);
  };

  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: categoryCounts?.[cat.id] || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-2 space-y-12"
    >
      {/* Vibe Pulse: New Enhancement */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900/50 border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-purple-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center animate-pulse">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Spott Pulse</h2>
            <p className="text-gray-400 text-sm">Real-time attendance & trending vibes</p>
          </div>
        </div>
        <div className="relative z-10 flex gap-8">
          <div className="text-center">
            <span className="block text-2xl font-black text-white italic tracking-tighter">1.2k+</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Active Now</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-black text-purple-500 italic tracking-tighter">48</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">New Events</span>
          </div>
        </div>
      </div>

      <div className='pb-4 text-center'>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent'
        >
          Discover Events
        </motion.h1>
      </div>

      {/* Featured Events Section */}
      {featuredEvents && featuredEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event._id}>
                  <div
                    className="relative h-[450px] rounded-[3rem] overflow-hidden cursor-pointer border border-white/10 group"
                    onClick={() => handleEventClick(event.slug)}
                  >
                    {event.coverImage ? (
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover transform hover:scale-105 transition-transform duration-700"
                        priority
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: event.themeColor }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                      <Badge className="w-fit mb-4 bg-white/10 backdrop-blur-md border-white/20 text-white">
                        {event.city}, {event.state || event.country}
                      </Badge>
                      <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white tracking-tight">
                        {event.title}
                      </h2>
                      <p className="text-lg text-white/80 mb-4 max-w-2xl line-clamp-2 font-light">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-6 text-white/60">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {event.startDate ? (
                            <span>{format(new Date(event.startDate), "PPP")}</span>
                          ) : (
                            <span className="text-gray-400">Coming Soon</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-light">{event.registrationCount} registered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </motion.div>
      )}

      {/* Local Events */}
      {localEvents && localEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-1 tracking-tight">Events Near You</h2>
              <p className="text-muted-foreground text-sm font-light tracking-wide uppercase">
                Happening in {currentUser?.location?.city || "your area"}
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2 rounded-full border-gray-800 hover:bg-white hover:text-purple-400 cursor-pointer transition-all"
              onClick={handleViewLocalEvents}
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {localEvents.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative p-[1px] rounded-[2rem] bg-linear-to-b from-white/10 to-transparent hover:from-purple-500/50"
              >
                <div className="bg-zinc-950 rounded-[2rem] overflow-hidden">
                  <EventCard
                    event={event}
                    variant="grid"
                    onClick={() => handleEventClick(event.slug)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Browse by Category */}
      <div>
        <h2 className="text-3xl font-bold mb-8 tracking-tight">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoriesWithCounts.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className="group cursor-pointer bg-zinc-900/30 border-white/5 hover:border-purple-500/30 transition-all rounded-[2rem] overflow-hidden backdrop-blur-xl"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors">
                      {category.label}
                    </h3>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      {category.count} Event{category.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popular Events Section */}
      {popularEvents && popularEvents.length > 0 && (
        <div className="space-y-8">
          <div className="flex flex-col items-center text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Popular Across India</h2>
            <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Trending nationwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularEvents.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <EventCard
                  event={event}
                  variant="list"
                  onClick={() => handleEventClick(event.slug)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* NEW: Elite Organizers Section */}
      <div className="space-y-8 py-6 border-y border-white/5 ">
        <div className="flex flex-col items-center text-center space-y-4">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 px-4 py-1">Elite 0.1%</Badge>
          <h2 className="text-5xl font-black italic tracking-tighter uppercase">Elite Organizers</h2>
          <p className="text-gray-500 max-w-xl">Meet the visionaries behind the most exclusive events on Spott.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center space-y-4 hover:border-purple-500/50 transition-all cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full bg-linear-to-tr from-purple-500 to-emerald-500 mx-auto p-1">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-4xl">👤</div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Vibe Master #{i}</h3>
                <p className="text-[10px] text-gray-500 uppercase font-black">20+ Events Hosted</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExplorePage
