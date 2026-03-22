"use client";

import { useParams, useRouter } from "next/navigation";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  DollarSign,
  Map as MapIcon,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const COLORS = ["#8b5cf6", "#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

export default function SimulationPage() {
  const params = useParams();
  const eventId = params.slug;
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

 const eventQuery = useConvexQuery(api.events.getEventById, { eventId });
const simulationQuery = useConvexQuery(
  api.simulations.getSimulationByEventId,
  { eventId }
);

const event = eventQuery?.data;
const simulation = simulationQuery?.data;

  const { mutate: generateSimulation } = useConvexMutation(
    api.simulations.generateSimulation
  );

  // 🔥 DEBUG LOGS
  console.log("===== DEBUG =====");
  console.log("eventId:", eventId);
  console.log("event:", event);
  console.log("simulation:", simulation);
  console.log("isGenerating:", isGenerating);

  // 🔥 AUTO GENERATE
  useEffect(() => {
    if (event && !simulation && !isGenerating) {
      console.log("🚀 Auto generating simulation...");
      handleGenerate("realistic");
    }
  }, [event, simulation]);

  const handleGenerate = async (scenario = "realistic") => {
    console.log("⚡ Generating simulation start...");
    setIsGenerating(true);

    try {
      await generateSimulation({ eventId, scenario });
      console.log("✅ Simulation created successfully");
      toast.success(`${scenario} simulation generated!`);
    } catch (err) {
      console.error("❌ Error generating simulation:", err);
      toast.error("Failed to generate simulation");
    } finally {
      setIsGenerating(false);
    }
  };

  // 🟡 EVENT LOADING
  if (eventQuery?.isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin w-10 h-10" />
        <p>Loading Event...</p>
      </div>
    );
  }

  // 🟡 GENERATING STATE
  if (isGenerating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Sparkles className="w-12 h-12 animate-pulse" />
        <p>Generating Simulation...</p>
      </div>
    );
  }

  // 🔴 NO SIMULATION
  if (!simulation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>No Simulation Found</p>

        <Button onClick={() => handleGenerate("realistic")}>
          Generate Simulation
        </Button>
      </div>
    );
  }

  // ✅ SAFE DATA
  const {
    crowdFlow = [],
    heatmapData = [],
    budgetBreakdown = [],
    risks = [],
    successProbability = 0,
    trafficDensity = 0,
  } = simulation;

  const peakCrowd = crowdFlow.length
    ? Math.max(...crowdFlow.map((c) => c.count || 0))
    : 0;

  return (
    <div className="min-h-screen p-10 space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <Button onClick={() => router.back()}>
          <ArrowLeft />
        </Button>

        <div className="flex gap-6">
          <div>{successProbability}% Success</div>
          <div>{trafficDensity}% Traffic</div>
          <div>{peakCrowd} Peak</div>
        </div>
      </div>

      {/* CROWD FLOW */}
      <Card>
        <CardHeader>
          <CardTitle>Crowd Flow</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {crowdFlow.length === 0 ? (
            <p>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={crowdFlow}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area dataKey="count" stroke="#8b5cf6" fill="#8b5cf6" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* HEATMAP */}
      <Card>
        <CardHeader>
          <CardTitle>Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-64 bg-gray-900">
            {heatmapData.map((p, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 bg-red-500 rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* BUDGET */}
      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {budgetBreakdown.length === 0 ? (
            <p>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={budgetBreakdown} dataKey="value">
                  {budgetBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* RISKS */}
      <Card>
        <CardHeader>
          <CardTitle>Risks</CardTitle>
        </CardHeader>
        <CardContent>
          {risks.length === 0 ? (
            <p>No risks</p>
          ) : (
            risks.map((r, i) => (
              <div key={i}>
                <strong>{r.name}</strong> - {r.level}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}