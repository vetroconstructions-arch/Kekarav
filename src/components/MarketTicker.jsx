import React from 'react';

const tickerData = [
    { text: "LATEST: Pune Ring Road land acquisition 90% complete, boosting Bavdhan connectivity.", trend: "up" },
    { text: "MARKET TREND: NA Plot prices in PMC limits see 15% YOY appreciation.", trend: "up" },
    { text: "INFRA UPDATE: Chandani Chowk multi-level flyover fully operational.", trend: "up" },
    { text: "NEWS: Hinjewadi IT Park Phase 3 expansion to bring 50k new jobs.", trend: "neutral" },
    { text: "INVESTMENT: 70% of Kekarav Phase 1 inventory already sold out.", trend: "up" },
];

const MarketTicker = () => {
    return (
        <div className="market-ticker" aria-label="Real-Time Pune Real Estate Market News">
            <div className="ticker-label">
                <span className="live-dot"></span> LIVE MARKET
            </div>
            <div className="ticker-scroll">
                <div className="ticker-content">
                    {[...tickerData, ...tickerData].map((item, index) => (
                        <div className="ticker-item" key={index}>
                            {item.trend === 'up' && <span className="trend-icon up">▲</span>}
                            {item.trend === 'down' && <span className="trend-icon down">▼</span>}
                            {item.trend === 'neutral' && <span className="trend-icon neutral">●</span>}
                            <span className="ticker-text">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketTicker;
