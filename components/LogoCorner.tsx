"use client"
import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

export function LogoCorner() {
    const [logoOpen, setLogoOpen] = useState(false)

    return (
        <>
            {logoOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
                    <div className="relative w-full max-w-3xl h-full max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-700 bg-[#0d1117] shadow-2xl">
                        <button type="button" onClick={() => setLogoOpen(false)}
                            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 text-slate-100 hover:bg-slate-800 transition-colors">
                            ✕
                        </button>
                        <div className="absolute inset-0 p-6">
                            <div className="relative h-full w-full rounded-[28px] overflow-hidden border border-slate-700 bg-[#0f1720]">
                                <Image src="/My_Logo.png" alt="Junaid Khan logo preview" fill className="object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <motion.button onClick={() => setLogoOpen(true)} aria-label="Open logo preview"
                className="fixed top-0 left-0 z-40 p-0 m-0"
                style={{ width: '100px', height: '100px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <div style={{ width: '100%', height: '100%', position: 'relative' }} className="overflow-hidden">
                    <Image src="/My_Logo.png" alt="Junaid Khan logo" fill className="object-contain" />
                </div>
            </motion.button>
        </>
    )
}
