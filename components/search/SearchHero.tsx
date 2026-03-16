"use client";

import React from 'react';
import Image from 'next/image';

export default function SearchHero() {
    return (
        <section className="relative w-full h-[70vh] md:h-[75vh] overflow-hidden bg-zinc-900">
            <Image
                src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=2000"
                alt="Discover Background"
                fill
                className="object-cover opacity-60 grayscale"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

            {/* Integrated Title */}
            <div className="absolute bottom-20 left-6 right-6 md:left-12 md:right-12 z-20">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[44px] md:text-7xl font-bold font-outfit tracking-tighter text-white leading-none">
                        Discover
                    </h1>
                    <p className="text-[12px] font-bold text-white/60 uppercase tracking-widest">
                        News from all over the world
                    </p>
                </div>
            </div>
        </section>
    );
}
