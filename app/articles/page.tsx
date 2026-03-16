"use client";


import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { useGetArticlesQuery } from '@/lib/api/articlesApi';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

export default function ArticlesPage() {
    const { data: response, isLoading } = useGetArticlesQuery({});
    const articles = response?.data || [];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-zinc-400" size={40} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Synchronizing Signals...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Header />

            <main className="flex-1 w-full flex flex-col">
                {/* Hero Section */}
                <section className="relative w-full h-[60vh] md:h-[55vh] overflow-hidden bg-zinc-900">
                    <Image
                        src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=2000"
                        alt="Archive Background"
                        fill
                        className="object-cover opacity-60 grayscale"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                    <div className="absolute bottom-24 left-6 right-6 md:left-12 md:right-12 z-20 max-w-4xl">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-[44px] md:text-8xl font-bold font-outfit tracking-tighter text-white leading-none uppercase">
                                The Archive.
                            </h1>
                            <p className="text-[12px] md:text-sm font-bold text-white/60 uppercase tracking-[0.2em] max-w-xl">
                                "A complete log of investigations into the architectures, protocols, and policies defining our reality."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Island */}
                <div className="relative w-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-12 z-30 pt-20 flex flex-col items-center">
                    <div className="w-full max-w-[1400px] px-6 lg:px-12 flex flex-col gap-16">

                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-8">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Total Recorded Signals ({articles.length})</h2>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-700">
                                Filter: Chronological
                            </div>
                        </div>

                        {/* Articles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                            {articles.map((article) => (
                                <ArticleCard
                                    key={article._id}
                                    article={{
                                        id: article._id,
                                        slug: article.slug,
                                        title: article.title,
                                        author: article.author?.fullName || 'Anonymous',
                                        date: format(new Date(article.createdAt), 'MMM dd, yyyy'),
                                        imageUrl: article.image,
                                        views: article.readCount
                                    }}
                                    variant="vertical"
                                />
                            ))}
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="flex items-center justify-center pt-20 pb-32">
                            <button className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors flex items-center gap-4 group">
                                <span className="w-12 h-[1px] bg-zinc-100 dark:bg-zinc-900 group-hover:w-20 transition-all"></span>
                                Load More Signals
                                <span className="w-12 h-[1px] bg-zinc-100 dark:bg-zinc-900 group-hover:w-20 transition-all"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
