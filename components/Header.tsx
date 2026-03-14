"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import AuthModal from './AuthModal';
import { ArrowRight, Bell, ChevronRight, Globe, LogOut, Menu, Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { clearCredentials } from '@/lib/store/authSlice';
import { useSignoutMutation } from '@/lib/api/authApi';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((s) => s.auth);
    const [signout] = useSignoutMutation();

    const handleLogout = async () => {
        try {
            await signout().unwrap();
        } catch {/* ignore */ } finally {
            dispatch(clearCredentials());
            toast.success('Signed out successfully.');
        }
    };

    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    const headerBgOpacity = useTransform(scrollY, [0, 50], [0, 1]);
    const headerPadding = useTransform(scrollY, [0, 50], ["1.5rem", "0.5rem"]);
    const logoScale = useTransform(scrollY, [0, 50], [1, 0.65]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }));
        }, 1000);

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);

        if (isMenuOpen || isSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            clearInterval(timer);
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen, isSearchOpen]);

    const navLinks = [
        { label: "Manifesto", href: "/about" },
        { label: "Investigations", href: "/articles" },
        { label: "Infrastructure", href: "#" },
        { label: "Polity", href: "#" },
        { label: "Archive", href: "#" },
        { label: "Contact", href: "/contact" },
    ];

    const pathname = usePathname();
    const isArticlePage = pathname.includes('/articles/');
    const isHomePage = pathname === '/';

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900' : 'bg-white dark:bg-[#0a0a0a]'}`}>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between relative">
                    {/* Left Section: Menu (Mobile) / Brand (Desktop) */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="p-2 -ml-2 text-zinc-900 dark:text-zinc-100 transition-transform active:scale-90"
                        >
                            <Menu size={24} strokeWidth={1.5} />
                        </button>

                        {/* Minimal Desktop Brand - Only shows on larger screens to avoid overlap */}
                        <Link href="/" className="hidden md:block font-outfit font-black text-xl tracking-tighter text-zinc-900 dark:text-white">
                            MAZLIS<span className="text-zinc-400">.</span>
                        </Link>
                    </div>

                    {/* Center Section: Logo (Mobile Only) */}
                    <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
                        <Link href="/" className="font-outfit font-black text-xl tracking-tighter text-zinc-900 dark:text-white">
                            MAZLIS<span className="text-zinc-400">.</span>
                        </Link>
                    </div>

                    {/* Right Section: Actions */}
                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="hidden md:flex items-center gap-6">
                            {isAuthenticated && user ? (
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{user.fullName.split(' ')[0]}</span>
                                    <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500 transition-colors">
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setAuthTab('signin'); setIsAuthOpen(true); }}
                                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                >
                                    Login
                                </button>
                            )}
                            <div className="w-[1px] h-4 bg-zinc-100 dark:bg-zinc-800" />
                            <ThemeToggle />
                        </div>

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-zinc-900 dark:text-zinc-100 transition-transform active:scale-90"
                        >
                            <Search size={22} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Spacer to give content room */}
            <div className="h-16 md:h-20"></div>

            {/* Sidebar / Premium Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[200]">
                        {/* Backdrop with heavy blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute inset-0 bg-zinc-900/40 dark:bg-black/80 backdrop-blur-md"
                        />

                        {/* Floating Sidebar Content */}
                        <motion.div
                            initial={{ x: "-100%", opacity: 0, scale: 0.95 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: "-100%", opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute left-4 top-4 bottom-4 w-[calc(100%-2rem)] md:w-[480px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/5 overflow-hidden"
                        >
                            {/* Header inside Sidebar */}
                            <div className="p-8 md:p-12 flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="font-outfit font-black text-2xl tracking-tighter text-zinc-900 dark:text-white uppercase">Mazlis.</span>
                                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 tracking-[0.3em] uppercase mt-1">Intelligence Agency</span>
                                </div>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-4 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-all active:scale-90"
                                >
                                    <X size={20} className="text-zinc-900 dark:text-zinc-100" />
                                </button>
                            </div>

                            {/* Main Navigation */}
                            <div className="flex-1 overflow-y-auto px-8 md:px-12 py-4 flex flex-col">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 dark:text-zinc-700 mb-6">Directory</span>
                                    <nav className="flex flex-col gap-2">
                                        {navLinks.map((link, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 + idx * 0.05 }}
                                                key={link.label}
                                            >
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="group flex items-center gap-4 py-3"
                                                >
                                                    <span className="text-4xl md:text-5xl font-bold font-outfit tracking-tighter text-zinc-900 dark:text-zinc-100 group-hover:translate-x-2 transition-transform duration-300">
                                                        {link.label}
                                                    </span>
                                                    <div className="h-[2px] w-0 group-hover:w-8 bg-zinc-900 dark:bg-white transition-all duration-300 mt-2" />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </nav>
                                </div>

                                {/* Lifestyle / Extra Content */}
                                <div className="mt-16 pt-12 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">Global Office</span>
                                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-300">København, Denmark</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-600">Local Time</span>
                                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-300">{currentTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Actions Cluster */}
                            <div className="p-8 md:p-12 bg-zinc-50/50 dark:bg-zinc-800/20 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800/50">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">Unrestricted Access</span>
                                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">Subscribe for deep-dive investigations.</span>
                                        </div>
                                        <button className="p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full hover:scale-105 transition-transform active:scale-95">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>

                                    {!isAuthenticated ? (
                                        <button
                                            onClick={() => { setIsMenuOpen(false); setAuthTab('signin'); setIsAuthOpen(true); }}
                                            className="w-full py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-black uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            Agent Login
                                        </button>
                                    ) : (
                                        <div className="flex items-center justify-between py-4 px-6 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold">
                                                    {user?.fullName[0]}
                                                </div>
                                                <span className="text-xs font-bold dark:text-white underline underline-offset-4">{user?.fullName.split(' ')[0]}</span>
                                            </div>
                                            <button onClick={handleLogout} className="text-zinc-400 hover:text-red-500 transition-colors">
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

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white dark:bg-[#0a0a0a] z-[200] flex flex-col"
                    >
                        <div className="max-w-[1400px] mx-auto w-full px-6 pt-12 flex justify-between items-center">
                            <span className="font-outfit font-black text-2xl tracking-tighter text-zinc-900 dark:text-white">MAZLIS.</span>
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="p-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-white rounded-full transition-colors"
                            >
                                <X size={32} strokeWidth={1} />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-6 gap-10 md:gap-16">
                            <div className="w-full flex flex-col gap-6 md:gap-8">
                                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-500 text-center">Inquiry Engine</span>
                                <div className="relative group">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Enter Topic..."
                                        className="w-full bg-transparent text-3xl sm:text-4xl md:text-7xl font-bold font-outfit tracking-tighter text-center focus:outline-none placeholder:text-zinc-200 dark:placeholder:text-zinc-800 dark:text-white"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-100 dark:bg-zinc-900 group-focus-within:bg-zinc-900 dark:group-focus-within:bg-zinc-100 transition-colors" />
                                </div>
                            </div>

                            <div className="hidden sm:flex flex-col gap-10 w-full text-center md:text-left">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300 dark:text-zinc-700 flex items-center justify-center gap-4">
                                    <span className="w-8 h-[1px] bg-zinc-100 dark:bg-zinc-900"></span>
                                    Significant Keywords
                                    <span className="w-8 h-[1px] bg-zinc-100 dark:bg-zinc-900"></span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {[
                                        'Infrastructural Fragility',
                                        'Decentralized Protocols',
                                        'Technical Debt in Policy',
                                        'Copenhagen Collective'
                                    ].map((item) => (
                                        <button key={item} className="flex flex-col gap-4 text-left group p-6 rounded-3xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800">
                                            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{item}</span>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-900 dark:group-hover:text-zinc-300 transition-colors">
                                                Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AuthModal
                isOpen={isAuthOpen}
                onOpenChange={setIsAuthOpen}
                defaultTab={authTab}
            />
        </>
    );
}
