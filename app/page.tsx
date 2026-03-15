"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import { useGetArticlesQuery, Article } from '@/lib/api/articlesApi';
import { format } from 'date-fns';
import { getImageUrl } from '@/lib/config';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { data: response, isLoading } = useGetArticlesQuery({ limit: 8 });
  const articles = response?.data || [];
  
  const trendingArticles = articles.slice(0, 5).map((a: any) => ({
    id: a._id,
    title: a.title,
    category: a.topic?.[0]?.name || 'INVESTIGATION',
    imageUrl: a.image,
    author: a.author?.fullName || 'Anonymous',
    date: format(new Date(a.createdAt), 'MMM dd, yyyy')
  }));

  const breakingNews = articles.slice(0, 6);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-zinc-400" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header />

      <main className="flex-1 w-full pb-32 md:pb-16 flex flex-col">
        {/* Sliding Hero Section - Rectangular Bottom */}
        <section className="w-full">
          <HeroSlider articles={trendingArticles} />
        </section>

        {/* Content Island with Top Radius */}
        <div className="relative w-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-12 z-30 pt-16 flex flex-col items-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">

            {/* Breaking News Section */}
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-outfit tracking-tight">Breaking News</h2>
                <Link href="/articles" className="text-sm font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-widest">More</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {breakingNews.map((article) => (
                  <ArticleCard key={article._id} article={{
                    id: article._id,
                    title: article.title,
                    author: article.author?.fullName || 'Anonymous',
                    date: format(new Date(article.createdAt), 'MMM dd, yyyy'),
                    imageUrl: article.image,
                    views: article.readCount
                  }} variant="vertical" />
                ))}
              </div>
            </section>

            {/* Technical Section (Keeping a refined version) */}
            <section className="mb-12 border-t border-zinc-100 dark:border-zinc-900 pt-16">
              <div className="mb-12">
                <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">Technical Analysis</h2>
                <p className="text-zinc-500 text-sm font-light">In-depth structured data reports for institutional subscribers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { tag: 'SECURITY', date: 'FEB 18', title: 'Zero-knowledge protocols in state-level infrastructure.' },
                  { tag: 'ECONOMICS', date: 'FEB 15', title: 'Synthetic scarcity and the liquidity of digital assets.' },
                  { tag: 'POLICY', date: 'FEB 12', title: 'Intergenerational equity in climate adaptation plans.' },
                ].map((paper, idx) => (
                  <div key={idx} className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:scale-[1.02]">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-4">{paper.tag} • {paper.date}</span>
                    <h3 className="text-xl font-bold font-outfit leading-tight mb-4">{paper.title}</h3>
                    <Link href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white group">
                      View Report
                      <div className="w-6 h-0.5 bg-zinc-900 dark:bg-white transition-all group-hover:w-8" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
