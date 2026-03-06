import React, { useState, useEffect } from 'react';

const StickyActionBar = ({ onBookVisit }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show action bar after scrolling past the hero section (approx 600px)
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="sticky-action-bar">
            <div className="sab-content">
                <div className="sab-text">
                    <span className="sab-price">₹1.9 Cr Onwards</span>
                    <span className="sab-desc">Premium NA Plots in PMC Limits</span>
                </div>
                <div className="sab-actions">
                    <button className="btn btn-white sab-btn-whatsapp" onClick={() => window.open('https://wa.me/917744009295', '_blank')}>
                        WhatsApp
                    </button>
                    <button className="btn btn-primary sab-btn-book" onClick={onBookVisit}>
                        Book Site Visit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StickyActionBar;
