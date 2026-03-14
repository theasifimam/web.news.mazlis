import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DiscoveryFeed from '@/components/DiscoveryFeed';
import LatestArticles from '@/components/LatestArticles';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-zinc-900 dark:selection:bg-zinc-100 selection:text-white dark:selection:text-zinc-900 transition-colors duration-300">
      <Header />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 lg:px-12 font-sans pt-8 md:pt-16">

        <DiscoveryFeed />

        <LatestArticles />

        {/* Whitepapers List Design */}
        <section className="mb-32">
          <div className="mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-zinc-100 mb-3">Technical Analysis</h2>
            <p className="text-zinc-500 text-sm font-light">In-depth structured data reports for institutional subscribers.</p>
          </div>

          <div className="flex flex-col border-t border-zinc-200 dark:border-zinc-800">
            {[
              { tag: 'SECURITY', date: 'FEB 18', title: 'Zero-knowledge protocols in state-level infrastructure.', docId: 'ZKP-092' },
              { tag: 'ECONOMICS', date: 'FEB 15', title: 'Synthetic scarcity and the liquidity of digital assets.', docId: 'SYN-014' },
              { tag: 'POLICY', date: 'FEB 12', title: 'Intergenerational equity in climate adaptation plans.', docId: 'POL-044' },
              { tag: 'TECH', date: 'FEB 08', title: 'The thermodynamic limits of proof-of-stake systems.', docId: 'TDM-088' }
            ].map((paper, idx) => (
              <Link href={`/whitepapers/${idx}`} key={idx} className="group py-8 flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 transition-colors gap-6 md:gap-8 px-4 -mx-4">
                <div className="flex items-center gap-6 md:w-1/4 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 w-16">{paper.date}</span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-sm px-2.5 py-1 bg-white dark:bg-zinc-950">{paper.tag}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-medium font-outfit tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:hover:text-zinc-400 dark:text-zinc-400 transition-colors flex-1">
                  {paper.title}
                </h3>

                <div className="flex items-center gap-6 md:w-1/5 shrink-0 justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 hidden md:block">{paper.docId}</span>
                  <ArrowRight size={18} className="text-zinc-300 group-hover:text-zinc-900 dark:hover:text-zinc-100 dark:text-zinc-100 transition-colors transform group-hover:translate-x-2" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

// Minimal Arrow Icon for internal use
function ArrowRight({ size = 16, className = "" }: { size?: number, className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  )
}
