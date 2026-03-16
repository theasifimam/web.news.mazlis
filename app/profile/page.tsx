"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import AuthModal from '@/components/AuthModal';
import { MOCK_ARTICLES } from '@/lib/mock-data';
import { Settings, Bookmark, Grid, MapPin, Calendar, Edit3, UserPlus, LogIn, Twitter, Linkedin, Globe, PencilLine, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/lib/store/hooks';
import Link from 'next/link';
import { getImageUrl } from '@/lib/config';
import { useGetArticlesQuery } from '@/lib/api/articlesApi';
import { useGetProfileQuery } from '@/lib/api/authApi';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const { user: storeUser, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
    const [activeTab, setActiveTab] = useState<'articles' | 'saved' | 'drafts'>('articles');

    const { data: profileRes, isLoading: profileLoading } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
    const user = profileRes?.data?.user || storeUser;

    const { data: articlesRes, isLoading: articlesLoading } = useGetArticlesQuery(
        { author: user?._id, status: 'published' },
        { skip: !user?._id || activeTab !== 'articles' }
    );

    const { data: draftsRes, isLoading: draftsLoading } = useGetArticlesQuery(
        { author: user?._id, status: 'draft' },
        { skip: !user?._id || activeTab !== 'drafts' }
    );

    const isLoading = profileLoading || (activeTab === 'articles' && articlesLoading) || (activeTab === 'drafts' && draftsLoading);

    const openAuth = (tab: 'signin' | 'signup') => {
        setAuthTab(tab);
        setIsAuthOpen(true);
    };


    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />

            <main className="flex-1 w-full flex flex-col">
                {/* Profile Hero Section */}
                <section className="relative w-full h-[70vh] md:h-[60vh] overflow-hidden bg-zinc-900">
                    <Image
                        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000"
                        alt="Profile Background"
                        fill
                        className="object-cover opacity-60 grayscale"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                    {/* Integrated Profile Info or Auth CTA */}
                    <div className="absolute bottom-24 left-6 right-6 md:left-12 md:right-12 z-20">
                        {isAuthenticated && user ? (
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl"
                                >
                                    <Image
                                        src={user?.avatar
                                            ? getImageUrl(user.avatar)
                                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=18181b&color=ffffff&size=256`}
                                        alt={user?.fullName || 'Profile avatar'}
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
                                        <Link href="/profile/settings" className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-zinc-900 transition-all">
                                            <Edit3 size={18} />
                                        </Link>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={14} /> {user.location || "Location Undeclared"}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={14} /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024'}
                                        </span>
                                    </div>

                                    {user.bio && (
                                        <p className="text-white/70 max-w-xl text-sm font-medium mt-2 line-clamp-2">
                                            {user.bio}
                                        </p>
                                    )}

                                    {user.socials && (Object.values(user.socials).some(link => link)) && (
                                        <div className="flex md:justify-start justify-center items-center gap-4 mt-2">
                                            {user.socials.twitter && (
                                                <a href={user.socials.twitter.startsWith('http') ? user.socials.twitter : `https://twitter.com/${user.socials.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                                                    <Twitter size={16} />
                                                </a>
                                            )}
                                            {user.socials.linkedin && (
                                                <a href={user.socials.linkedin.startsWith('http') ? user.socials.linkedin : `https://www.linkedin.com/in/${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                                                    <Linkedin size={16} />
                                                </a>
                                            )}
                                            {user.socials.website && (
                                                <a href={user.socials.website.startsWith('http') ? user.socials.website : `https://${user.socials.website}`} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                                                    <Globe size={16} />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-start gap-8 max-w-2xl"
                            >
                                <div className="flex flex-col gap-4">
                                    <h1 className="text-4xl md:text-7xl font-bold text-white font-outfit tracking-tighter leading-none">
                                        Join the <br />Collective.
                                    </h1>
                                    <p className="text-white/60 text-lg md:text-xl font-medium tracking-tight">
                                        Secure your access to deep-dive investigations and personalized intelligence.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Content Island with Top Radius */}
                <div className="relative w-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-12 z-30 pt-10 flex flex-col items-center">
                    <div className="w-full max-w-[1400px] px-6 lg:px-12 min-h-[40vh]">
                        {isAuthenticated ? (
                            <>
                                {/* Tab Navigation (Pill-based) */}
                                <div className="flex items-center justify-between mb-12 border-b border-zinc-100 dark:border-zinc-900 pb-0">
                                    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                                        <button
                                            onClick={() => setActiveTab('articles')}
                                            className={`relative py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'articles' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Newspaper size={16} />
                                                <span className="hidden sm:inline">My Articles</span>
                                            </div>
                                            {activeTab === 'articles' && (
                                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900 dark:bg-white" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('saved')}
                                            className={`relative py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'saved' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Bookmark size={16} />
                                                <span className="hidden sm:inline">Saved</span>
                                            </div>
                                            {activeTab === 'saved' && (
                                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900 dark:bg-white" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('drafts')}
                                            className={`relative py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'drafts' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <PencilLine size={16} />
                                                <span className="hidden sm:inline">Drafts</span>
                                            </div>
                                            {activeTab === 'drafts' && (
                                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-900 dark:bg-white" />
                                            )}
                                        </button>
                                    </div>

                                    <Link href="/profile/settings" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                                        <Settings size={18} />
                                        <span className="hidden sm:inline">Settings</span>
                                    </Link>
                                </div>

                                {isLoading ? (
                                    <div className="py-20 flex items-center justify-center w-full">
                                        <Loader2 className="animate-spin text-zinc-400" size={32} />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                                        {activeTab === 'articles' && (
                                            articlesRes?.data && articlesRes.data.length > 0 ? (
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
                                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
                                                    <Newspaper size={48} strokeWidth={1} />
                                                    <p className="font-medium text-center">You haven't published any articles yet.</p>
                                                    <Link href="/dashboard" className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-xs font-bold uppercase tracking-widest">Write Now</Link>
                                                </div>
                                            )
                                        )}

                                        {activeTab === 'saved' && (
                                            user?.bookmarks && user.bookmarks.length > 0 ? (
                                                user.bookmarks.map((item: any) => (
                                                    <ArticleCard key={item._id} article={{
                                                        id: item._id,
                                                        slug: item.slug,
                                                        title: item.title,
                                                        author: item.author?.fullName || 'Unknown',
                                                        date: new Date(item.createdAt).toLocaleDateString(),
                                                        imageUrl: item.image,
                                                        views: item.readCount
                                                    }} variant="vertical" />
                                                ))
                                            ) : (
                                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
                                                    <Bookmark size={48} strokeWidth={1} />
                                                    <p className="font-medium">Your saved collection is empty.</p>
                                                </div>
                                            )
                                        )}

                                        {activeTab === 'drafts' && (
                                            draftsRes?.data && draftsRes.data.length > 0 ? (
                                                draftsRes.data.map((item) => (
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
                                                <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
                                                    <PencilLine size={48} strokeWidth={1} />
                                                    <p className="font-medium">No drafts found.</p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center pb-20 text-center">

                                <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-6">
                                    <Bookmark size={32} />
                                </div>
                                <h2 className="text-2xl font-bold font-outfit mb-2">Access Restricted</h2>
                                <p className="text-zinc-500 max-w-sm mb-8">
                                    Please sign in to view your personalized feed, saved articles, and investigation signals.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm sm:max-w-none">
                                    <button
                                        onClick={() => openAuth('signin')}
                                        className="px-8 py-4 w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-black/5"
                                    >
                                        <LogIn size={18} />
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => openAuth('signup')}
                                        className="px-8 py-4 w-full sm:w-auto rounded-full border-1 border-zinc-200 dark:border-white bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <UserPlus size={18} />
                                        Sign Up
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />

            <AuthModal
                isOpen={isAuthOpen}
                onOpenChange={setIsAuthOpen}
                defaultTab={authTab}
            />
        </div>
    );
}
