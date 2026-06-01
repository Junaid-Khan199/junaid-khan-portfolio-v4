"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function LogoCorner() {
    const [logoOpen, setLogoOpen] = useState(false)
    const [showLogo, setShowLogo] = useState(true)

    useEffect(() => {
        const handleScroll = () => {
            // Hide logo when scrolling past Hero section (approximately 100vh)
            const scrollPosition = window.scrollY
            setShowLogo(scrollPosition < window.innerHeight * 0.8)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            {logoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
                    <div className="relative w-full max-w-3xl h-full max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-700 bg-[#0d1117] shadow-2xl">
                        <button type="button" onClick={() => setLogoOpen(false)}
                            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 text-slate-100 hover:bg-slate-800 transition-colors">
                            ?
                        </button>
                        <div className="absolute inset-0 p-6">
                            <div className="relative h-full w-full rounded-[28px] overflow-hidden border border-slate-700 bg-[#0f1720]">
                                <Image src="/My_Logo.png" alt="Junaid Khan logo preview" fill className="object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <AnimatePresence>
                {showLogo && (
                    <motion.button 
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setLogoOpen(true)} 
                        aria-label="Open logo preview"
                        className="fixed z-40"
                        style={{ 
                            top: "50px", 
                            left: "50px", 
                            width: "400px", 
                            height: "400px", 
                            padding: 0, 
                            margin: 0, 
                            border: 0,
                            background: "transparent",
                            outline: "none",
                            cursor: "pointer"
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <div style={{ width: "100%", height: "100%", position: "relative" }} className="overflow-hidden">
                            <Image src="/My_Logo.png" alt="Junaid Khan logo" fill className="object-contain" />
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    )
}
