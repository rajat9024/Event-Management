"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const InteractiveGrid = () => {
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const dx = useSpring(mouseX, springConfig);
    const dy = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-20 overflow-hidden bg-black pointer-events-none"
        >
            {/* Base Grid */}
            <div className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #333 1px, transparent 0)`,
                    backgroundSize: "40px 40px"
                }}
            />

            {/* Glow Effect */}
            <motion.div
                className="absolute w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px]"
                style={{
                    left: dx,
                    top: dy,
                    transform: "translate(-50%, -50%)",
                }}
            />

            <motion.div
                className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]"
                style={{
                    left: dx,
                    top: dy,
                    transform: "translate(-30%, -30%)",
                }}
            />
        </div>
    );
};
