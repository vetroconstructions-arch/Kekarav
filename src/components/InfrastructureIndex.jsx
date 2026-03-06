import React from 'react';

const infrastructureData = [
    {
        category: "IT & Commercial Hubs",
        icon: "🏢",
        items: [
            { name: "Hinjewadi IT Park", distance: "15 km", time: "25 min" },
            { name: "Baner Commercial High-streets", distance: "9.6 km", time: "20 min" },
            { name: "Kothrud Industrial Estate", distance: "6.8 km", time: "15 min" },
        ]
    },
    {
        category: "Connectivity & Transit",
        icon: "🚆",
        items: [
            { name: "Chandani Chowk Metro Station (Upcoming)", distance: "3 km", time: "8 min" },
            { name: "Mumbai-Bengaluru Highway", distance: "2 km", time: "5 min" },
            { name: "Pune Railway Station", distance: "16 km", time: "35 min" },
        ]
    },
    {
        category: "Healthcare Infrastructure",
        icon: "🏥",
        items: [
            { name: "Chellaram Hospital", distance: "2.5 km", time: "7 min" },
            { name: "Asian Hospital", distance: "4 km", time: "10 min" },
            { name: "Sahyadri Hospital (Kothrud)", distance: "7 km", time: "16 min" },
        ]
    },
    {
        category: "Education & Research",
        icon: "🎓",
        items: [
            { name: "Ryan International School", distance: "3.5 km", time: "10 min" },
            { name: "MIT, Kothrud", distance: "6.5 km", time: "15 min" },
            { name: "Pune University & NCL", distance: "10 km", time: "20 min" },
        ]
    }
];

const InfrastructureIndex = ({ t, data }) => {
    if (!t) return null;
    const itemsData = data || [];

    return (
        <section className="section infra-index" id="infrastructure" aria-label="Bavdhan Infrastructure Index">
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>{t.label}</span>
                    <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.title.replace('Infrastructure Proximity Index', '<span class=\"gold-text\">Infrastructure Proximity Index</span>').replace('पायाभूत सुविधा निर्देशांक', '<span class=\"gold-text\">पायाभूत सुविधा निर्देशांक</span>') }} />
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        {t.subtitle}
                    </p>
                </div>

                <div className="infra-grid animate-on-scroll">
                    {itemsData.map((category, idx) => (
                        <div
                            className="infra-card"
                            key={idx}
                            data-stagger
                            style={{ opacity: 0, transform: 'translateY(25px)', transition: `all 0.5s cubic-bezier(0.4,0,0.2,1) ${idx * 0.1}s` }}
                        >
                            <div className="infra-card-header">
                                <span className="infra-icon">{category.icon}</span>
                                <h3 className="infra-title">{category.category}</h3>
                            </div>
                            <ul className="infra-list">
                                {category.items.map((item, i) => (
                                    <li className="infra-item" key={i}>
                                        <div className="infra-item-name">{item.name}</div>
                                        <div className="infra-item-stats">
                                            <span className="infra-distance">{item.distance}</span>
                                            <span className="infra-time">{item.time} {t.drive}</span>
                                        </div>
                                        <div className="infra-bar-bg">
                                            <div
                                                className="infra-bar-fill"
                                                style={{ width: `${Math.max(10, 100 - (parseFloat(item.distance) * 5))}%` }}
                                            ></div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InfrastructureIndex;
