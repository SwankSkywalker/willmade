import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const LETTERS = ["W", "I", "L", "L", "M", "A", "D", "E"]

const HeroSection: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isInteracting, setIsInteracting] = useState(false)
    const containRef = useRef<HTMLDivElement | null>(null)
    const controls = useAnimation()

    // Track mouse movement
    const handleMouseMove = useCallback((e: MouseEvent) => {
        setIsInteracting(true)
        setMousePos({ x: e.clientX, y: e.clientY })
    }, [])

    // On mount, attach mouse  listener
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
            className="relative w-full h-screen bg-slate-200 overflow-hidden"
        >
            {/* Big abstract text container */}
            <div className="abosolute inset-0 flex items-center justify-center">
                <div className="relative w-[800px] h-[400px]">
                    {LETTERS.map((letter, idx) => (
                        <Letter
                            key={idx}
                            letter={letter}
                            mousePos={mousePos}
                            isInteracting={isInteracting}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HeroSection