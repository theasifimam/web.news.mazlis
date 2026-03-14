"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import { useGetArticlesQuery, Article } from '@/lib/api/articlesApi';
import { useGetTopicsQuery } from '@/lib/api/topicsApi';
import { Search as SearchIcon, SlidersHorizontal, Clock, Eye, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTopic, setActiveTopic] = useState('All');
    
    const { data: articlesRes, isLoading: articlesLoading } = useGetArticlesQuery({ limit: 20 });
    const { data: topicsRes } = useGetTopicsQuery();
    
    const articles = articlesRes?.success ? articlesRes.data : [];
    const topics = topicsRes?.success ? topicsRes.data : [];

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] transition-colors duration-300 pt-16 md:pt-20">
            <Header />

            <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 pt-12 pb-32 flex flex-col gap-10">
                {/* Discover Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-[44px] md:text-7xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
                        Discover
                    </h1>
                    <p className="text-[12px] font-bold text-zinc-400 dark:text-zinc-600">
                        News from all over the world
                    </p>
                </div>

                {/* Search Bar - Premium Look */}
                <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300">
                        <SearchIcon size={20} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl py-5 pl-16 pr-16 text-sm font-bold tracking-tight text-zinc-900 dark:text-white focus:outline-none focus:ring-0 transition-all placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 cursor-pointer">
                        <SlidersHorizontal size={20} />
                    </div>
                </div>

                {/* Category Tabs - Clean Underline */}
                <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-2">
                    {['Health', 'Politics', 'Art', 'Food', 'Science', 'Architecture'].map((topic) => (
                        <button
                            key={topic}
                            onClick={() => setActiveTopic(topic)}
                            className={`relative text-[16px] md:text-lg font-black font-outfit whitespace-nowrap pb-2 transition-colors ${
                                activeTopic === topic 
                                ? 'text-zinc-900 dark:text-white border-b-4 border-zinc-900 dark:border-white' 
                                : 'text-zinc-300 dark:text-zinc-700'
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>

                {/* Vertical Article List - Vibrant & Clean */}
                <div className="flex flex-col gap-10">
                    {articlesLoading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="flex gap-6 animate-pulse">
                                <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-950 rounded-3xl shrink-0" />
                                <div className="flex-1 flex flex-col gap-3 justify-center">
                                    <div className="h-4 bg-zinc-50 dark:bg-zinc-950 rounded-full w-3/4" />
                                    <div className="h-3 bg-zinc-50 dark:bg-zinc-950 rounded-full w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : (
                        articles.map((article: Article) => (
                            <Link href={`/articles/${article._id}`} key={article._id} className="group flex gap-6 items-center">
                                <div className="w-[100px] h-[100px] rounded-[30px] overflow-hidden shrink-0 shadow-lg shadow-black/5">
                                    <img 
                                        src={`http://localhost:5000${article.image}`} 
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <h3 className="text-[15px] md:text-2xl font-black font-outfit text-zinc-900 dark:text-white leading-[1.2] group-hover:text-zinc-500 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400">
                                        <div className="flex items-center gap-1.5 uppercase tracking-widest">
                                            <Clock size={12} className="text-zinc-300" />
                                            {formatDistanceToNow(new Date(article.createdAt))}
                                        </div>
                                        <div className="flex items-center gap-1.5 uppercase tracking-widest">
                                            <Eye size={12} className="text-zinc-300" />
                                            {article.readCount || 0}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
