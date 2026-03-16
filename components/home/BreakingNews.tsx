"use client";

import React from 'react';
import Link from 'next/link';
import ArticleCard from '../ArticleCard';
import { format } from 'date-fns';

interface BreakingNewsProps {
    articles: any[];
}

export default function BreakingNews({ articles }: BreakingNewsProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-outfit tracking-tight">Breaking News</h2>
                <Link href="/articles" className="text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest">More</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                    <ArticleCard key={article._id} article={{
                        id: article._id,
                        slug: article.slug,
                        title: article.title,
                        author: article.author?.fullName || 'Anonymous',
                        date: format(new Date(article.createdAt), 'MMM dd, yyyy'),
                        imageUrl: article.image,
                        views: article.readCount
                    }} variant="vertical" />
                ))}
            </div>
        </section>
    );
}
