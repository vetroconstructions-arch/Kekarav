import React from 'react';

const TrustSignals = ({ t }) => {
    const bankApprovals = [
        { name: 'SBI', logo: '🏦' },
        { name: 'HDFC', logo: '🏦' },
        { name: 'ICICI', logo: '🏦' },
        { name: 'Axis Bank', logo: '🏦' },
        { name: 'Kotak', logo: '🏦' }
    ];

    const phases = (t?.phasing || []).map((p, i) => ({
        ...p,
        color: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : '#10b981'
    }));

    const reraNumbers = [
        "P52100028753",
        "P52100029012"
    ];

    if (!t) return null;

    return (
        <section className="section trust-signals" id="trust" aria-label="Legal and Trust Signals">
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>{t.label}</span>
                    <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.title.replace('Compliance & Bank Approvals', '<span class=\"gold-text\">Compliance & Bank Approvals</span>') }} />
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        {t.subtitle}
                    </p>
                </div>

                <div className="trust-grid">
                    {/* Bank Approvals */}
                    <div className="trust-card animate-on-scroll slide-left">
                        <h3>{t.bank_title}</h3>
                        <p>{t.bank_desc}</p>
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
                        <h3>{t.rera_title}</h3>
                        <p>{t.rera_desc}</p>
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
                            <span>{t.scan_verify}</span>
                        </div>
                    </div>

                    {/* Project Phasing */}
                    <div className="trust-card animate-on-scroll slide-right">
                        <h3>{t.phasing_title}</h3>
                        <p>{t.phasing_desc}</p>
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
