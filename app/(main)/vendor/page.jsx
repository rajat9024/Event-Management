"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import {
    BarChart3,
    Calendar as CalendarIcon,
    Settings,
    Star,
    Users,
    Timer,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format, startOfDay } from "date-fns";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { useRouter } from "next/navigation";


export default function VendorDashboardPage() {
    const vendor = useQuery(api.vendors.getVendorByUserId);
    const updateAvailability = useMutation(api.availability.updateAvailability);
    const router = useRouter();
    const { mutate: deleteUser, isLoading } = useConvexMutation(api.users.deleteUser);

    const [selectedDate, setSelectedDate] = useState(new Date());

    // Fetch availability for the current month
    const availability = useQuery(api.availability.getVendorAvailability,
        vendor ? {
            vendorId: vendor._id,
            startDate: startOfDay(new Date()).getTime(),
            endDate: startOfDay(new Date(2026, 11, 31)).getTime()
        } : "skip"
    );

    const handleToggleAvailability = async (status) => {
        if (!vendor) return;
        try {
            await updateAvailability({
                vendorId: vendor._id,
                date: startOfDay(selectedDate).getTime(),
                status: status,
            });
            toast.success(`Date marked as ${status}`);
        } catch (err) {
            toast.error("Failed to update availability");
        }
    };

    if (vendor === undefined) return <div className="p-20 text-center animate-pulse">Loading dashboard...</div>;
    if (vendor === null) return <div className="p-20 text-center">Please complete onboarding first.</div>;

    const bookedDates = availability?.filter(a => a.status === "booked").map(a => new Date(a.date)) || [];
    const unavailableDates = availability?.filter(a => a.status === "unavailable").map(a => new Date(a.date)) || [];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-500">
                        Welcome back, {vendor.name}
                    </h1>
                    <p className="text-gray-400 mt-2">Manage your marketplace presence and bookings.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="border-white/10 bg-purple/5 cursor-pointer"
                        onClick={() => router.push("/vendor/onboarding")} >
                        <Settings className="w-4 h-4 mr-2" /> Edit Profile
                    </Button>
                    <Button
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20 cursor-pointer"
                        onClick={async () => {
                            const confirmDelete = window.confirm(
                                "Are you sure? This will permanently delete your profile."
                            );

                            if (!confirmDelete) return;

                            try {
                                await deleteUser();
                                toast.success("Profile deleted 🗑️");

                                // 👉 redirect after delete
                                router.push("/");

                            } catch (err) {
                                toast.error(err.message);
                            }
                        }}
                    >
                        {isLoading ? "Deleting..." : "Delete Profile"}
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                    { label: "Total Rating", value: vendor.rating.toFixed(1), icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                    { label: "Reviews", value: vendor.reviewCount, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Active Bookings", value: bookedDates.length, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "Profile Views", value: "1.2k", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
                ].map((stat, i) => (
                    <Card key={i} className="border-white/5 bg-white/5 backdrop-blur-xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Availability Calendar */}
                <Card className="lg:col-span-2 border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-purple-400" />
                            Availability Calendar
                        </CardTitle>
                        <CardDescription>Click a date to manage your availability status.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-12">
                            <div className="flex-1">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-2xl border border-white/10 p-4 w-full bg-white/5"
                                    modifiers={{
                                        booked: bookedDates,
                                        unavailable: unavailableDates,
                                    }}
                                    modifiersStyles={{
                                        booked: { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid #22c55e' },
                                        unavailable: { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444' },
                                    }}
                                />
                            </div>
                            <div className="w-full md:w-64 space-y-6">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <Timer className="w-4 h-4" />
                                        {format(selectedDate, "MMM dd, yyyy")}
                                    </h4>
                                    <div className="space-y-3">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleToggleAvailability("available")}
                                            className="w-full justify-start border-white/10 hover:bg-green-500/10 hover:text-green-500"
                                        >
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Available
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleToggleAvailability("unavailable")}
                                            className="w-full justify-start border-white/10 hover:bg-red-500/10 hover:text-red-500"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" /> Mark Unavailable
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h5 className="text-xs font-bold text-gray-500 uppercase">Legend</h5>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500" /> Booked by Client
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500" /> Blocked by You
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Tips / Notifications */}
                <div className="space-y-6">
                    <Card className="border-white/5 bg-linear-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-purple-400" />
                                Quick Tip
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Vendors with updated calendars receive 3x more inquiries. Keep your dates current to boost your visibility!
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/5 bg-black/40 backdrop-blur-3xl">
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    "New inquiry from Sarah J.",
                                    "Payout of $540 processed",
                                    "5-star review from Alex Blue",
                                ].map((activity, i) => (
                                    <div key={i} className="flex gap-3 text-sm text-gray-400 items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                                        {activity}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
