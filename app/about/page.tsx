import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
            <Header />

            {/* Hero Section */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-24">
                <section className="max-w-4xl">
                    <div className="flex items-center gap-4 mb-10">
                        <span className="w-12 h-[1px] bg-zinc-900"></span>
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-900">Our Mission</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black font-outfit tracking-tighter text-zinc-900 leading-[0.9] mb-12 uppercase">
                        Modern <br /> Journalism. <br /> Zero Noise.
                    </h1>

                    <p className="text-2xl md:text-3xl font-light leading-relaxed text-zinc-500 italic mb-20 max-w-3xl">
                        "Mazlis was founded on a single premise: that the infrastructure of our information determines the quality of our reality."
                    </p>
                </section>

                {/* The Manifesto - Dual Column */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 border-t border-zinc-900 pt-20">
                    <div className="flex flex-col gap-10">
                        <h2 className="text-4xl font-black font-outfit tracking-tighter text-zinc-900 uppercase">The Problem.</h2>
                        <p className="text-zinc-600 leading-loose text-lg font-light">
                            In an era defined by attention metrics and algorithmic velocity, depth has become a luxury. We are surrounded by high-frequency signals that provide immediate reaction but zero reflection. This isn't just a failure of journalism; it's a structural failure of our digital environment.
                        </p>
                    </div>

                    <div className="flex flex-col gap-10">
                        <h2 className="text-4xl font-black font-outfit tracking-tighter text-zinc-900 uppercase">The Inquiry.</h2>
                        <p className="text-zinc-600 leading-loose text-lg font-light">
                            Mazlis is an independent laboratory for investigative journalism. We don't just report on events; we investigate the underlying architectures—technical, political, and social—that make those events possible. We prioritize the "hard core" over the "soft surface."
                        </p>
                    </div>
                </section>

                {/* Visual Break */}
                <section className="my-32">
                    <div className="aspect-[21/9] rounded-[3rem] overflow-hidden bg-zinc-100 border border-zinc-100 shadow-2xl shadow-zinc-200 relative group">
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 transition-transform duration-1000"
                            alt="Manifesto Background"
                        />
                        <div className="absolute inset-0 bg-zinc-900/10 pointer-events-none"></div>
                        <div className="absolute inset-x-0 bottom-12 px-12 flex justify-between items-end text-white">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">LOC / COPENHAGEN HQ</span>
                                <span className="text-2xl font-black tracking-tighter tracking-widest uppercase">MAZLIS LABS</span>
                            </div>
                            <span className="text-6xl font-black opacity-20 italic">01 //</span>
                        </div>
                    </div>
                </section>

                {/* Values Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
                    {[
                        { title: 'SIGNAL', desc: 'We only publish when we have something significant to add to the discourse.' },
                        { title: 'INDEPENDENCE', desc: 'No venture capital. No advertisers. Only community and curiosity.' },
                        { title: 'RIGOR', desc: 'Every dispatch undergoes a multi-layer technical verifying process.' }
                    ].map((value) => (
                        <div key={value.title} className="flex flex-col gap-6 p-10 bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-12 h-12 bg-zinc-900 text-white rounded-full flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                {value.title[0]}
                            </div>
                            <h3 className="text-xl font-bold font-outfit tracking-tight text-zinc-900 uppercase">{value.title}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed font-light">{value.desc}</p>
                        </div>
                    ))}
                </section>
            </main>

            <Footer />
        </div>
    );
}
