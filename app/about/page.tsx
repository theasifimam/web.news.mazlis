"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useGetPageBySlugQuery } from '@/lib/api/pagesApi';
import { motion } from 'framer-motion';

export default function AboutPage() {
    const { data: page, isLoading, error } = useGetPageBySlugQuery('about');

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-[#fcfcfc] dark:bg-[#030303]">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin"></div>
                    <span className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Syncing Dispatch...</span>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white dark:bg-[#030303] dark:text-zinc-100 transition-colors duration-500">
            <Header />

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-24">
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <span className="w-12 h-[1px] bg-zinc-900 dark:bg-emerald-500"></span>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-emerald-500">Protocol Overview</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-white leading-[0.9] mb-12 uppercase">
                        {page?.title || "Modern Journalism. Zero Noise."}
                    </h1>

                    {page?.content ? (
                        <div 
                            className="prose prose-xl prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-relaxed font-light ql-editor break-words whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    ) : (
                        <p className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-500 italic mb-20 max-w-3xl">
                            "Mazlis was founded on a single premise: that the infrastructure of our information determines the quality of our reality."
                        </p>
                    )}
                </motion.section>

                {/* Values Grid - Static but kept for aesthetic balance */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 my-32">
                    {[
                        { title: 'SIGNAL', desc: 'We only publish when we have something significant to add to the discourse.' },
                        { title: 'INDEPENDENCE', desc: 'No venture capital. No advertisers. Only community and curiosity.' },
                        { title: 'RIGOR', desc: 'Every dispatch undergoes a multi-layer technical verifying process.' }
                    ].map((value) => (
                        <div key={value.title} className="flex flex-col gap-6 p-10 bg-white dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-12 h-12 bg-zinc-900 dark:bg-emerald-500 text-white rounded-full flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                {value.title[0]}
                            </div>
                            <h3 className="text-xl font-bold font-outfit tracking-tight text-zinc-900 dark:text-white uppercase">{value.title}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-light">{value.desc}</p>
                        </div>
                    ))}
                </section>
            </main>

            <Footer />
        </div>
    );
}
