"use client"

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import Letter from "./Letter";

const LETTERS = ["W", "I", "L", "L", "M", "A", "D", "E"]
const LETTER_SPACING =  75
const TOTAL_WIDTH = (LETTERS.length -1) * LETTER_SPACING // Distance from first to last

function getBasePosition(index: number) {
    const startX = -TOTAL_WIDTH / 2
    const x = startX + index * LETTER_SPACING
    const y = 0
    return { x, y }
}

export default function HeroSection() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isInteracting, setIsInteracting] = useState(false)
    const containRef = useRef<HTMLDivElement | null>(null)
    const controls = useAnimation()

    // Track mouse movement
    const handleMouseMove = useCallback((e: MouseEvent) => {
        setIsInteracting(true)
        setMousePos({ x: e.clientX, y: e.clientY })
    }, [])

    // On mount, attach mouse listener
    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [handleMouseMove])

    // Whenever user stops interacting for a while, revert the letters
    useEffect(() => {
        if (!isInteracting) return
        const timeout = setTimeout(() => {
            setIsInteracting(false)
        }, 2000) // e.g. 2 seconds of no movement => revert
        return () => clearTimeout(timeout)
    }, [mousePos, isInteracting])

    // Also revert if we scroll away from hero
    const handleScroll = () => {
        if (!containRef.current) return
        const rect = containRef.current.getBoundingClientRect()
        // If the hero is mostly off-screen, revert
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
            setIsInteracting(false)
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("sroll", handleScroll)
    }, [])

    return (
        <section
            ref={containRef}
            className="relative w-full h-screen bg-white flex items-center justify-center"
        >
            {/* Big abstract text container */}
            {/* <div className="abosolute inset-0 flex items-center justify-center">*/}
                <div className="relative w-[800px] h-[400px]">
                    {LETTERS.map((letter, index) => (
                        <Letter
                            key={index}
                            letter={letter}
                            /* index={index} */
                            mousePos={mousePos}
                            isInteracting={isInteracting}
                        />
                    ))}
                </div>
            {/* </div> */}
            {/* <h1 className="text-6xl text-white">WILLMADE</h1> */}
        </section>
    )
}

// Each letter: returns to a neat horizontal row if the mouse is away/not interacting
function AnimatedLetter({
    letter,
    index,
    mousePos,
    isInteracting,
}: {
    letter: string
    index: number
    mousePos: { x: number; y: number }
    isInteracting: boolean
}) {
    // Compute this letter's base position in the row
    const { x: baseX, y: baseY } = getBasePosition(index)

    // Simple "repel" effect.
    const maxDist = 150 // Distance within each letter moves away from mouse
    const forceFactor = 0.6 // how strongly it moves away

    // Calculate how close the mouse is to the letter's base pos
    // Approx the letter's center as center screen + baseX/baseY
    const screenCenterX = typeof window !== "undefined" ? window.innerWidth / 2 : 0
    const screenCenterY = typeof window !== "undefined" ? window.innerHeight / 2 : 0

    const dx = mousePos.x - (screenCenterX + baseX)
    const dy = mousePos.x - (screenCenterY + baseY)
    const dist = Math.sqrt(dx * dx + dy * dy)

    let offsetX = 0
    let offsetY = 0

    if (dist < maxDist && isInteracting) {
        const force = (maxDist - dist) / maxDist //0..1
        offsetX = -dx * force * forceFactor
        offsetY = -dy * force * forceFactor
    }

    return (
        <motion.div
            className="abosolute font-bold text-pink-500 select-none"
            initial={{
                x: baseX,
                y: baseY,
                fontSize: "9rem",
            }}
            animate={{
                // Move to the base pos plus any offset from mouse repulsion
                x: baseX + offsetX,
                y: baseY + offsetY,
                fontSize: "9rem",
                transition: { type: "spring", stiffness: 80, damping: 10 },
            }}
        >
            {letter}
        </motion.div>
    )
}
