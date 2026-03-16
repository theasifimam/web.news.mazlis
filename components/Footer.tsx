import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="hidden md:block w-full bg-[#fcfcfc] dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 pt-24 pb-12 px-6 lg:px-12 border-t border-zinc-200 dark:border-zinc-800 mt-auto transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8 border-b border-zinc-200 dark:border-zinc-800 pb-16">

                {/* Brand & Description */}
                <div className="flex flex-col gap-6 max-w-sm">
                    <Link href="/" className="font-outfit font-black text-3xl tracking-tighter text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
                        MAZLIS.
                    </Link>
                    <p className="text-sm font-light leading-relaxed text-zinc-500 dark:text-zinc-400 italic">
                        "A weekly publication dedicated to the intersection of architecture, technology, and political philosophy. Focusing on the systems that define our reality."
                    </p>
                </div>

                {/* Minimal Navigation */}
                <div className="flex flex-col sm:flex-row gap-16 sm:gap-24 lg:gap-32">
                    <div className="flex flex-col gap-6">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Directory</h4>
                        <nav className="flex flex-col gap-4 text-sm font-medium transition-all">
                             <Link href="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">About Us</Link>
                             <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Contact</Link>
                             <Link href="/legal/faq" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Help & FAQ</Link>
                         </nav>
                     </div>
 
                     <div className="flex flex-col gap-6 font-sans">
                         <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500">Legal Policies</h4>
                         <nav className="flex flex-col gap-4 text-sm font-medium transition-all">
                             <Link href="/legal/privacy-policy" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Privacy Policy</Link>
                             <Link href="/legal/terms-conditions" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Terms of Service</Link>
                             <Link href="/legal/cookie-usage" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">Cookie Usage</Link>
                         </nav>
                     </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-[1400px] mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-600">
                <p>&copy; {new Date().getFullYear()} MAZLIS NEWS. ALL RIGHTS RESERVED.</p>
                <div className="flex items-center gap-6">
                    <span className="text-zinc-500 dark:text-zinc-500">Global Edition</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                    <span className="text-zinc-500 dark:text-zinc-500">Independent Journalism</span>
                </div>
            </div>
        </footer>
    );
}
