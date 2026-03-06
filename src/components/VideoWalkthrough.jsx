import React from 'react';

const VideoWalkthrough = () => {
    const videoSchema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Kekarav Bavdhan Virtual Walkthrough & Township Tour",
        "description": "Virtual tour of Kekarav premium NA bungalow plots in Bavdhan Hills, Pune. Showcasing the 45-acre layout, clubhouse, and natural surroundings.",
        "thumbnailUrl": [
            "https://kekaravbavdhan.in/images/hero.png",
            "https://kekaravbavdhan.in/images/amenities.png"
        ],
        "uploadDate": "2026-03-01T08:00:00+08:00",
        "duration": "PT3M45S",
        "contentUrl": "https://kekaravbavdhan.in/videos/walkthrough.mp4",
        "embedUrl": "https://kekaravbavdhan.in/videos/walkthrough.mp4",
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "WatchAction" },
            "userInteractionCount": "2580"
        }
    };

    return (
        <section className="section video-walkthrough" id="virtual-tour" aria-label="Virtual Walkthrough">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
            />
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>Virtual Tour</span>
                    <h2 className="section-title">Experience <span className="gold-text">Kekarav Bavdhan</span></h2>
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        Take a 3D walkthrough of Pune's most premium <strong>NA Bungalow Plot</strong> township.
                    </p>
                </div>

                <div className="video-container animate-on-scroll">
                    {/* Simulated video player with a thumbnail overlay */}
                    <div className="video-player-mock">
                        <img src="/images/hero.png" alt="Kekarav Bavdhan Video Thumbnail" className="video-thumbnail" />
                        <div className="play-button-overlay">
                            <span className="play-icon">▶</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VideoWalkthrough;
