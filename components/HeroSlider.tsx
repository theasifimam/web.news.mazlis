"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/lib/config';

interface Article {
    id: string;
    slug: string;
    title: string;
    category: string;
    imageUrl: string;
    author: string;
    date: string;
}

interface HeroSliderProps {
    articles: Article[];
}

export default function HeroSlider({ articles }: HeroSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, [articles.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    }, [articles.length]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const article = articles[currentIndex];

    return (
        <div className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden bg-zinc-950">
            <AnimatePresence mode="wait">
                <motion.div
                    key={article.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    <Image
                        src={getImageUrl(article.imageUrl)}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

            {/* Content Container */}
            <div className="absolute bottom-28 left-6 right-6 md:left-12 md:right-12 z-20 flex flex-col gap-6 max-w-4xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col gap-4 md:gap-6"
                    >
                        <div className="w-fit px-5 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full">
                            <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">
                                {article.category === 'NEWS OF THE DAY' ? 'Trending Signal' : article.category}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white font-outfit leading-[1] tracking-tighter">
                            {article.title}
                        </h1>

                        <div className="flex items-center gap-6 mt-2">
                            <Link
                                href={`/articles/${article.slug}-${article.id}`}
                                className="group flex items-center gap-4 py-1"
                            >
                                <span className="text-sm font-black text-white uppercase tracking-widest">
                                    Read More
                                </span>
                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-zinc-900 transition-all duration-300">
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            <div className="hidden md:flex flex-col gap-0.5 border-l border-white/20 pl-6">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Filed by Agent</span>
                                <span className="text-xs font-bold text-white/80">{article.author}</span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation & Progress */}
            <div className="absolute bottom-28 right-6 md:right-12 z-20 flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2">
                    {articles.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1 transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-12 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={prevSlide}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-zinc-900 transition-all active:scale-90"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-zinc-900 transition-all active:scale-90"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10 blur-sm" />
        </div>
    );
}
