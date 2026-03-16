"use client";

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Clock, Eye, Share2, Facebook, Instagram, MessageCircle, Send, Link2, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useGetArticleByIdQuery, useGetArticlesQuery, Article } from '@/lib/api/articlesApi';
import { format } from 'date-fns';
import { getImageUrl } from '@/lib/config';
import { Loader2 } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// Custom WhatsApp Icon
const WhatsAppIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.531 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export default function ArticleClient({ slug }: { slug: string }) {
    const id = slug.substring(slug.lastIndexOf('-') + 1);
    const { data: response, isLoading, error } = useGetArticleByIdQuery(id);
    const { data: moreArticles } = useGetArticlesQuery({ limit: 4 });
    const article = response?.data;
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = article?.title || 'Check out this investigation on Mazlis News';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: <WhatsAppIcon />,
            color: 'text-[#25D366] hover:bg-[#25D366]/10 border-[#25D366]/20',
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`
        },
        {
            name: 'Facebook',
            icon: <Facebook size={18} fill="currentColor" />,
            color: 'text-[#1877F2] hover:bg-[#1877F2]/10 border-[#1877F2]/20',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Instagram',
            icon: <Instagram size={18} />,
            color: 'text-[#E4405F] hover:bg-[#E4405F]/10 border-[#E4405F]/20',
            url: `https://www.instagram.com/`
        }
    ];

    // Apply highlighting and add copy buttons for code snippets
    React.useEffect(() => {
        if (article?.content && !isLoading) {
            const highlightCode = () => {
                const codeBlocks = document.querySelectorAll('pre, code') as NodeListOf<HTMLElement>;
                codeBlocks.forEach((block) => {
                    if (!block.dataset.highlighted) {
                        hljs.highlightElement(block);
                        block.dataset.highlighted = 'true';
                    }

                    if (block.tagName === 'PRE' && !block.querySelector('.copy-button')) {
                        const container = document.createElement('div');
                        container.className = 'action-buttons-container absolute top-3 right-4 flex items-center gap-2 transition-all opacity-0 group-hover:opacity-100 z-[100]';

                        // Maximize button
                        const maxBtn = document.createElement('button');
                        maxBtn.className = 'maximize-button p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 uppercase text-[9px] font-black tracking-widest flex items-center gap-1.5 transition-colors';
                        maxBtn.innerHTML = '<span>Maximize</span>';

                        // Minimize button (Hidden initially)
                        const minBtn = document.createElement('button');
                        minBtn.className = 'minimize-button hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 uppercase text-[9px] font-black tracking-widest flex items-center gap-1.5 transition-colors border border-white/10';
                        minBtn.innerHTML = '<span>Minimize</span>';

                        const toggleMaximize = (e: MouseEvent) => {
                            e.stopPropagation();
                            const isNowMaximized = block.classList.toggle('code-block-maximized');
                            document.body.classList.toggle('has-maximized-code', isNowMaximized);

                            if (isNowMaximized) {
                                maxBtn.classList.add('hidden');
                                minBtn.classList.remove('hidden');
                                container.classList.add('!opacity-100', '!fixed', '!top-6', '!right-6');
                            } else {
                                maxBtn.classList.remove('hidden');
                                minBtn.classList.add('hidden');
                                container.classList.remove('!opacity-100', '!fixed', '!top-6', '!right-6');
                            }
                        };

                        maxBtn.onclick = toggleMaximize as any;
                        minBtn.onclick = toggleMaximize as any;

                        // Copy button
                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'copy-button p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 uppercase text-[9px] font-black tracking-widest flex items-center gap-1.5 transition-colors';
                        copyBtn.innerHTML = '<span>Copy</span>';

                        copyBtn.onclick = (e) => {
                            e.stopPropagation();
                            const text = block.innerText.replace('SIGNAL CODEMaximize', '').replace('Maximize', '').replace('Minimize', '').replace('Copy', '').replace('Copied', '');
                            navigator.clipboard.writeText(text);
                            copyBtn.innerHTML = '<span>Copied</span>';
                            copyBtn.classList.add('text-emerald-400');
                            setTimeout(() => {
                                copyBtn.innerHTML = '<span>Copy</span>';
                                copyBtn.classList.remove('text-emerald-400');
                            }, 2000);
                        };

                        container.appendChild(maxBtn);
                        container.appendChild(minBtn);
                        container.appendChild(copyBtn);

                        block.classList.add('group');
                        block.style.position = 'relative';
                        block.appendChild(container);
                    }
                });
            };

            const timeout = setTimeout(highlightCode, 100);
            const timeout2 = setTimeout(highlightCode, 1000);

            return () => {
                clearTimeout(timeout);
                clearTimeout(timeout2);
            };
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
                {/* Hero Section */}
                <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
                    <Image
                        src={getImageUrl(article.image)}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                        unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

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

                {/* Content Container */}
                <div className="relative w-full bg-background rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-12 z-30 pt-10 flex flex-col items-center">
                    <div className="w-full max-w-4xl px-6 flex flex-row items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-8 mb-4">
                        <Link
                            href={`/author/${article.author.username}`}
                            className="flex items-center gap-2 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 pl-1 pr-4 py-1.5 rounded-full shrink-0 h-10 hover:scale-105 transition-transform cursor-pointer"
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-zinc-800 relative">
                                <Image
                                    src={article.author?.avatar ? getImageUrl(article.author.avatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author?.fullName || 'A')}&background=18181b&color=ffffff`}
                                    alt={article.author?.fullName || 'Author'}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <span className="text-xs font-bold whitespace-nowrap">{article.author.fullName}</span>
                        </Link>
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full shrink-0 h-10">
                            <Clock size={14} className="text-zinc-400 shrink-0" />
                            <span className="text-xs font-bold whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                                {format(new Date(article.createdAt), 'MMM d, yyyy')}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full shrink-0 h-10">
                            <Eye size={14} className="text-zinc-400 shrink-0" />
                            <span className="text-xs font-bold whitespace-nowrap text-zinc-600 dark:text-zinc-300">
                                {article.readCount?.toLocaleString() || 0}
                            </span>
                        </div>
                    </div>

                    <article className="w-full max-w-4xl px-6 flex flex-col gap-10">
                        <div
                            className="prose prose-zinc dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 text-lg leading-relaxed text-justify overflow-hidden break-words"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Share Signal Section */}
                        <div className="flex flex-col gap-6 py-4 border-y border-zinc-100 dark:border-zinc-900 my-2">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                                    <Share2 size={16} className="text-zinc-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Distribute Intel</span>
                                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Share this article</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 items-center">
                                {shareLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`Share on ${link.name}`}
                                        className={`flex flex-1 items-center justify-center w-16 h-12 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-all hover:scale-110 active:scale-95 bg-white dark:bg-zinc-950 shadow-sm ${link.name === "WhatsApp" ? "flex-2" : "flex-1"}`}
                                    >
                                        {link.icon}
                                    </a>
                                ))}
                                <button
                                    onClick={handleCopyLink}
                                    title="Copy Link"
                                    className="flex flex-1 items-center justify-center w-16 h-12 rounded-full border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all hover:scale-110 active:scale-95 shadow-sm"
                                >
                                    {copied ? <Check size={18} className="text-emerald-500" /> : <Link2 size={18} />}
                                </button>
                                {copied && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-in fade-in slide-in-from-left-2">Link Copied</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 h-[250px] md:h-[400px]">
                            <div className="relative h-full rounded-[2rem] overflow-hidden">
                                <Image src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80" alt="Gallery 1" fill className="object-cover" />
                            </div>
                            <div className="relative h-full rounded-[2rem] overflow-hidden">
                                <Image src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80" alt="Gallery 2" fill className="object-cover" />
                            </div>
                        </div>
                    </article>
                </div>

                {/* Related Articles */}
                <section className="w-full max-w-[1400px] mt-24 px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-2xl font-bold font-outfit">More from Mazlis</h2>
                        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {moreArticles?.data?.slice(0, 4).map(a => (
                            <Link key={a._id} href={`/articles/${a.slug}-${a._id}`} className="group flex flex-col gap-4">
                                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                    <Image src={getImageUrl(a.image)} alt={a.title} fill className="object-cover transition-transform group-hover:scale-105" />
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
