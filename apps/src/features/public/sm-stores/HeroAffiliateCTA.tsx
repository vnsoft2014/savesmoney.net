'use client';

import Link from 'next/link';

export default function HeroAffiliateCTA() {
    return (
        <section>
            <div
                className="relative overflow-hidden rounded-3xl
                bg-linear-to-br from-indigo-700 via-blue-700 to-cyan-600
                mb-10 p-3 sm:p-6 lg:p-10
                shadow-[0_10px_30px_-15px_rgba(0,0,0,0.4)]"
            >
                <div className="absolute -top-32 -right-32 h-104 w-104 rounded-full bg-cyan-400/20 blur-[120px]" />
                <div className="absolute -bottom-32 -left-32 h-104 w-104 rounded-full bg-indigo-400/20 blur-[120px]" />
                <div className="absolute inset-0 bg-white/4" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                    <div className="flex-1 text-center lg:text-left">
                        <div
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md
                                        px-4 py-2 rounded-full text-xs sm:text-sm
                                        text-white/90 mb-5 border border-white/10"
                        >
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Earn credits with every approved deal
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-5">
                            Welcome to{' '}
                            <span className="bg-linear-to-r from-cyan-200 to-white bg-clip-text text-transparent">
                                SM Stores
                            </span>
                        </h2>

                        <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed mx-auto lg:mx-0">
                            You can post deals and earn credits when customers buy products through your links.
                        </p>

                        <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-xs sm:text-sm text-white/80">
                            <div
                                className="w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center
                                            rounded-full bg-white/10 border border-white/10"
                            >
                                ✓
                            </div>
                            Posted deals will be verified and approved within 24 hours.
                        </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col items-center">
                        <Link
                            href="/post-deal"
                            className="group relative w-full sm:w-auto
                                       px-8 py-4 sm:px-10 sm:py-5
                                       bg-white text-indigo-700
                                       font-semibold text-base sm:text-lg
                                       rounded-2xl shadow-xl
                                       transition-all duration-300
                                       hover:-translate-y-1 hover:shadow-2xl
                                       active:scale-95 text-center"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                Post a Deal
                                <svg
                                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </span>

                            <div
                                className="absolute inset-0 rounded-2xl
                                            bg-linear-to-r from-indigo-500 to-cyan-500
                                            opacity-0 group-hover:opacity-10 transition"
                            />
                        </Link>

                        <p className="text-center text-xs text-white/70 mt-3">Takes less than 1 minute</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
