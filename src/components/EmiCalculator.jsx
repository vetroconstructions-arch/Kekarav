import React, { useState, useMemo } from 'react';

const EmiCalculator = () => {
    const [plotPrice, setPlotPrice] = useState(19000000); // ₹1.9 Cr
    const [downPayment, setDownPayment] = useState(20);
    const [loanTenure, setLoanTenure] = useState(20);
    const [interestRate, setInterestRate] = useState(8.5);
    const [appreciationRate, setAppreciationRate] = useState(12);

    const calculations = useMemo(() => {
        const loanAmount = plotPrice * (1 - downPayment / 100);
        const monthlyRate = interestRate / 12 / 100;
        const totalMonths = loanTenure * 12;

        // EMI = P × r × (1+r)^n / ((1+r)^n - 1)
        const emi = monthlyRate > 0
            ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
            (Math.pow(1 + monthlyRate, totalMonths) - 1)
            : loanAmount / totalMonths;

        const totalPayment = emi * totalMonths;
        const totalInterest = totalPayment - loanAmount;

        // Future value with appreciation
        const futureValue5 = plotPrice * Math.pow(1 + appreciationRate / 100, 5);
        const futureValue10 = plotPrice * Math.pow(1 + appreciationRate / 100, 10);
        const roi5 = ((futureValue5 - plotPrice) / plotPrice) * 100;
        const roi10 = ((futureValue10 - plotPrice) / plotPrice) * 100;

        return {
            loanAmount,
            emi: Math.round(emi),
            totalPayment: Math.round(totalPayment),
            totalInterest: Math.round(totalInterest),
            downPaymentAmount: plotPrice * downPayment / 100,
            futureValue5: Math.round(futureValue5),
            futureValue10: Math.round(futureValue10),
            roi5: Math.round(roi5),
            roi10: Math.round(roi10),
        };
    }, [plotPrice, downPayment, loanTenure, interestRate, appreciationRate]);

    const formatCurrency = (val) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
        return `₹${val.toLocaleString('en-IN')}`;
    };

    return (
        <section className="section emi-calculator" id="emi-calculator" aria-label="EMI & ROI Calculator">
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>Investment Calculator</span>
                    <h2 className="section-title">Calculate Your <span className="gold-text">EMI & Investment ROI</span></h2>
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        Plan your <strong>NA plot investment at Kekarav Bavdhan</strong> with our interactive EMI and appreciation calculator.
                    </p>
                </div>

                <div className="calc-grid animate-on-scroll">
                    {/* Input Panel */}
                    <div className="calc-inputs">
                        <h3>Adjust Parameters</h3>

                        <div className="calc-input-group">
                            <label>Plot Price: <strong>{formatCurrency(plotPrice)}</strong></label>
                            <input type="range" min="19000000" max="70000000" step="500000"
                                value={plotPrice} onChange={(e) => setPlotPrice(+e.target.value)} />
                            <div className="calc-range-labels"><span>₹1.9 Cr</span><span>₹7 Cr</span></div>
                        </div>

                        <div className="calc-input-group">
                            <label>Down Payment: <strong>{downPayment}% ({formatCurrency(calculations.downPaymentAmount)})</strong></label>
                            <input type="range" min="10" max="100" step="5"
                                value={downPayment} onChange={(e) => setDownPayment(+e.target.value)} />
                            <div className="calc-range-labels"><span>10%</span><span>100%</span></div>
                        </div>

                        <div className="calc-input-group">
                            <label>Loan Tenure: <strong>{loanTenure} Years</strong></label>
                            <input type="range" min="5" max="30" step="1"
                                value={loanTenure} onChange={(e) => setLoanTenure(+e.target.value)} />
                            <div className="calc-range-labels"><span>5 yrs</span><span>30 yrs</span></div>
                        </div>

                        <div className="calc-input-group">
                            <label>Interest Rate: <strong>{interestRate}% p.a.</strong></label>
                            <input type="range" min="6" max="14" step="0.25"
                                value={interestRate} onChange={(e) => setInterestRate(+e.target.value)} />
                            <div className="calc-range-labels"><span>6%</span><span>14%</span></div>
                        </div>

                        <div className="calc-input-group">
                            <label>Expected Appreciation: <strong>{appreciationRate}% p.a.</strong></label>
                            <input type="range" min="5" max="25" step="1"
                                value={appreciationRate} onChange={(e) => setAppreciationRate(+e.target.value)} />
                            <div className="calc-range-labels"><span>5%</span><span>25%</span></div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="calc-results">
                        <div className="calc-result-card emi-card">
                            <h4>Monthly EMI</h4>
                            <div className="calc-result-big">{formatCurrency(calculations.emi)}</div>
                            <div className="calc-result-sub">/month</div>
                        </div>

                        <div className="calc-result-row">
                            <div className="calc-result-card">
                                <h4>Loan Amount</h4>
                                <div className="calc-result-value">{formatCurrency(calculations.loanAmount)}</div>
                            </div>
                            <div className="calc-result-card">
                                <h4>Total Interest</h4>
                                <div className="calc-result-value">{formatCurrency(calculations.totalInterest)}</div>
                            </div>
                        </div>

                        <div className="calc-result-card roi-card">
                            <h4>📈 Investment Projection</h4>
                            <div className="calc-roi-grid">
                                <div>
                                    <span className="calc-roi-label">Value in 5 Years</span>
                                    <span className="calc-roi-value">{formatCurrency(calculations.futureValue5)}</span>
                                    <span className="calc-roi-percent">+{calculations.roi5}% ROI</span>
                                </div>
                                <div>
                                    <span className="calc-roi-label">Value in 10 Years</span>
                                    <span className="calc-roi-value">{formatCurrency(calculations.futureValue10)}</span>
                                    <span className="calc-roi-percent">+{calculations.roi10}% ROI</span>
                                </div>
                            </div>
                        </div>

                        <p className="calc-disclaimer">*Calculations are indicative. Actual EMI may vary based on bank terms. Appreciation rates are based on historical Bavdhan market data.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmiCalculator;
