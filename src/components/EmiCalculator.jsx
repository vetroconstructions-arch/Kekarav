import React, { useState, useMemo } from 'react';

const EmiCalculator = ({ t }) => {
    const [plotPrice, setPlotPrice] = useState(19000000); // ₹1.9 Cr
    const [downPayment, setDownPayment] = useState(20);
    const [loanTenure, setLoanTenure] = useState(20);
    const [interestRate, setInterestRate] = useState(8.5);
    const [appreciationRate, setAppreciationRate] = useState(12);

    const calculations = useMemo(() => {
        const loanAmount = plotPrice * (1 - downPayment / 100);
        const monthlyRate = interestRate / 12 / 100;
        const totalMonths = loanTenure * 12;

        const emi = monthlyRate > 0
            ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
            : loanAmount / totalMonths;

        const futureValue5 = plotPrice * Math.pow(1 + appreciationRate / 100, 5);
        const futureValue10 = plotPrice * Math.pow(1 + appreciationRate / 100, 10);
        const roi10 = ((futureValue10 - plotPrice) / plotPrice) * 100;

        return {
            loanAmount,
            emi: Math.round(emi),
            downPaymentAmount: plotPrice * downPayment / 100,
            futureValue10: Math.round(futureValue10),
            roi10: Math.round(roi10),
        };
    }, [plotPrice, downPayment, loanTenure, interestRate, appreciationRate]);

    const formatCurrency = (val) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
        return `₹${val.toLocaleString('en-IN')}`;
    };

    if (!t) return null;

    return (
        <section className="section emi-calculator" id="emi-calculator" aria-label="EMI & ROI Calculator">
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>{t.label}</span>
                    <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.title.replace('EMI & ROI Calculator', 'EMI & <span class=\"gold-text\">ROI Calculator</span>').replace('ROI आणि EMI कॅल्क्युलेटर', 'EMI आणि <span class=\"gold-text\">ROI कॅल्क्युलेटर</span>') }} />
                    <p className="section-subtitle">{t.subtitle}</p>
                </div>

                <div className="calc-grid animate-on-scroll">
                    <div className="calc-inputs">
                        <div className="calc-input-group">
                            <label>{t.plot_price}: <strong>{formatCurrency(plotPrice)}</strong></label>
                            <input type="range" min="19000000" max="70000000" step="500000" value={plotPrice} onChange={(e) => setPlotPrice(+e.target.value)} />
                        </div>
                        <div className="calc-input-group">
                            <label>{t.down_payment}: <strong>{downPayment}% ({formatCurrency(calculations.downPaymentAmount)})</strong></label>
                            <input type="range" min="10" max="100" step="5" value={downPayment} onChange={(e) => setDownPayment(+e.target.value)} />
                        </div>
                        <div className="calc-input-group">
                            <label>{t.tenure}: <strong>{loanTenure} Years</strong></label>
                            <input type="range" min="5" max="30" step="1" value={loanTenure} onChange={(e) => setLoanTenure(+e.target.value)} />
                        </div>
                        <div className="calc-input-group">
                            <label>{t.interest}: <strong>{interestRate}%</strong></label>
                            <input type="range" min="6" max="14" step="0.25" value={interestRate} onChange={(e) => setInterestRate(+e.target.value)} />
                        </div>
                        <div className="calc-input-group">
                            <label>{t.appreciation}: <strong>{appreciationRate}%</strong></label>
                            <input type="range" min="5" max="25" step="1" value={appreciationRate} onChange={(e) => setAppreciationRate(+e.target.value)} />
                        </div>
                    </div>

                    <div className="calc-results">
                        <div className="calc-result-card emi-card">
                            <h4>{t.emi}</h4>
                            <div className="calc-result-big">{formatCurrency(calculations.emi)}</div>
                            <div className="calc-result-sub">/month</div>
                        </div>
                        <div className="calc-result-card highlight">
                            <h4>{t.roi_10yr}</h4>
                            <div className="calc-result-value">{formatCurrency(calculations.futureValue10)}</div>
                            <div className="calc-roi-percent">+{calculations.roi10}% ROI</div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }}>{t.label}</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmiCalculator;
