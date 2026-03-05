import React, { useState } from 'react';
import keywordsList from '../data/keywords.json';

const SeoKeywordsMatrix = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Generate the ItemList schema for JSON-LD compliance
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Kekarav Bavdhan Plot Search Terms",
        "description": "Comprehensive list of search terms and relevant property criteria for Kekarav NA Bungalow Plots in Bavdhan, Pune.",
        "itemListElement": keywordsList.map((kw, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": kw
        }))
    };

    return (
        <section className="bg-[#0f172a] text-slate-300 py-12 px-6 border-t border-slate-800">
            {/* 1. Programmatic SEO injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* 2. Visual "Popular Searches" Matrix Footer Element */}
            <div className="max-w-7xl mx-auto">
                <div
                    className="flex justify-between items-center cursor-pointer select-none group"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <h3 className="text-xl font-cinzel text-amber-500 font-bold tracking-wide">
                        Popular Real Estate Searches in Pune
                    </h3>
                    <button
                        className="text-amber-500 transform transition-transform duration-300"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        aria-label="Toggle popular searches"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <div className={`transition-all duration-700 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs opacity-70">
                        {keywordsList.slice(0, 1000).map((keyword, i) => (
                            <span
                                key={i}
                                className="hover:text-amber-400 transition-colors duration-200 cursor-default truncate pr-2 block"
                                title={keyword}
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                    <div className="mt-8 pt-4 border-t border-slate-800/50 text-center text-[10px] opacity-50">
                        Showing exact match terms for premium residential plotting, NA sanctioned domains, and lifestyle villas within Pune municipal limits.
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SeoKeywordsMatrix;
