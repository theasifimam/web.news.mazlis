"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/lib/store/hooks';
import { getImageUrl } from '@/lib/config';
import Image from 'next/image';

export default function MobileNav() {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAppSelector((s) => s.auth);

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Search, label: 'Search', href: '/search' },
        { icon: User, label: 'Profile', href: '/profile' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-900 px-8 py-4 z-[100] safe-area-bottom">
            <div className="max-w-md mx-auto flex items-center justify-between">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const isProfile = item.label === 'Profile';

                    return (
                        <Link key={item.href} href={item.href} className="relative flex flex-col items-center gap-1 group">
                            <div className={`transition-all duration-300 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600'}`}>
                                {isProfile && isAuthenticated && user ? (
                                    <div className={`w-6 h-6 rounded-full overflow-hidden border-2 h-7 w-7 transition-all ${isActive ? 'border-zinc-900 dark:border-white scale-110' : 'border-transparent'}`}>
                                        <Image
                                            src={user.avatar ? getImageUrl(user.avatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=18181b&color=ffffff`}
                                            alt={user.fullName}
                                            width={28}
                                            height={28}
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                ) : (
                                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
                                )}
                            </div>
                            {isActive && !isProfile && (
                                <motion.div
                                    layoutId="activeNavIndicator"
                                    className="w-1 h-1 rounded-full bg-zinc-900 dark:bg-white"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
