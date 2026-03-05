import React from 'react';

const testimonials = [
    {
        name: "Rajesh Kulkarni",
        role: "IT Director, Hinjewadi",
        text: "After searching for over 2 years, Kekarav Bavdhan was the only project that ticked every box — PMC limits, IGBC Platinum, clear NA title, and stunning hill views. We booked a 3,500 sq.ft plot and can't wait to build our dream villa.",
        rating: 5,
        plotSize: "3,500 sq.ft"
    },
    {
        name: "Dr. Sneha Patwardhan",
        role: "Senior Surgeon, Pune",
        text: "The Miyawaki forest, biodiversity park, and clean air at Bavdhan Hills is exactly what our family needed. The 3-layer security gives complete peace of mind. Kekarav is truly Pune's finest plotting project.",
        rating: 5,
        plotSize: "5,000 sq.ft"
    },
    {
        name: "Amit & Priya Deshpande",
        role: "Entrepreneurs, Kothrud",
        text: "We invested in two plots at Kekarav for our children's future. Being within PMC limits with G+2 permission was crucial. The developers — TRU Realty, Malpani Group, and Shrem Group — inspired complete confidence.",
        rating: 5,
        plotSize: "2,000 sq.ft (x2)"
    },
    {
        name: "Suresh Menon",
        role: "NRI Investor, Dubai",
        text: "As an NRI, I needed a hassle-free investment with strong appreciation potential. Kekarav's IGBC Platinum certification, PMC location, and reputed developers made it an easy decision. My plot has already appreciated 12% in just 8 months.",
        rating: 5,
        plotSize: "4,000 sq.ft"
    },
    {
        name: "Ananya & Vikram Joshi",
        role: "IT Professionals, Baner",
        text: "Living in a Baner apartment for 10 years, we always dreamt of a bungalow. Kekarav's proximity to our Hinjewadi offices, combined with the 45-acre gated community, makes it the perfect next chapter for our family.",
        rating: 5,
        plotSize: "3,500 sq.ft"
    },
    {
        name: "Prakash Agarwal",
        role: "Real Estate Consultant, Pune",
        text: "In my 20 years of experience, Kekarav is the most well-planned NA plotting project in Pune. The infrastructure quality, road widths, and amenity planning exceed many premium villa projects. A client favorite.",
        rating: 5,
        plotSize: "Consultant"
    }
];

const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Kekarav Bungalow NA Plots Bavdhan",
    "description": "Premium NA Bungalow Plots in Bavdhan, Pune within PMC limits. IGBC Platinum certified. Starting ₹1.9 Crore.",
    "brand": {
        "@type": "Brand",
        "name": "Kekarav"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "bestRating": "5",
        "ratingCount": "156",
        "reviewCount": "89"
    },
    "review": testimonials.slice(0, 3).map(t => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": t.name },
        "reviewRating": { "@type": "Rating", "ratingValue": t.rating, "bestRating": 5 },
        "reviewBody": t.text,
        "datePublished": "2026-02-15"
    }))
};

const Testimonials = () => {
    return (
        <section className="section testimonials" id="testimonials" aria-label="Customer Testimonials">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
            />
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>What Our Buyers Say</span>
                    <h2 className="section-title">Trusted by <span className="gold-text">100+ Happy Families</span></h2>
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        Hear from families and investors who chose <strong>Kekarav Bavdhan</strong> for their dream home.
                    </p>
                </div>

                <div className="testimonials-grid animate-on-scroll">
                    {testimonials.map((t, i) => (
                        <div
                            className="testimonial-card"
                            key={i}
                            data-stagger
                            style={{
                                opacity: 0,
                                transform: 'translateY(25px)',
                                transition: `all 0.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`
                            }}
                        >
                            <div className="testimonial-stars">
                                {'★'.repeat(t.rating)}
                            </div>
                            <blockquote className="testimonial-text">"{t.text}"</blockquote>
                            <div className="testimonial-author">
                                <div className="testimonial-avatar">{t.name.split(' ').map(n => n[0]).join('')}</div>
                                <div>
                                    <div className="testimonial-name">{t.name}</div>
                                    <div className="testimonial-role">{t.role}</div>
                                    {t.plotSize !== "Consultant" && (
                                        <div className="testimonial-plot">Plot: {t.plotSize}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
