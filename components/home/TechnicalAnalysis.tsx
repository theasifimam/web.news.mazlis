"use client";

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface TechnicalAnalysisProps {
    articles: any[];
}

export default function TechnicalAnalysis({ articles }: TechnicalAnalysisProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="mb-12 border-t border-zinc-100 dark:border-zinc-900 pt-16">
            <div className="mb-12">
                <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Intelligence Archive</h2>
                <p className="text-zinc-500 text-sm font-light">Most accessed investigations and data-driven reports.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article, idx) => (
                    <div key={article._id} className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:scale-[1.02] flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-4">
                                {article.topic?.[0]?.name || 'GENERAL'} • {format(new Date(article.createdAt), 'MMM dd')}
                            </span>
                            <h3 className="text-xl font-bold font-outfit leading-tight mb-6 line-clamp-3 h-[4.5rem]">{article.title}</h3>
                        </div>
                        <Link 
                            href={`/articles/${article.slug}-${article._id}`} 
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white group"
                        >
                            Read Report
                            <div className="w-6 h-0.5 bg-zinc-900 dark:bg-white transition-all group-hover:w-8" />
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
