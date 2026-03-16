"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ThemeToggle } from './ThemeToggle';
import AuthModal from './AuthModal';
import { LogOut, Menu, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { clearCredentials } from '@/lib/store/authSlice';
import { useSignoutMutation } from '@/lib/api/authApi';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

// Dynamic imports for improved initial load performance
const Sidebar = dynamic(() => import('./header/Sidebar'), { ssr: false });
const LogoutConfirm = dynamic(() => import('./header/LogoutConfirm'), { ssr: false });

export default function Header() {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((s) => s.auth);
    const [signout] = useSignoutMutation();

    const handleLogout = async () => {
        try {
            await signout().unwrap();
        } catch {/* ignore */ } finally {
            dispatch(clearCredentials());
            setIsLogoutConfirmOpen(false);
            setIsMenuOpen(false);
            toast.success('Signed out successfully.');
        }
    };

    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

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
                hour12: true
            }));
        }, 1000);

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);

        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            clearInterval(timer);
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Articles", href: "/articles" },
        { label: "About", href: "/about" },
        ...(isAuthenticated ? [{ label: "Profile", href: "/profile" }] : []),
        { label: "Search", href: "/search" },
    ];

    const pathname = usePathname();
    const isArticlePage = pathname.includes('/articles/');
    const isProfilePage = pathname === '/profile';
    const isDiscoverPage = pathname === '/search';
    const isHomePage = pathname === '/';

    const headerBg = isScrolled
        ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 shadow-sm'
        : (isHomePage || isArticlePage || isProfilePage || isDiscoverPage)
            ? 'bg-transparent'
            : 'bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900';

    const contentColor = (!isScrolled && (isHomePage || isArticlePage || isProfilePage || isDiscoverPage)) ? 'text-white' : 'text-zinc-900 dark:text-zinc-100';

    return (
        <>
            <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}>
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-14 md:h-16 flex items-center justify-between relative transition-all duration-300">
                    {/* Left Section: Menu / Back */}
                    <div className="flex items-center gap-4">
                        {isArticlePage ? (
                            <Link
                                href="/"
                                className={`p-2 -ml-2 transition-transform active:scale-90 ${contentColor}`}
                            >
                                <ArrowLeft size={24} strokeWidth={1.5} />
                            </Link>
                        ) : (
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className={`p-2 -ml-2 transition-transform active:scale-90 ${contentColor}`}
                            >
                                <Menu size={24} strokeWidth={1.5} />
                            </button>
                        )}
                    </div>

                    {/* Center Section: Logo (Mobile Only) */}
                    <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
                        {(isScrolled || (!isHomePage && !isArticlePage)) && (
                            <Link href="/" className="font-outfit font-black text-xl tracking-tighter text-zinc-900 dark:text-white">
                                MAZLIS<span className="text-zinc-400">.</span>
                            </Link>
                        )}
                    </div>

                    {/* Right Section: Actions */}
                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="hidden md:flex items-center gap-6">
                            {isAuthenticated && user ? (
                                <div className="flex items-center gap-3">
                                    <Link href="/profile" className={`text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-zinc-500 ${contentColor}`}>{user.fullName.split(' ')[0]}</Link>
                                    <button onClick={() => setIsLogoutConfirmOpen(true)} className="text-zinc-400 hover:text-red-500 transition-colors">
                                        <LogOut size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setAuthTab('signin'); setIsAuthOpen(true); }}
                                    className={`text-[10px] font-black uppercase tracking-widest transition-colors hover:text-zinc-500 ${contentColor}`}
                                >
                                    Signin
                                </button>
                            )}
                            <div className={`w-[1px] h-4 transition-colors ${isScrolled ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-white/20'}`} />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            <Sidebar 
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                user={user}
                isAuthenticated={isAuthenticated}
                onLogoutClick={() => setIsLogoutConfirmOpen(true)}
                onSignInClick={() => { setIsMenuOpen(false); setAuthTab('signin'); setIsAuthOpen(true); }}
                navLinks={navLinks}
                currentTime={currentTime}
            />

            <LogoutConfirm 
                isOpen={isLogoutConfirmOpen}
                onClose={() => setIsLogoutConfirmOpen(false)}
                onConfirm={handleLogout}
            />

            <AuthModal
                isOpen={isAuthOpen}
                onOpenChange={setIsAuthOpen}
                defaultTab={authTab}
            />
        </>
    );
}
