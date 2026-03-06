import React from 'react';

const ComparisonMatrix = () => {
    return (
        <section className="section comparison" id="comparison" aria-label="Property Investment Comparison">
            <div className="container">
                <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                    <span className="section-label" style={{ justifyContent: 'center' }}>Investment Analysis</span>
                    <h2 className="section-title">Kekarav NA Plots vs <span className="gold-text">Alternatives</span></h2>
                    <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>
                        Compare <strong>Kekarav Bavdhan</strong> against standard luxury apartments and PMRDA plots to see why it's West Pune's smartest investment.
                    </p>
                </div>

                <div className="comparison-table-wrapper animate-on-scroll">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Feature / Benefit</th>
                                <th className="highlight-col">Kekarav Bavdhan (PMC NA Plot)</th>
                                <th>Luxury Apartment (Bavdhan)</th>
                                <th>PMRDA Plot (Sus/Mulshi)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="feature-cell"><strong>Land Ownership</strong></td>
                                <td className="highlight-col success">100% Floor Space Index (FSI) & Land Title</td>
                                <td className="warning">Undivided Share (UDS) only</td>
                                <td className="success">100% Land Title</td>
                            </tr>
                            <tr>
                                <td className="feature-cell"><strong>Appreciation Potential</strong></td>
                                <td className="highlight-col success">Highest (12-15% p.a.) - Land appreciates, building depreciates</td>
                                <td className="danger">Lowest (4-6% p.a.) after 5 years</td>
                                <td className="warning">Moderate (8-10% p.a.)</td>
                            </tr>
                            <tr>
                                <td className="feature-cell"><strong>Customization</strong></td>
                                <td className="highlight-col success">Absolute Freedom (Design your dream G+2 Villa)</td>
                                <td className="danger">None (Fixed Layouts)</td>
                                <td className="success">Absolute Freedom</td>
                            </tr>
                            <tr>
                                <td className="feature-cell"><strong>Infrastructure Quality</strong></td>
                                <td className="highlight-col success">Premium (PMC water, 15m roads, STP, Solar)</td>
                                <td className="success">Premium</td>
                                <td className="warning">Developing / Dependent on borewells</td>
                            </tr>
                            <tr>
                                <td className="feature-cell"><strong>Green Certification</strong></td>
                                <td className="highlight-col success">IGBC Platinum Certified</td>
                                <td className="warning">Rarely IGBC Platinum</td>
                                <td className="danger">None</td>
                            </tr>
                            <tr>
                                <td className="feature-cell"><strong>Security & Privacy</strong></td>
                                <td className="highlight-col success">3-Layer Security, Independent Walls</td>
                                <td className="warning">Shared walls, High density</td>
                                <td className="danger">Often stand-alone plotting (Lower security)</td>
                            </tr>
                            <tr>
                                <td className="feature-cell"><strong>Bank Loan Funding</strong></td>
                                <td className="highlight-col success">Up to 80% (SBI, HDFC, ICICI approved)</td>
                                <td className="success">Up to 80-90%</td>
                                <td className="warning">Difficult / Lower LTV ratio</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default ComparisonMatrix;
