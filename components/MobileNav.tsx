"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Search, label: 'Search', href: '/search' },
        { icon: User, label: 'Profile', href: '/profile' },
    ];

    return (
        <div className="md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] h-20 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-zinc-100 dark:border-zinc-900 rounded-full flex items-center justify-between px-6 z-[100] shadow-2xl shadow-black/5 transition-all duration-500">
            {/* Brand N Button */}
            <div className="w-12 h-12 rounded-full bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center shrink-0">
                <span className="font-outfit font-black text-xl text-white dark:text-zinc-950 tracking-tighter">N</span>
            </div>

            <div className="flex-1 flex items-center justify-around gap-2 ml-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} className="relative group p-2">
                            <div className={`transition-all duration-300 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-300 dark:text-zinc-700'}`}>
                                <item.icon size={26} strokeWidth={isActive ? 2.5 : 1.5} />
                            </div>
                            {isActive && (
                                <motion.div
                                    layoutId="activeNavIndicator"
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-white"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
