"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import ArticleCard from '@/components/ArticleCard';
import { Loader2, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useGetArticlesQuery } from '@/lib/api/articlesApi';
import { useGetTopicsQuery } from '@/lib/api/topicsApi';
import { getImageUrl } from '@/lib/config';
import { format } from 'date-fns';

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

    const { data: topicsResponse, isLoading: topicsLoading } = useGetTopicsQuery();
    const topics = topicsResponse?.data || [];

    // Set initial active topic if not set
    React.useEffect(() => {
        if (topics.length > 0 && !activeTopicId) {
            setActiveTopicId(topics[0]._id);
        }
    }, [topics, activeTopicId]);

    const { data: articlesResponse, isLoading: articlesLoading } = useGetArticlesQuery(
        {
            topic: activeTopicId || undefined,
            status: 'published'
        },
        { skip: !activeTopicId }
    );

    const articles = articlesResponse?.data || [];

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <Header />

            <main className="flex-1 w-full flex flex-col">
                {/* Discover Hero Section */}
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

                {/* Content Island with Top Radius */}
                <div className="relative w-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-12 z-30 pt-10 flex flex-col items-center">
                    <div className="w-full max-w-[1400px] px-6 lg:px-12 flex flex-col gap-2">
                        {/* Search Bar */}
                        <div className="relative group">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400">
                                <SearchIcon size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search Investigations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-[1.5rem] py-5 pl-16 pr-16 text-sm font-bold tracking-tight text-zinc-900 dark:text-white focus:outline-none focus:ring-0 transition-all placeholder:text-zinc-400"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 cursor-pointer">
                                <SlidersHorizontal size={20} />
                            </div>
                        </div>

                        {/* Category Tabs */}
                        {topicsLoading ? (
                            <div className="flex items-center gap-4 py-8">
                                <Loader2 className="animate-spin text-zinc-400" size={20} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Retrieving Topics...</span>
                            </div>
                        ) : (
                            <CategoryTabs
                                categories={topics.map(t => t.name)}
                                activeCategory={topics.find(t => t._id === activeTopicId)?.name || ''}
                                onCategoryChange={(name) => {
                                    const topic = topics.find(t => t.name === name);
                                    if (topic) setActiveTopicId(topic._id);
                                }}
                            />
                        )}

                        {/* Article List */}
                        <div className="flex flex-col gap-2 min-h-[400px]">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                    {searchQuery ? `Search Results (${filteredArticles.length})` : `Suggested in ${topics.find(t => t._id === activeTopicId)?.name || 'Investigations'} (${filteredArticles.length})`}
                                </h2>
                            </div>

                            {articlesLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="animate-spin text-zinc-300" size={40} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Decoding Signals...</span>
                                </div>
                            ) : filteredArticles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-8">
                                    {filteredArticles.map((article) => (
                                        <ArticleCard
                                            key={article._id}
                                            article={{
                                                id: article._id,
                                                title: article.title,
                                                author: article.author?.fullName || 'Anonymous',
                                                date: format(new Date(article.createdAt), 'MMM dd, yyyy'),
                                                imageUrl: article.image,
                                                views: article.readCount
                                            }}
                                            variant="horizontal"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                                    <p className="text-zinc-400 text-sm font-medium italic">"No signals found matching your inquiry."</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
