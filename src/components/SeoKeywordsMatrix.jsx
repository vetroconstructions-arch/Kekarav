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
        <section style={{
            backgroundColor: '#0A2E29',
            color: '#A0ABAA',
            padding: '3rem 1.5rem',
            borderTop: '1px solid rgba(197, 160, 89, 0.1)'
        }}>
            {/* 1. Programmatic SEO injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* 2. Visual "Popular Searches" Matrix Footer Element */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        userSelect: 'none'
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <h3 style={{
                        fontFamily: "'Cinzel Decorative', cursive",
                        color: '#C5A059',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        letterSpacing: '1px',
                        margin: 0
                    }}>
                        Popular Real Estate Searches in Pune
                    </h3>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#C5A059',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                        aria-label="Toggle popular searches"
                    >
                        <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                <div style={{
                    transition: 'all 0.5s ease-in-out',
                    maxHeight: isOpen ? '1000px' : '0',
                    opacity: isOpen ? '1' : '0',
                    overflow: 'hidden',
                    marginTop: isOpen ? '1.5rem' : '0'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '0.75rem',
                        fontSize: '0.75rem',
                        opacity: '0.7'
                    }}>
                        {keywordsList.slice(0, 500).map((keyword, i) => (
                            <span
                                key={i}
                                style={{
                                    display: 'block',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                title={keyword}
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                    <div style={{
                        marginTop: '2rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        textAlign: 'center',
                        fontSize: '10px',
                        opacity: '0.5'
                    }}>
                        Showing exact match terms for premium residential plotting, NA sanctioned domains, and lifestyle villas within Pune municipal limits.
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SeoKeywordsMatrix;
