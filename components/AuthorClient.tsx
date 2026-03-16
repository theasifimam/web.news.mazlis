"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { MapPin, Calendar, Twitter, Linkedin, Globe, Newspaper, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getImageUrl } from '@/lib/config';
import { useGetArticlesQuery } from '@/lib/api/articlesApi';
import { useGetPublicProfileQuery } from '@/lib/api/authApi';

export default function AuthorClient({ username }: { username: string }) {
    console.log("AuthorClient rendering for:", username);
    const { data: profileRes, isLoading: profileLoading, error: profileError } = useGetPublicProfileQuery(username);
    const user = profileRes?.data?.user;

    console.log("Profile Data:", { profileLoading, user, profileError });

    const authorId = user?._id;

    const { data: articlesRes, isLoading: articlesLoading } = useGetArticlesQuery(
        { author: authorId, status: 'published' },
        { skip: !authorId }
    );

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-zinc-400" size={32} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold font-outfit mb-2">Author Not Found</h2>
                    <p className="text-zinc-500">The author profile you are looking for does not exist.</p>
                </div>
                <Link href="/" className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-xs font-bold uppercase tracking-widest">
                    Return to Feed
                </Link>
            </div>
        );
    }

    console.log(getImageUrl(user.avatar), "getImageUrl(user.avatar)----------------------")
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1 w-full flex flex-col">
                {/* Profile Hero Section */}
                <section className="relative w-full h-[70vh] md:h-[70vh] overflow-hidden bg-zinc-900">
                    <Image
                        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000"
                        alt="Profile Background"
                        fill
                        className="object-cover opacity-60 grayscale"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                    <div className="absolute bottom-20 left-6 right-6 md:left-12 md:right-12 z-20">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl"
                            >
                                <Image
                                    src={user.avatar
                                        ? getImageUrl(user.avatar)
                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=18181b&color=ffffff&size=256`}
                                    alt={user.fullName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </motion.div>

                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl md:text-5xl font-bold text-white font-outfit tracking-tight">
                                        {user.fullName}
                                    </h1>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm font-medium">
                                    {user.location && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={14} /> {user.location}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024'}
                                    </span>
                                </div>

                                {user.bio && (
                                    <p className="text-white/70 max-w-xl text-sm font-medium mt-2 line-clamp-3">
                                        {user.bio}
                                    </p>
                                )}

                                {user.socials && (Object.values(user.socials).some(link => link)) && (
                                    <div className="flex md:justify-start justify-center items-center gap-3 mt-4">
                                        {user.socials.twitter && (
                                            <a href={user.socials.twitter.startsWith('http') ? user.socials.twitter : `https://twitter.com/${user.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                                                <Twitter size={16} />
                                            </a>
                                        )}
                                        {user.socials.linkedin && (
                                            <a href={user.socials.linkedin.startsWith('http') ? user.socials.linkedin : `https://www.linkedin.com/in/${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                                                <Linkedin size={16} />
                                            </a>
                                        )}
                                        {user.socials.website && (
                                            <a href={user.socials.website.startsWith('http') ? user.socials.website : `https://${user.socials.website}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                                                <Globe size={16} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content Island */}
                <div className="relative w-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-10 z-30 pt-10 flex flex-col items-center">
                    <div className="w-full max-w-[1400px] px-6 lg:px-12 min-h-[40vh]">
                        <div className="flex items-center justify-between mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-0">
                            <div className="flex items-center gap-8">
                                <button
                                    className={`relative py-4 text-sm font-bold uppercase tracking-widest transition-colors text-zinc-900 dark:text-white`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Newspaper size={16} />
                                        <span>Articles by {user.fullName.split(' ')[0]}</span>
                                    </div>
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900 dark:bg-white" />
                                </button>
                            </div>
                        </div>

                        {articlesLoading ? (
                            <div className="py-20 flex items-center justify-center w-full">
                                <Loader2 className="animate-spin text-zinc-400" size={32} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                                {articlesRes?.data && articlesRes.data.length > 0 ? (
                                    articlesRes.data.map((item) => (
                                        <ArticleCard key={item._id} article={{
                                            id: item._id,
                                            slug: item.slug,
                                            title: item.title,
                                            author: item.author.fullName,
                                            date: new Date(item.createdAt).toLocaleDateString(),
                                            imageUrl: item.image,
                                            views: item.readCount
                                        }} variant="vertical" />
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 gap-4 text-center">
                                        <Newspaper size={48} strokeWidth={1} />
                                        <p className="font-medium">This author hasn't published any articles yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
