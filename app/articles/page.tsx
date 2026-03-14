import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ArticlesPage() {
    const articles = [
        {
            id: 'the-quiet-technical-revolution',
            tag: 'INVESTIGATION',
            title: 'The Architecture of Entropy.',
            desc: 'Exploring the decaying digital infrastructures that still power the modern financial core.',
            img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop',
            author: 'Marcus Thorne',
            date: 'Mar 05, 2026'
        },
        {
            id: '02',
            tag: 'POLITICS',
            title: 'The geography of legislative power.',
            desc: 'An exploration of how physical infrastructure dictates political leverage in the 21st century.',
            img: 'https://images.unsplash.com/photo-1541872703-74c5e443d1fe?q=80&w=2038&auto=format&fit=crop',
            author: 'Elara Vance',
            date: 'Feb 28, 2026'
        },
        {
            id: '03',
            tag: 'ECONOMICS',
            title: 'Scarcity as a deliberate design choice.',
            desc: 'How modern luxury brands and digital assets are redefining value through engineered friction.',
            img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
            author: 'Marcus Thorne',
            date: 'Feb 15, 2026'
        },
        {
            id: '04',
            tag: 'SCIENCE',
            title: 'The biological limits of computation.',
            desc: 'New research suggests we may be approaching the hard thermodynamic edge of silicon processing.',
            img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2090&auto=format&fit=crop',
            author: 'Dr. Aris Voss',
            date: 'Jan 22, 2026'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#fcfcfc] dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans selection:bg-zinc-900 dark:selection:bg-zinc-100 selection:text-white dark:selection:text-zinc-900 transition-colors duration-300">
            <Header />

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-24">
                <div className="flex flex-col gap-16">
                    {/* Page Header */}
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-white leading-none uppercase">
                            The Archive.
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl leading-relaxed font-light italic">
                            "A complete log of investigations into the architectures, protocols, and policies defining our reality."
                        </p>
                    </div>

                    <div className="w-full h-[1px] bg-zinc-200 dark:bg-zinc-800"></div>

                    {/* Articles List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                        {articles.map((article, idx) => (
                            <article key={article.id} className="group flex flex-col gap-8">
                                <Link href={`/articles/${article.id}`} className="block relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-black/20">
                                    <img
                                        src={article.img}
                                        alt={article.title}
                                        className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>

                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">{article.tag}</span>
                                        </div>
                                        <span className="text-[10px] font-black italic tracking-widest text-zinc-300 dark:text-zinc-700">SIGNAL 0{idx + 1}</span>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <Link href={`/articles/${article.id}`}>
                                            <h2 className="text-3xl md:text-4xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-white leading-tight group-hover:text-zinc-500 transition-colors uppercase">
                                                {article.title}
                                            </h2>
                                        </Link>
                                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-light line-clamp-2 italic">
                                            "{article.desc}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 pt-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Architect</span>
                                            <span className="text-[10px] font-black uppercase text-zinc-900 dark:text-zinc-100">{article.author}</span>
                                        </div>
                                        <div className="w-[1px] h-6 bg-zinc-100 dark:bg-zinc-900"></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Dispatch Date</span>
                                            <span className="text-[10px] font-black uppercase text-zinc-900 dark:text-zinc-100">{article.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="flex items-center justify-center pt-20">
                        <button className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-4 group">
                            <span className="w-12 h-[1px] bg-zinc-100 dark:bg-zinc-900 group-hover:w-20 transition-all"></span>
                            Load More Signals
                            <span className="w-12 h-[1px] bg-zinc-100 dark:bg-zinc-900 group-hover:w-20 transition-all"></span>
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
