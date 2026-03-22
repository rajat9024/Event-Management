/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { State, City } from "country-state-city";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import UnsplashImagePicker from "@/components/unsplash-image-picker";
import AIEventCreator from "./_components/ai-event-creator";
import UpgradeModal from "../../../components/upgrade-model"
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";

// HH:MM in 24h
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
  endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
  locationType: z.enum(["physical", "online"]).default("physical"),
  venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticketType: z.enum(["free", "paid"]).default("free"),
  ticketPrice: z.number().optional(),
  coverImage: z.string().optional(),
  themeColor: z.string().default("#1e3a8a"),
});

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { mutate: createEvent, isLoading } = useConvexMutation(api.events.createEvent);
  const { mutate: generateSimulation } = useConvexMutation(api.simulations.generateSimulation);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: { themeColor: "#1e3a8a", capacity: 50, ticketType: "free" }
  });

  const themeColor = watch("themeColor");
  const coverImage = watch("coverImage");

  const onSubmit = async (data) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const {
      startTime,
      endTime,
      ...cleanData
    } = data;
    try {
      const start = new Date(data.startDate);
      const [sh, sm] = data.startTime.split(":");
      start.setHours(sh, sm);

      const end = new Date(data.endDate);
      const [eh, em] = data.endTime.split(":");
      end.setHours(eh, em);

      const eventId = await createEvent({
        ...cleanData,
        startDate: start.getTime(),
        endDate: end.getTime(),
        tags: [data.category],
        country: "India",
        timezone,
        hasPro
      });

      toast.success("Vibe created! 👽");
      router.push(`/my-events/${eventId}`);
    } catch (e) { toast.error(e.message); }
  };

  console.log("ERRORS:", errors);
  const steps = [
    { title: "The Concept", icon: "✨" },
    { title: "Vibe Details", icon: "📍" },
    { title: "Social Controls", icon: "👥" }
  ];

  return (
    <div className="min-h-screen py-20 px-4 md:px-20 transition-all duration-1000" style={{ backgroundColor: `${themeColor}22` }}>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Wizard Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic">Phase {step}</h1>
            <p className="text-purple-400 font-bold uppercase tracking-[0.3em] text-xs">Initialize Your Event Vibe</p>
          </div>
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <div key={i} className={`h-1 w-12 rounded-full transition-all duration-500 ${step > i ? "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "bg-white/10"}`} />
            ))}
          </div>
          <AIEventCreator onEventGenerated={(d) => {
            Object.keys(d).forEach(k => setValue(k, d[k]));
            toast.success("AI Logic Injected! ⚡");
          }} />
        </header>

        {/* Global Cover Preview */}
        <motion.div
          onClick={() => setShowImagePicker(true)}
          className="relative h-64 md:h-96 w-full rounded-[3rem] overflow-hidden border border-white/10 bg-zinc-900/50 group cursor-pointer"
        >
          {coverImage ? (
            <Image src={coverImage} alt="Vibe Cover" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <Sparkles size={24} className="text-white" />
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Inject Visual Vibe</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-black italic tracking-tighter text-4xl">CHANGE VIEW</span>
          </div>
        </motion.div>

        {/* Form Wizard */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[4rem] p-8 md:p-16 shadow-2xl space-y-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest text-purple-400  font-black">Title of the Vibe</Label>
                  <Input {...register("title")} className="text-4xl md:text-6xl font-black bg-transparent border-none pl-2 h-20 focus-visible:ring-0 text-white placeholder:text-white/10" placeholder="NAME YOUR EVENT" />
                  {errors.title && <p className="text-red-500 text-xs font-bold italic">{errors.title.message}</p>}
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase tracking-widest text-purple-400 font-black">Category</Label>
                  <Controller control={control} name="category" render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => (
                        <button key={cat.id} type="button" onClick={() => field.onChange(cat.id)} className={`px-6 py-3 rounded-full border transition-all text-sm font-bold ${field.value === cat.id ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-gray-400 hover:border-purple-500"}`}>
                          {cat.icon} {cat.label}
                        </button>
                      ))}
                    </div>
                  )} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-10"
              >
                {/* Description */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                    Vibe Description
                  </Label>
                  <Textarea
                    {...register("description")}
                    placeholder="DESCRIBE YOUR EVENT VIBE..."
                    className="bg-white/5 border border-white/10 rounded-2xl text-white min-h-[120px]"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs font-bold">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                      Start Date
                    </Label>
                    <Input
                      type="date"
                      {...register("startDate", { valueAsDate: true })}
                      className="bg-white/5 border-white/10 h-14 rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                      End Date
                    </Label>
                    <Input
                      type="date"
                      {...register("endDate", { valueAsDate: true })}
                      className="bg-white/5 border-white/10 h-14 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Time */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      {...register("startTime")}
                      className="bg-white/5 border-white/10 h-14 rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                      End Time
                    </Label>
                    <Input
                      type="time"
                      {...register("endTime")}
                      className="bg-white/5 border-white/10 h-14 rounded-2xl"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                    Location Core
                  </Label>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                    City
                  </Label>
                  <Input
                    {...register("city")}
                    placeholder="CHOOSE YOUR CITY"
                    className="text-3xl font-black bg-transparent border-b border-white/10 rounded-sm p-2 h-auto focus-visible:ring-0 placeholder:text-white/10"
                  />
                  <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                    State
                  </Label>
                  <Input
                    {...register("state")}
                    placeholder="CHOOSE YOUR STATE"
                    className="text-3xl font-black bg-transparent border-b border-white/10 rounded-sm p-2 h-auto focus-visible:ring-0 placeholder:text-white/10"
                  />
                </div>
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">Human Capacity</Label>
                    <Input type="number" {...register("capacity", { valueAsNumber: true })} className="bg-transparent text-3xl font-black border-none p-2 focus-visible:ring-0" />
                  </div>
                  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                      Ticket Type
                    </Label>

                    <div className="flex gap-4">
                      {["free", "paid"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setValue("ticketType", type)}
                          className={`flex-1 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all ${watch("ticketType") === type
                            ? "bg-purple-600 text-white"
                            : "bg-white/5 text-gray-500 hover:bg-white/10"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {/* ✅ Show only when Paid is selected */}
                    {watch("ticketType") === "paid" && (
  <div className="mt-4">
    <Label className="text-[10px] font-black uppercase tracking-widest text-purple-400">
      Ticket Price
    </Label>

    <input
      type="number"
      placeholder="Enter price"
      {...register("ticketPrice", {
        valueAsNumber: true,
        required: watch("ticketType") === "paid",
        min: {
          value: 1,
          message: "Price must be at least 1",
        },
      })}
      className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-purple-500"
    />

    {errors.ticketPrice && (
      <p className="text-red-500 text-xs mt-1">
        {errors.ticketPrice.message}
      </p>
    )}
  </div>
)}
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-10 rounded-[2.5rem] bg-white text-black text-2xl font-black italic tracking-tighter hover:bg-purple-500 cursor-pointer hover:text-white transition-all"
                >
                  {isLoading ? "INITIATING..." : "GENERATE VIBE"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between pt-8 border-t border-white/5">
            <Button type="button" variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)} className="text-gray-500 uppercase tracking-widest font-black text-[10px] cursor-pointer  italic">REVERSE</Button>
            {step < 3 && <Button type="button" onClick={() => setStep(step + 1)} className="bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-full px-8 font-black cursor-pointer uppercase tracking-widest text-[10px]">ADVANCE PHASE</Button>}
          </div>
        </form>
      </div>

      {/* Overlays */}
      {showImagePicker && <UnsplashImagePicker isOpen onSelect={(u) => { setValue("coverImage", u); setShowImagePicker(false); }} onClose={() => setShowImagePicker(false)} />}
    </div>
  );
}
