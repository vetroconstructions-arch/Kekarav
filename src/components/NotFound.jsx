import React from 'react';

const NotFound = () => {
    React.useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = "robots";
        meta.content = "noindex, nofollow";
        document.head.appendChild(meta);
        return () => document.head.removeChild(meta);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FAFCFB',
            color: '#0A2E29',
            fontFamily: "'Inter', sans-serif",
            textAlign: 'center',
            padding: '2rem'
        }}>
            <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(4rem, 10vw, 8rem)',
                fontWeight: '700',
                margin: '0',
                color: '#C5A059',
                lineHeight: '1'
            }}>404</h1>
            <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: '600',
                marginTop: '1rem',
                marginBottom: '2rem'
            }}>Looks like you took a wrong turn at Bavdhan Hills...</h2>
            <p style={{
                fontSize: '1.1rem',
                color: '#5A6B68',
                maxWidth: '600px',
                lineHeight: '1.6',
                marginBottom: '3rem'
            }}>
                The page you are looking for has been moved or no longer exists. But don't worry, finding the perfect NA plot at Kekarav is much easier than finding this page.
            </p>

            <a href="/" style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: '#C5A059',
                color: '#FFFFFF',
                textDecoration: 'none',
                borderRadius: '999px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 20px rgba(197, 160, 89, 0.25)'
            }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(197, 160, 89, 0.4)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(197, 160, 89, 0.25)';
                }}
            >
                Return to Kekarav Bavdhan
            </a>
        </div>
    );
};

export default NotFound;
