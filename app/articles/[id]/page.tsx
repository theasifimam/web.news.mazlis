"use client";

import React, { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetArticleByIdQuery, useGetArticlesQuery } from '@/lib/api/articlesApi';
import { format } from 'date-fns';
import { getImageUrl } from '@/lib/config';
import { ArrowLeft, Loader2 } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

export default function ArticlePage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const id = params.id;

    const { data: response, isLoading, error } = useGetArticleByIdQuery(id);
    const { data: moreArticles } = useGetArticlesQuery({ limit: 4 });
    const article = response?.data;

    // Apply highlighting for code snippets
    React.useEffect(() => {
        if (article?.content) {
            // Target all Quill syntax blocks specifically
            const codeBlocks = document.querySelectorAll('pre.ql-syntax');
            codeBlocks.forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
        }
    }, [article, isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-zinc-400" size={40} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Retrieving intelligence...</span>
                </div>
            </div>
        );
    }

    if (!article || error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold font-outfit mb-2">Signal Lost</h2>
                    <p className="text-zinc-500">We couldn't locate the requested article.</p>
                </div>
                <Link href="/" className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-xs font-bold uppercase tracking-widest">
                    Return to Feed
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300 pb-24">
            <Header />

            <main className="flex flex-col items-center w-full">
                {/* Hero Section - Rectangular Bottom */}
                <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
                    <Image
                        src={getImageUrl(article.image)}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                        unoptimized={true}
                    />
                    {/* Gradients for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                    {/* Overlaid Content (Title, Category, Excerpt) */}
                    <div className="absolute bottom-24 left-6 right-6 md:left-12 md:right-12 flex flex-col gap-4 max-w-3xl">
                        <div className="w-fit px-4 py-1.5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full">
                            <span className="text-[11px] font-bold text-white uppercase tracking-widest">
                                {article.topic?.[0]?.name || 'Uncategorized'}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-6xl font-bold font-outfit tracking-tight text-white leading-[1.1]">
                            {article.title}
                        </h1>
                    </div>
                </section>

                {/* Content Container with Top Radius */}
                <div className="relative w-full bg-background rounded-t-[3rem] md:rounded-t-[4rem] -mt-12 z-30 pt-10 flex flex-col items-center">
                    {/* Metadata Row - Single Line */}
                    <div className="w-full max-w-4xl px-6 flex flex-row items-center gap-2 overflow-x-auto no-scrollbar pb-8 mb-4">
                        {/* Author Pill */}
                        <div className="flex items-center gap-2 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 pl-1 pr-4 py-1.5 rounded-full shrink-0 h-10">
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-zinc-800">
                                <Image
                                    src={article.author.avatar
                                        ? getImageUrl(article.author.avatar)
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author.fullName)}&background=18181b&color=ffffff`}
                                    alt={article.author.fullName}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                    unoptimized={true}
                                />
                            </div>
                            <span className="text-xs font-bold whitespace-nowrap">{article.author.fullName}</span>
                        </div>

                        {/* Date (Time) Pill */}
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-full shrink-0 h-10">
                            <Clock size={14} className="text-zinc-400 shrink-0" />
                            <span className="text-xs font-bold whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                                {format(new Date(article.createdAt), 'MMM d, yyyy')}
                            </span>
                        </div>

                        {/* Views Pill */}
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100/50 dark:bg-zinc-800/50 rounded-full shrink-0 h-10">
                            <Eye size={14} className="text-zinc-400 shrink-0" />
                            <span className="text-xs font-bold whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                                {article.readCount?.toLocaleString() || 0}
                            </span>
                        </div>
                    </div>

                    {/* Article content body */}
                    <article className="w-full max-w-4xl px-6 flex flex-col gap-10">
                        {/* fix overflow of text in x direction, break words to second line */}
                        <div
                            className="max-w-full text-zinc-800 dark:text-zinc-200 text-lg leading-relaxed text-justify overflow-x-hidden break-words"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Image Gallery */}
                        <div className="grid grid-cols-2 gap-4 h-[250px] md:h-[400px]">
                            <div className="relative h-full rounded-[2rem] overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80"
                                    alt="Gallery image 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative h-full rounded-[2rem] overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80"
                                    alt="Gallery image 2"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="prose prose-zinc dark:prose-invert max-w-none">
                            <p className="text-zinc-800 dark:text-zinc-200 text-lg leading-relaxed">
                                The transition from bulky DSLRs to compact, powerful mirrorless bodies has mirrored the shift from traditional media conglomerates to independent, agile intelligence agencies like Mazlis. Our commitment to high-fidelity reporting is matched only by our dedication to the tools that make it possible.
                            </p>
                        </div>
                    </article>
                </div>

                {/* Related Articles Footer */}
                <section className="w-full max-w-[1400px] mt-24 px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl font-bold font-outfit">More from Mazlis</h2>
                        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {moreArticles?.data?.slice(0, 4).map(a => (
                            <Link key={a._id} href={`/articles/${a._id}`} className="group flex flex-col gap-4">
                                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                    <Image
                                        src={getImageUrl(a.image)}
                                        alt={a.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        unoptimized={true}
                                    />
                                </div>
                                <h3 className="text-md font-bold font-outfit leading-tight group-hover:text-zinc-500 transition-colors line-clamp-2">{a.title}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
