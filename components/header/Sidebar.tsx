"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronRight, LogOut } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { getImageUrl } from '@/lib/config';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    isAuthenticated: boolean;
    onLogoutClick: () => void;
    onSignInClick: () => void;
    navLinks: Array<{ label: string; href: string }>;
    currentTime: string;
}

export default function Sidebar({
    isOpen,
    onClose,
    user,
    isAuthenticated,
    onLogoutClick,
    onSignInClick,
    navLinks,
    currentTime
}: SidebarProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200]">
                    {/* Backdrop with heavy blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-zinc-900/40 dark:bg-black/80 backdrop-blur-md"
                    />

                    {/* Floating Sidebar Content */}
                    <motion.div
                        initial={{ x: "-100%", opacity: 0, scale: 0.95 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ x: "-100%", opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute left-4 top-4 bottom-4 w-[calc(100%-2rem)] md:w-[350px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl rounded-[2rem] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 overflow-hidden"
                    >
                        {/* Header inside Sidebar */}
                        <div className="p-6 md:p-8 flex items-center justify-between">
                            <div className="flex flex-col">
                                <Link href="/" onClick={onClose} className="font-outfit font-black text-xl tracking-tighter text-zinc-900 dark:text-white uppercase">Mazlis.</Link>
                                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 tracking-[0.3em] uppercase mt-1">Intelligence Agency</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ThemeToggle />
                                <button
                                    onClick={onClose}
                                    className="p-3 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90"
                                >
                                    <X size={20} className="text-zinc-900 dark:text-zinc-100" />
                                </button>
                            </div>
                        </div>

                        {/* Main Navigation */}
                        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-4 flex flex-col">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-300 dark:text-zinc-700 mb-4">Navigation</span>
                                <nav className="flex flex-col gap-1">
                                    {navLinks.map((link, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                            key={link.label}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={onClose}
                                                className="group flex items-center gap-3 py-2"
                                            >
                                                <span className="text-xl md:text-2xl font-bold font-outfit tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:translate-x-1 transition-transform duration-300">
                                                    {link.label}
                                                </span>
                                                <div className="h-[2px] w-0 group-hover:w-8 bg-zinc-900 dark:bg-white transition-all duration-300 mt-2" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>
                            </div>

                            {/* Lifestyle / Extra Content */}
                            <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">Global Office</span>
                                        <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-300">Darbhanga, Bihar</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">Local Time</span>
                                        <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-300">{currentTime}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Actions Cluster */}
                        <div className="p-6 md:p-8 bg-zinc-50/50 dark:bg-zinc-800/20 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800/50">
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Join Mazlis</span>
                                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">Subscribe for deep-dive investigations.</span>
                                    </div>
                                    <button className="p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-transform active:scale-95">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                {!isAuthenticated ? (
                                    <button
                                        onClick={onSignInClick}
                                        className="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        Sign In
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-between py-3 px-5 rounded-xl bg-white dark:bg-zinc-800 shadow-sm">
                                        <Link href="/profile" onClick={onClose} className="flex items-center gap-3 group">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-700 overflow-hidden flex items-center justify-center text-[10px] font-bold group-hover:bg-zinc-900 dark:group-hover:bg-white dark:group-hover:text-zinc-900 transition-all relative">
                                                {user?.avatar ? (
                                                    <Image
                                                        src={getImageUrl(user.avatar)}
                                                        alt="Avatar"
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    user?.fullName[0]
                                                )}
                                            </div>
                                            <span className="text-xs font-bold dark:text-white underline underline-offset-4">{user?.fullName.split(' ')[0]}</span>
                                        </Link>
                                        <button onClick={onLogoutClick} className="text-zinc-400 hover:text-red-500 transition-colors">
                                            <LogOut size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
