import React from 'react';

const ComparisonMatrix = ({ t }) => {
    if (!t) return null;
    return (
        <section className="section comparison" id="comparison" aria-label="Property Investment Comparison">
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>{t.label}</span>
                    <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.title.replace('Alternatives', '<span class=\"gold-text\">Alternatives</span>').replace('पर्याय', '<span class=\"gold-text\">पर्याय</span>') }} />
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        {t.subtitle}
                    </p>
                </div>

                <div className="comparison-table-wrapper animate-on-scroll">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                {t.headers.map((h, i) => (
                                    <th key={i} className={i === 1 ? 'highlight-col' : ''}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {t.features.map((row, i) => (
                                <tr key={i}>
                                    <td className="feature-cell"><strong>{row[0]}</strong></td>
                                    <td className="highlight-col success">{row[1]}</td>
                                    <td className={i === 1 ? 'danger' : 'warning'}>{row[2]}</td>
                                    <td className={i === 0 ? 'success' : 'warning'}>{row[3]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default ComparisonMatrix;
