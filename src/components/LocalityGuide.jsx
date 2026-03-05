import React from 'react';
import localities from '../data/localities.json';

const LocalityGuide = () => {
    const localitySchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Neighborhoods Near Kekarav Bavdhan NA Plots",
        "description": "Guide to neighborhoods and localities near Kekarav Bavdhan premium NA bungalow plots in Pune.",
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
                    <span className="section-label" style={{ justifyContent: 'center' }}>Neighborhood Guide</span>
                    <h2 className="section-title">Premium Localities Near <span className="gold-text">Kekarav Bavdhan</span></h2>
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        Kekarav's strategic location in <strong>Bavdhan Hills</strong> places you at the heart of West Pune's most desirable neighborhoods.
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
                            <div className="locality-card-footer">
                                <div className="locality-card-detail">
                                    <span className="locality-detail-label">Price Range</span>
                                    <span className="locality-detail-value">{loc.priceComparison}</span>
                                </div>
                                <div className="locality-card-detail">
                                    <span className="locality-detail-label">Connectivity</span>
                                    <span className="locality-detail-value">{loc.connectivity}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LocalityGuide;
