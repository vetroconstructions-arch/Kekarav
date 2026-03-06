import React from 'react';
import localities from '../data/localities.json';

const LocalityGuide = ({ t }) => {
    if (!t) return null;

    const localitySchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": t.title,
        "description": t.subtitle,
        "itemListElement": localities.map((loc, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": `${loc.name} - ${loc.distance} from Kekarav Bavdhan`,
            "description": loc.description
        }))
    };

    return (
        <section className="section locality-guide" id="locality-guide" aria-label="Neighborhood Guide">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localitySchema) }}
            />
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>{t.label}</span>
                    <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.title.replace('Kekarav Bavdhan', '<span class=\"gold-text\">Kekarav Bavdhan</span>') }} />
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        {t.subtitle}
                    </p>
                </div>

                <div className="locality-grid animate-on-scroll">
                    {localities.map((loc, i) => (
                        <article
                            className="locality-card"
                            key={loc.name}
                            data-stagger
                            style={{
                                opacity: 0,
                                transform: 'translateY(25px)',
                                transition: `all 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.08}s`
                            }}
                        >
                            <div className="locality-card-header">
                                <h3 className="locality-card-name">{loc.name}</h3>
                                <span className="locality-card-distance">{loc.distance}</span>
                            </div>
                            <p className="locality-card-desc">{loc.description}</p>
                            <div className="locality-card-highlights">
                                {loc.highlights.map((h, j) => (
                                    <span className="locality-highlight-tag" key={j}>{h}</span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocalityGuide;
