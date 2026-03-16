"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useGetArticlesQuery } from '@/lib/api/articlesApi';
import { format } from 'date-fns';

// Dynamic imports for improved initial load performance
// HeroSlider is heavy due to Framer Motion and images, kept as dynamic
const HeroSlider = dynamic(() => import('@/components/HeroSlider'), {
  ssr: false,
  loading: () => <div className="w-full h-[75vh] md:h-[85vh] bg-zinc-900 animate-pulse" />
});

const BreakingNews = dynamic(() => import('@/components/home/BreakingNews'), { 
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
      {[1, 2, 3].map(i => (
        <div key={i} className="flex flex-col gap-4 animate-pulse">
           <div className="aspect-[4/3] w-full rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-900" />
           <div className="h-6 w-3/4 bg-zinc-100 dark:bg-zinc-900 rounded-md" />
           <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-900 rounded-md" />
        </div>
      ))}
    </div>
  )
});

const TechnicalAnalysis = dynamic(() => import('@/components/home/TechnicalAnalysis'), { 
  ssr: false 
});

export default function HomePage() {
  const { data: response, isLoading } = useGetArticlesQuery({ limit: 12 });
  const articles = response?.data || [];

  const trendingArticles = useMemo(() => 
    articles.slice(0, 5).map((a: any) => ({
      id: a._id,
      slug: a.slug,
      title: a.title,
      category: a.topic?.[0]?.name || 'INVESTIGATION',
      imageUrl: a.image,
      author: a.author?.fullName || 'Anonymous',
      date: format(new Date(a.createdAt), 'MMM dd, yyyy')
    })), [articles]);

  const breakingNews = useMemo(() => articles.slice(0, 6), [articles]);
  const mostReadArticles = useMemo(() => 
    [...articles].sort((a: any, b: any) => (b.readCount || 0) - (a.readCount || 0)).slice(0, 3),
  [articles]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header />

      <main className="flex-1 w-full pb-32 md:pb-16 flex flex-col">
        {/* Sliding Hero Section */}
        <section className="w-full">
          {!isLoading ? (
            <HeroSlider articles={trendingArticles} />
          ) : (
            <div className="w-full h-[75vh] md:h-[85vh] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
          )}
        </section>

        {/* Content Island */}
        <div className="relative w-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-12 z-30 pt-16 flex flex-col items-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
            
            {/* Breaking News Section - Deferred Loading */}
            {!isLoading ? (
              <BreakingNews articles={breakingNews} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex flex-col gap-4 animate-pulse">
                    <div className="aspect-[4/3] w-full rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-900/50" />
                    <div className="h-6 w-3/4 bg-zinc-50 dark:bg-zinc-900/50 rounded-md" />
                  </div>
                ))}
              </div>
            )}

            {/* Technical Section */}
            {!isLoading && <TechnicalAnalysis articles={mostReadArticles} />}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
