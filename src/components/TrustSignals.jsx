import React from 'react';

const TrustSignals = () => {
    const bankApprovals = [
        { name: 'SBI', logo: '🏦' },
        { name: 'HDFC', logo: '🏦' },
        { name: 'ICICI', logo: '🏦' },
        { name: 'Axis Bank', logo: '🏦' },
        { name: 'Kotak', logo: '🏦' }
    ];

    const phases = [
        { name: 'Phase 1 (The Heritage)', status: 'Sold Out', color: '#ef4444' },
        { name: 'Phase 2 (The Meadows)', status: 'Selling Fast', color: '#f59e0b' },
        { name: 'Phase 3 (The Heights)', status: 'Newly Launched', color: '#10b981' }
    ];

    const reraNumbers = [
        "P52100028753",
        "P52100029012"
    ];

    return (
        <section className="section trust-signals" id="trust" aria-label="Legal and Trust Signals">
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>Transparency & Trust</span>
                    <h2 className="section-title">Legal <span className="gold-text">Compliance & Bank Approvals</span></h2>
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        Kekarav Bavdhan is a fully RERA-compliant project, approved by all major financial institutions for easy home loans.
                    </p>
                </div>

                <div className="trust-grid">
                    {/* Bank Approvals */}
                    <div className="trust-card animate-on-scroll slide-left">
                        <h3>Major Bank Approvals</h3>
                        <p>Get up to 80% funding from leading banks.</p>
                        <div className="bank-logos">
                            {bankApprovals.map((bank, i) => (
                                <div key={i} className="bank-logo-item">
                                    <span className="bank-icon">{bank.logo}</span>
                                    <span className="bank-name">{bank.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RERA Compliance */}
                    <div className="trust-card animate-on-scroll slide-up">
                        <h3>MAHARERA Registered</h3>
                        <p>Transparency you can verify.</p>
                        <div className="rera-items">
                            {reraNumbers.map((num, i) => (
                                <div key={i} className="rera-item">
                                    <span className="rera-label">MahaRERA No:</span>
                                    <span className="rera-number">{num}</span>
                                </div>
                            ))}
                        </div>
                        <div className="rera-qr-placeholder">
                            <span className="qr-icon">📱</span>
                            <span>Scan to verify on MahaRERA portal</span>
                        </div>
                    </div>

                    {/* Project Phasing */}
                    <div className="trust-card animate-on-scroll slide-right">
                        <h3>Project Phasing</h3>
                        <p>Real-time availability status.</p>
                        <div className="phasing-list">
                            {phases.map((phase, i) => (
                                <div key={i} className="phase-item">
                                    <span className="phase-name">{phase.name}</span>
                                    <span className="phase-status" style={{ backgroundColor: phase.color }}>{phase.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSignals;
