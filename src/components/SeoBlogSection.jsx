import React, { useState } from 'react';
import articles from '../data/blogArticles.json';

const SeoBlogSection = () => {
    const [expandedId, setExpandedId] = useState(null);

    // Generate Article structured data for each blog post
    const articleSchemas = articles.map(article => ({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.metaDescription,
        "keywords": article.keywords.join(", "),
        "datePublished": article.date,
        "dateModified": article.date,
        "author": {
            "@type": "Organization",
            "name": "Kekarav Bavdhan",
            "url": "https://kekaravbavdhan.in/"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Kekarav Bavdhan",
            "url": "https://kekaravbavdhan.in/",
            "logo": {
                "@type": "ImageObject",
                "url": "https://kekaravbavdhan.in/images/hero.webp"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://kekaravbavdhan.in/blog/${article.id}`
        },
        "image": "https://kekaravbavdhan.in/images/hero.webp",
        "articleSection": "Real Estate Investment",
        "inLanguage": "en-IN"
    }));

    return (
        <section className="section blog-section" id="blog" aria-label="Real Estate Insights Blog">
            {/* Inject all Article schemas */}
            {articleSchemas.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}

            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>Real Estate Insights</span>
                    <h2 className="section-title">Expert Guides on <span className="gold-text">NA Plots & Real Estate</span> in Pune</h2>
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        In-depth articles on <strong>NA plot investment</strong>, Bavdhan's growth story, and expert advice for smart property buyers.
                    </p>
                </div>

                <div className="blog-grid animate-on-scroll">
                    {articles.map((article, i) => (
                        <article
                            className={`blog-card ${expandedId === article.id ? 'expanded' : ''}`}
                            key={article.id}
                            data-stagger
                            style={{
                                opacity: 0,
                                transform: 'translateY(30px)',
                                transition: `all 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`
                            }}
                        >
                            <div className="blog-card-header">
                                <div className="blog-card-meta">
                                    <span className="blog-card-date">{new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    <span className="blog-card-read">{article.readTime} read</span>
                                </div>
                                <h3 className="blog-card-title">{article.title}</h3>
                                <p className="blog-card-excerpt">{article.metaDescription}</p>
                            </div>

                            <div className={`blog-card-content ${expandedId === article.id ? 'open' : ''}`}>
                                {article.content.split('\n\n').map((para, j) => (
                                    <p key={j}>{para}</p>
                                ))}
                                <div className="blog-card-keywords">
                                    {article.keywords.map((kw, k) => (
                                        <span className="blog-keyword-tag" key={k}>{kw}</span>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="blog-card-toggle"
                                onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                                aria-expanded={expandedId === article.id}
                            >
                                {expandedId === article.id ? 'Read Less ↑' : 'Read Full Article →'}
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SeoBlogSection;
