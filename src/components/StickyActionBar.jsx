import React, { useState, useEffect } from 'react';

const StickyActionBar = ({ t, onBookVisit }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible || !t) return null;

    return (
        <div className="sticky-action-bar visible">
            <div className="sab-content">
                <div className="sab-text">
                    <span className="sab-price">₹1.9 Cr+</span>
                    <span className="sab-desc">{t.visit}</span>
                </div>
                <div className="sab-actions">
                    <button className="btn btn-white sab-btn-whatsapp" onClick={() => window.open('https://wa.me/917744009295', '_blank')}>
                        WhatsApp
                    </button>
                    <button className="btn btn-primary sab-btn-book" onClick={onBookVisit}>
                        {t.visit}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StickyActionBar;
