"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Building,
    MapPin,
    ArrowRight,
    DollarSign,
    Info,
    Type
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { useForm } from "react-hook-form";

export default function VendorOnboardingPage() {
    const router = useRouter();
    const createVendor = useMutation(api.vendors.createVendor);
    const { mutate: updateVendor } = useConvexMutation(api.vendors.updateVendor);
    const [loading, setLoading] = useState(false);
const { data: vendor } = useConvexQuery(api.vendors.getVendorByUserId);
const { setValue } = useForm()

useEffect(() => {
  if (vendor) {
    setValue("name", vendor.name || "");
    setValue("bio", vendor.bio || "");
    setValue("city", vendor.city || "");
    setValue("category", vendor.category || "");
  }
}, [vendor]);

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        category: "",
        city: "",
        state: "",
        country: "India",
        basePrice: "",
    });

   const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.category) {
    toast.error("Please select a category");
    return;
  }

  setLoading(true);

  try {
    const payload = {
      name: formData.name,
      bio: formData.bio,
      category: formData.category,
      location: {
        city: formData.city,
        state: formData.state,
        country: formData.country,
      },
      basePrice: Number(formData.basePrice) || 0,
    };
if (vendor) {
      await updateVendor({
        vendorId: vendor._id, // ✅ FIX
        ...payload,
      });
      toast.success("Vendor profile updated ✅");
    } else {
      // ✅ CREATE
      await createVendor(payload);
      toast.success("Vendor profile created 🚀");
    }

    router.push("/vendor");

  } catch (err) {
    toast.error("Failed: " + err.message);
  } finally {
    setLoading(false); // ✅ FIXED
  }
};

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card className="border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden">
                    <div className="h-2 bg-linear-to-r from-pink-500 via-purple-500 to-orange-500" />

                    <CardHeader className="space-y-1 pb-8">
                        <div className="p-3 bg-purple-500/20 w-fit rounded-2xl mb-4">
                            <Building className="w-8 h-8 text-purple-400" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-500">
                            Become a Spott Vendor
                        </CardTitle>
                        <CardDescription className="text-gray-400 text-lg">
                            Set up your professional profile and start reaching thousands of event organizers.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Business Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Type className="w-4 h-4 text-purple-400" />
                                    Business / Stage Name
                                </label>
                                <Input
                                    required
                                    placeholder="e.g. Majestic Decorators or DJ Vibe"
                                    className="bg-white/5 border-white/10 focus:border-purple-500 transition-all h-12"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Category & Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Building className="w-4 h-4 text-purple-400" />
                                        Category
                                    </label>
                                    <Select onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-12">
                                            <SelectValue placeholder="Select service category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10">
                                            <SelectItem value="Decorator">Decorator</SelectItem>
                                            <SelectItem value="DJ">DJ</SelectItem>
                                            <SelectItem value="Caterer">Caterer</SelectItem>
                                            <SelectItem value="Photographer">Photographer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-purple-400" />
                                        Starting Price ($)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="299"
                                        className="bg-white/5 border-white/10 h-12"
                                        value={formData.basePrice}
                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Info className="w-4 h-4 text-purple-400" />
                                    Business Bio / Experience
                                </label>
                                <Textarea
                                    required
                                    rows={4}
                                    placeholder="Tell potential clients what makes your service unique..."
                                    className="bg-white/5 border-white/10 focus:border-purple-500 transition-all"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-purple-400" />
                                        City
                                    </label>
                                    <Input
                                        required
                                        placeholder="Mumbai"
                                        className="bg-white/5 border-white/10 h-12"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-purple-400" />
                                        State / Province
                                    </label>
                                    <Input
                                        placeholder="Maharashtra"
                                        className="bg-white/5 border-white/10 h-12"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 text-lg font-bold bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg shadow-purple-500/20 group"
                            >
                                {loading ? "Creating Profile..." : "Launch Vendor Profile"}
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <p className="text-center text-xs text-gray-500">
                                By clicking "Launch", you agree to Spott's terms of service and vendor guidelines.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
