"use client";

import { Calendar, MapPin, Users, Trash2, X, QrCode, Eye } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";

export default function EventCard({
  event,
  onClick,
  onDelete,
  variant = "grid", // "grid" or "list"
  action = null, // "event" | "ticket" | null
  className = "",
}) {
  // List variant (compact horizontal layout)
  if (variant === "list") {
    return (
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          className={`py-0 group cursor-pointer border-gray-800 bg-gray-950 text-white hover:shadow-lg transition-all hover:border-purple-500/50 ${className}`}
          onClick={onClick}
        >
          <CardContent className="p-3 flex gap-3">
            {/* Event Image */}
            <div className="w-20 h-20 shrink-0 overflow-hidden relative">
              {event.coverImage ? (
                <Image
                  src={event.coverImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-3xl"
                  style={{ backgroundColor: event.themeColor }}
                >
                  {getCategoryIcon(event.category)}
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold rounded-sm text-sm mb-1 group-hover:text-purple-400 transition-colors line-clamp-2">
                {event.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-1 font-light">
                {format(new Date(event.startDate), "EEE, dd MMM, HH:mm")}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 font-light">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">
                  {event.locationType === "online" ? "Online Event" : event.city}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-light">
                <Users className="w-3 h-3" />
                <span>{event.registrationCount} attending</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid variant (default - original design)
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card
        className={`overflow-hidden border-gray-800 bg-gray-950 text-white pb-1 group pt-0 rounded-3xl ${onClick ? "cursor-pointer hover:shadow-2xl transition-all hover:border-purple-500/50" : ""} ${className}`}
        onClick={onClick}
      >
        <div className="relative h-48 overflow-hidden">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              width={500}
              height={192}
              priority
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ backgroundColor: event.themeColor }}
            >
              {getCategoryIcon(event.category)}
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge className="bg-black/50 backdrop-blur-md border-white/10 text-white">
              {event.ticketType === "free" ? "Free" : "Paid"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <Badge variant="secondary" className="mb-3 bg-purple-500/10 text-purple-400 border-none">
              {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
            </Badge>
            <h3 className="font-bold text-xl rounded-sm line-clamp-2 group-hover:text-purple-400 transition-colors">
              {event.title}
            </h3>
          </div>

          <div className="space-y-2 text-sm text-gray-400 font-light">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>
                {event?.startDate
                  ? format(new Date(event.startDate), "PPP")
                  : "Date not available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="line-clamp-1">
                {event.locationType === "online"
                  ? "Online Event"
                  : `${event.city}, ${event.state || event.country}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>
                {event.registrationCount} / {event.capacity} registered
              </span>
            </div>
          </div>

          {action && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="flex-1 gap-2 rounded-full bg-white text-black hover:bg-gray-200 transition-all font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.(e);
                }}
              >
                {action === "event" ? (
                  <>
                    <Eye className="w-4 h-4" />
                    View
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    Show Ticket
                  </>
                )}
              </Button>

              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-800 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(event._id);
                  }}
                >
                  {action === "event" ? (
                    <Trash2 className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
