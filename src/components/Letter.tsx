"use client"

import React, { useMemo } from "react";
import { motion } from "framer-motion"

interface LetterProps {
    letter: string
    mousePos: { x: number; y: number; }
    isInteracting: boolean
}

/**
 * A single letter that either stays in place or moves away
 * from the mouse pointer in a radial fashion.
 */
const Letter: React.FC<LetterProps> = ({ letter, mousePos, isInteracting }) => {
    // Each letter's "base" position
    // For a big blocky arrangement, we can position in a grid or a rough line.
    // E.g. index-based approach:
    const baseX = 200 * Math.random() - 100 // random -100...100
    const baseY = 100 * Math.random() - 50


    // The maximum distance at which the letter reacts
    const maxDist = 200

    // Determine how far the mouse is from the base position
    const [dx, dy] = useMemo(() => {
        // We need the letters actual pixel position; for a simpler approach,
        // we assume the hero is centered at the screen. A more robust approach
        // might measure actual offsets. We'll approximate here.
        const centerX = window.innerWidth / 2 + baseX
        const centerY = window.innerHeight / 2 + baseY
        const deltaX = mousePos.x - centerX
        const deltaY = mousePos.y - centerY
        return [deltaX, deltaY]
    }, [mousePos.x, mousePos.y, baseX, baseY])

    const dist = Math.sqrt(dx * dx + dy * dy)

    //If within maxDist, repel proportionally
    let offsetX = 0
    let offsetY = 0
    if (dist < maxDist && isInteracting) {
        const force = (maxDist - dist) / maxDist // 0..1
        // scale the offset  (dx, dy) by force, but in the opposite direction
        offsetX = -dx * force * 0.5
        offsetY = -dy * force * 0.5
    }

    return (
        <motion.div
            initial={{ x: baseX, y: baseY, fontSize: "8rem", color: "#ff69b4" }}
            animate={{
                x: baseX + offsetX,
                y: baseY + offsetY,
                fontSize: "12rem",
                color: "#ff69b4",
                transition: { type: "spring", stiffness: 500, damping: 15 }
            }}
            className="absolute font-bold select-none"
            style={{/* addtional styling */}}
        >
            {letter}
        </motion.div>
    )
}

export default Letter