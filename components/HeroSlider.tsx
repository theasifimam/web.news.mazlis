"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroItem {
    id: string;
    tag: string;
    title: string;
    desc: string;
    img: string;
    author: string;
    slug: string;
}

const HERO_DATA: HeroItem[] = [
    {
        id: '01',
        tag: 'FEATURED INVESTIGATION',
        title: 'THE ARCHITECTURE OF ENTROPY.',
        desc: 'Exploring the decaying digital infrastructures that still power the modern financial core.',
        img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop',
        author: 'MARCUS THORNE',
        slug: 'architecture-of-entropy'
    },
    {
        id: '02',
        tag: 'TECHNICAL REPORT',
        title: 'THE QUIET TECHNICAL REVOLUTION.',
        desc: 'Beneath the surface of consumer tech, a fundamental shift in infrastructure is occurring.',
        img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
        author: 'ELARA VANCE',
        slug: 'the-quiet-technical-revolution'
    },
    {
        id: '03',
        tag: 'SYSTEMS ANALYSIS',
        title: 'FOUNDATIONS OF CONSENSUS.',
        desc: 'A deep dive into the mathematical proof of social agreement within distributed networks.',
        img: 'https://images.unsplash.com/photo-1558494949-ef010acc7324?q=80&w=2074&auto=format&fit=crop',
        author: 'DR. ARIS VOSS',
        slug: 'foundations-of-consensus'
    }
];

export default function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % HERO_DATA.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + HERO_DATA.length) % HERO_DATA.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 10000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const slide = HERO_DATA[currentIndex];

    const variants = {
        enter: (direction: number) => ({
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)'
        }),
        center: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)'
        },
        exit: (direction: number) => ({
            opacity: 0,
            scale: 0.95,
            filter: 'blur(10px)'
        })
    };

    return (
        <section className="relative w-full mb-20 md:mb-32 group">
            <div className="relative overflow-hidden rounded-2xl md:rounded-[3rem] bg-zinc-900 text-white min-h-[500px] md:min-h-[700px] flex items-center shadow-2xl shadow-zinc-200/50">

                {/* Background Images */}
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent z-10" />
                        <img
                            src={slide.img}
                            className="w-full h-full object-cover grayscale opacity-50"
                            alt={slide.title}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Content */}
                <div className="relative z-20 px-12 md:px-24 flex flex-col gap-10 max-w-4xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex items-center gap-4">
                                <span className="w-12 h-[1px] bg-white/30"></span>
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-500">{slide.tag}</span>
                            </div>

                            <h1 className="text-4xl md:text-8xl font-black font-outfit tracking-tighter leading-[0.9] uppercase">
                                {slide.title}
                            </h1>

                            <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-400 italic max-w-2xl">
                                "{slide.desc}"
                            </p>

                            <div className="flex flex-wrap items-center gap-6 mt-4">
                                <Link href={`/articles/${slide.slug}`} className="bg-white text-zinc-900 px-12 py-5 font-black rounded-full uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all flex items-center gap-3 group">
                                    EXPLORE DISPATCH
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-600">LEAD AUTHOR / ARCHITECT</span>
                                    <span className="text-xs font-black tracking-tight uppercase">{slide.author}</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Global Slider Navigation */}
                <div className="absolute bottom-12 right-12 z-30 flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end gap-1 mr-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">CURRENT SIGNAL</span>
                        <span className="text-6xl font-black font-outfit leading-none tracking-tighter opacity-10 italic">0{currentIndex + 1}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={prevSlide}
                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-zinc-900 transition-all backdrop-blur-md"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-zinc-900 transition-all backdrop-blur-md"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5 z-20 overflow-hidden">
                    <motion.div
                        key={currentIndex}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 10, ease: "linear" }}
                        className="h-full bg-white origin-left"
                    />
                </div>
            </div>
        </section>
    );
}
