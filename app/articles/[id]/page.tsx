"use client";

import React, { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useGetArticleByIdQuery, useGetArticlesQuery } from '@/lib/api/articlesApi';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, FileText, ArrowRight, Clock, Eye } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;

    const { data: response, isLoading } = useGetArticleByIdQuery(id);
    const { data: recentResponse } = useGetArticlesQuery({ limit: 4 });

    const article = response?.success ? response.data : null;
    const recentArticles = recentResponse?.success ? recentResponse.data : [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fcfcfc] dark:bg-[#0a0a0a]">
                <Loader2 className="animate-spin text-zinc-300" size={40} />
                <span className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-500 animate-pulse">Syncing Archive...</span>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col bg-[#fcfcfc] dark:bg-[#0a0a0a]">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-20 gap-6 text-center">
                    <FileText size={48} className="text-zinc-200 dark:text-zinc-800" />
                    <h1 className="text-2xl font-black font-outfit uppercase tracking-tighter">Signal Log Not Found</h1>
                    <p className="text-zinc-500 max-w-md">The requested dispatch does not exist in our archives or has been decommissioned.</p>
                    <Link href="/" className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-[10px] font-black uppercase tracking-widest">Return to Matrix</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300 overflow-x-hidden pb-12">
            <Header />

            <main className="flex flex-col items-center w-full">
                <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
                    <img
                        src={`http://localhost:5000${article.image}`}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Back Button */}
                    <Link href="/" className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-xl border-white/20 rounded-full text-white active:scale-90 transition-all">
                        <ArrowRight className="rotate-180" size={24} />
                    </Link>

                    {/* Overlaid Content */}
                    <div className="absolute bottom-24 left-8 right-8 flex flex-col gap-4 max-w-2xl">
                        <span className="w-fit bg-emerald-500/20 backdrop-blur-xl text-emerald-400 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-emerald-500/30">
                            {article.topic[0]?.name || 'GENERAL'}
                        </span>
                        <h1 className="text-3xl md:text-6xl font-black font-outfit tracking-tighter text-white leading-[1] uppercase">
                            {article.title}
                        </h1>
                        <p className="text-white/60 text-sm md:text-lg font-medium leading-relaxed max-w-lg">
                            An in-depth analysis of the current infrastructure and policy shifts defining our collective future.
                        </p>
                    </div>
                </section>

                {/* Floating Meta Card */}
                <section className="relative z-10 -mt-16 w-full px-6 flex justify-center">
                    <div className="w-full max-w-3xl bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 shadow-2xl shadow-black/10 rounded-[2.5rem] p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800">
                                <img
                                    src={article.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.fullName || 'A')}&background=f4f4f5&color=18181b`}
                                    alt={article.author?.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black tracking-tight">{article.author?.fullName || 'Anonymous'}</span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Author</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-zinc-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{formatDistanceToNow(new Date(article.createdAt))}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye size={16} className="text-zinc-300" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{article.readCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Article content body */}
                <article className="w-full max-w-3xl px-8 mt-16 md:mt-24">
                     <div
                        className="prose prose-zinc dark:prose-invert max-w-none break-words overflow-hidden w-full ql-editor
                        prose-p:text-lg prose-p:md:text-xl prose-p:font-light prose-p:text-zinc-800 dark:prose-p:text-zinc-300 prose-p:leading-relaxed
                        prose-h1:text-3xl prose-h1:font-black prose-h1:font-outfit prose-h1:tracking-tighter prose-h1:uppercase
                        prose-h2:text-2xl prose-h2:font-black prose-h2:font-outfit prose-h2:tracking-tighter prose-h2:text-zinc-900 dark:prose-h2:text-white prose-h2:mt-12 prose-h2:uppercase"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    {/* Footer tags and share */}
                    <div className="mt-24 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-12">
                        <div className="flex flex-wrap gap-2">
                            {article.topic.map(t => (
                                <span key={t._id} className="text-[9px] font-bold uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 px-4 py-2 rounded-full">
                                    {t.name}
                                </span>
                            ))}
                        </div>
                        
                        <div className="flex items-center justify-between py-6">
                           <Link href="/" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                Return to Archive
                           </Link>
                           <div className="flex gap-6">
                               <button className="text-xs font-black uppercase tracking-widest text-zinc-400">Share</button>
                               <button className="text-xs font-black uppercase tracking-widest text-zinc-400">Save</button>
                           </div>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
