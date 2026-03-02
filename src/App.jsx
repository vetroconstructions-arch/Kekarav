import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

/* ─── Animated Counter Hook ─── */
function useCounter(end, duration = 2000, startOnView = true) {
    const [count, setCount] = useState(0)
    const [started, setStarted] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!startOnView || !ref.current) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
            { threshold: 0.3 }
        )
        obs.observe(ref.current)
        return () => obs.disconnect()
    }, [startOnView, started])

    useEffect(() => {
        if (!started) return
        let frame
        const start = performance.now()
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * end))
            if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [started, end, duration])

    return { count, ref }
}

/* ─── 3D Tilt Card Hook ─── */
function useTilt(intensity = 8) {
    const ref = useRef(null)
    const handleMouseMove = useCallback((e) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `perspective(600px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.02)`
    }, [intensity])
    const handleMouseLeave = useCallback(() => {
        if (ref.current) ref.current.style.transform = ''
    }, [])
    return { ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }
}

/* ─── Floating Particles Component ─── */
function FloatingParticles({ count = 5 }) {
    const particles = useMemo(() => Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 20 + Math.random() * 80,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 10 + Math.random() * 15,
        type: ['circle', 'blob', 'ring'][i % 3],
    })), [count])

    return (
        <>
            {particles.map(p => (
                <div
                    key={p.id}
                    className={`floating-particle ${p.type}`}
                    style={{
                        width: p.size, height: p.size,
                        left: `${p.left}%`, top: `${p.top}%`,
                        animation: `${p.id % 2 === 0 ? 'floatSlow' : 'floatReverse'} ${p.duration}s ease-in-out infinite`,
                    }}
                />
            ))}
        </>
    )
}

/* ─── Typewriter Component ─── */
function Typewriter({ words, speed = 120, pause = 2500 }) {
    const [index, setIndex] = useState(0)
    const [text, setText] = useState('')
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const word = words[index]
        const timer = setTimeout(() => {
            if (!deleting) {
                setText(word.substring(0, text.length + 1))
                if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), pause)
            } else {
                setText(word.substring(0, text.length - 1))
                if (text.length === 0) { setDeleting(false); setIndex((index + 1) % words.length) }
            }
        }, deleting ? speed / 2 : speed)
        return () => clearTimeout(timer)
    }, [text, deleting, index, words, speed, pause])

    return <span className="typewriter">{text}<span className="typewriter-cursor">|</span></span>
}

function App() {
    const [scrolled, setScrolled] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [activeSection, setActiveSection] = useState('hero')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', plotSize: '', message: '' })
    const [openFaq, setOpenFaq] = useState(null)
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
    const navRef = useRef(null)
    const heroRef = useRef(null)

    /* ─── Animated Counters ─── */
    const acresCounter = useCounter(45, 2000)
    const treesCounter = useCounter(2400, 2500)
    const investROI = useCounter(18, 1800)
    const investPMC = useCounter(30, 1600)
    const investSold = useCounter(70, 2000)

    /* ─── 3D Tilt Cards ─── */
    const tilt1 = useTilt(6)
    const tilt2 = useTilt(6)
    const tilt3 = useTilt(6)

    /* ─── Hero mouse tracking ─── */
    useEffect(() => {
        const handleMouse = (e) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect()
                if (e.clientY < rect.bottom) {
                    setMousePos({
                        x: ((e.clientX - rect.left) / rect.width) * 100,
                        y: ((e.clientY - rect.top) / rect.height) * 100,
                    })
                }
            }
        }
        window.addEventListener('mousemove', handleMouse, { passive: true })
        return () => window.removeEventListener('mousemove', handleMouse)
    }, [])

    /* ─── Scroll: navbar + progress + active section ─── */
    useEffect(() => {
        const sections = ['hero', 'overview', 'why-bavdhan', 'amenities', 'investment', 'plots', 'comparison', 'location', 'faq', 'developers', 'contact']
        const handleScroll = () => {
            setScrolled(window.scrollY > 60)
            const total = document.documentElement.scrollHeight - window.innerHeight
            const progress = total > 0 ? (window.scrollY / total) * 100 : 0
            setScrollProgress(progress)
            if (navRef.current) navRef.current.style.setProperty('--navbar-progress', `${progress}%`)

            // Active section detection
            let current = 'hero'
            for (const id of sections) {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().top <= 200) current = id
            }
            setActiveSection(current)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    /* ─── Intersection Observer with staggered reveal ─── */
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Stagger children with data-stagger
                        const staggerItems = entry.target.querySelectorAll('[data-stagger]')
                        if (staggerItems.length > 0) {
                            staggerItems.forEach((item, i) => {
                                setTimeout(() => item.classList.add('stagger-visible'), i * 120)
                            })
                        }
                        entry.target.classList.add('visible')
                    }
                })
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        )
        document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [])

    const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
    const handleFormSubmit = (e) => { e.preventDefault(); setFormSubmitted(true); setTimeout(() => setFormSubmitted(false), 5000) }
    const scrollTo = (id) => { setMobileMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

    const faqData = [
        { q: 'What is the price of NA plots at Kekarav Bavdhan?', a: 'NA bungalow plots at Kekarav Bavdhan start from ₹1.9 Crore onwards. Plot sizes range from 2,000 sq.ft to 7,000 sq.ft, with pricing varying based on plot area, location within the layout, and orientation. Contact us for the latest price list and available inventory.' },
        { q: 'Is Kekarav Bavdhan within PMC limits?', a: 'Yes, Kekarav Bavdhan is strategically located within Pune Municipal Corporation (PMC) limits in Bavdhan Hills. This ensures access to superior PMC infrastructure, reliable water supply, civic amenities, and significantly higher property appreciation compared to PMRDA areas.' },
        { q: 'What plot sizes are available at Kekarav?', a: 'Kekarav offers premium NA bungalow plots ranging from 2,000 sq.ft to 7,000 sq.ft. Popular configurations include 2,000 sq.ft compact villa plots (from ₹1.9 Cr), 3,500 sq.ft premium villa plots (from ₹2.5 Cr), and 5,000+ sq.ft ultra-premium estate plots (price on request).' },
        { q: 'Who are the developers of Kekarav Bavdhan?', a: 'Kekarav Bavdhan is a prestigious joint venture by three industry leaders: TRU Realty (known for sustainable communities), Malpani Group (decades of real estate excellence in Pune), and Shrem Group (infrastructure and financial strength). Together they deliver unmatched quality.' },
        { q: 'Can I build a custom villa on NA plots at Kekarav?', a: 'Absolutely! All plots at Kekarav come with clear NA (Non-Agricultural) titles and G+2 building permission with an optional basement. You have complete freedom to design your dream villa with your preferred architect, within the approved township guidelines.' },
        { q: 'What is IGBC Platinum certification?', a: 'IGBC (Indian Green Building Council) Platinum is the highest level of green building certification in India. Kekarav Bavdhan\'s IGBC Platinum status ensures sustainable features like rainwater harvesting, solar infrastructure, Miyawaki forest, sewage treatment plants, and a significantly reduced carbon footprint.' },
        { q: 'How far is Kekarav from Hinjewadi IT Park?', a: 'Kekarav Bavdhan is approximately 15 km from Hinjewadi IT Park via the Mumbai-Bengaluru Highway. Other key distances: Chandani Chowk (4.6 km), upcoming Metro station (3 km), Kothrud (6.8 km), Pashan (6.5 km), Baner (9.6 km), and Aundh (11 km).' },
        { q: 'What amenities does Kekarav Bavdhan offer?', a: 'Kekarav offers 30+ world-class amenities including a premium clubhouse, infinity swimming pool, modern gymnasium, Miyawaki forest, biodiversity park, pet park, children\'s play area, jogging track, senior citizen park, convenience stores, 15m wide internal roads, solar street lights, STP, rainwater harvesting, and three-layer security with CCTV surveillance.' },
        { q: 'Is Bavdhan a good investment in 2026?', a: 'Bavdhan is one of Pune\'s top-performing micro-markets in 2026. With upcoming Metro connectivity, the Pune Ring Road, proximity to IT corridors (Hinjewadi, Baner), and location within PMC limits, Bavdhan has seen 10-15% annual appreciation. NA plots in Bavdhan offer the highest ROI potential in west Pune.' },
        { q: 'What makes Kekarav different from other plotting projects?', a: 'Kekarav stands apart with its massive 45+ acre township scale, IGBC Platinum green certification, prime PMC-limit location, 2,400+ planted trees supporting 60+ bird species, Miyawaki forest, three-layer security, cluster clubhouses, and the combined strength of three reputed developers — making it Pune\'s most premium NA plotting project.' },
    ]

    const marqueeItems = ['IGBC Platinum Certified', 'PMC Limit', 'NA Clear Title', '45+ Acres', '2,400+ Trees', 'G+2 Permission', '3-Layer Security', 'Miyawaki Forest', '₹1.9 Cr Onwards', 'Bavdhan Hills']

    const navItems = [
        { id: 'overview', label: 'OVERVIEW' },
        { id: 'why-bavdhan', label: 'WHY BAVDHAN' },
        { id: 'amenities', label: 'AMENITIES' },
        { id: 'plots', label: 'NA PLOTS' },
        { id: 'location', label: 'LOCATION' },
        { id: 'faq', label: 'FAQ' },
    ]

    return (
        <>
            {/* ═══════════ NAVBAR ═══════════ */}
            <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
                <div className="container">
                    <a href="/" className="navbar-logo" aria-label="Kekarav Bavdhan">
                        <span className="navbar-logo-text">
                            KEKAR<span className="navbar-logo-accent">AV</span>
                        </span>
                    </a>

                    <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
                        {navItems.map(item => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={activeSection === item.id ? 'nav-active' : ''}
                                onClick={(e) => { e.preventDefault(); scrollTo(item.id) }}
                            >
                                {item.label}
                            </a>
                        ))}
                        <button className="btn btn-primary navbar-cta" onClick={() => scrollTo('contact')}>
                            BOOK SITE VISIT
                        </button>
                    </div>

                    <div className="navbar-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </nav>

            {/* ═══════════ HERO ═══════════ */}
            <header className="hero" id="hero" ref={heroRef}>
                <div className="hero-bg">
                    <img src="/images/hero.png" alt="Kekarav Bavdhan Premium NA Bungalow Plots Aerial View - Luxury Gated Community in Bavdhan Hills, Pune" loading="eager" />
                </div>
                <div
                    className="hero-overlay"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(197,160,89,0.12) 0%, transparent 60%), linear-gradient(135deg, rgba(6,29,25,0.85) 0%, rgba(10,46,41,0.6) 50%, rgba(10,46,41,0.4) 100%)`
                    }}
                ></div>
                <FloatingParticles count={6} />

                <div className="container hero-content">
                    <h1 className="hero-title">
                        The Number One<br />
                        <span className="gold">
                            <Typewriter words={['NA Bungalow Plots in Pune', 'Kekarav Bungalow NA Plots', 'NA Bungalow Plots in Bavdhan']} speed={90} pause={3000} />
                        </span><br />
                        Within PMC Limits
                    </h1>

                    <p className="hero-desc">
                        Craft your dream villa on expansive <strong>NA plots from 2,000 to 7,000 sq.ft</strong>, nestled in the
                        serene <strong>Bavdhan Hills within PMC limits</strong>. A 45+ acre exclusive gated community with
                        IGBC Platinum certification, starting at <strong>₹1.9 Crore onwards</strong>.
                    </p>

                    <div className="hero-actions">
                        <button className="btn btn-primary btn-ripple" onClick={() => scrollTo('contact')}>
                            Book a Site Visit →
                        </button>
                        <button className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }} onClick={() => scrollTo('plots')}>
                            View NA Plot Prices
                        </button>
                    </div>
                </div>

                <div className="hero-stats" ref={acresCounter.ref}>
                    <div className="container">
                        <div className="hero-stat" style={{ '--i': 0 }}>
                            <div className="hero-stat-number">₹1.9 Cr</div>
                            <div className="hero-stat-label">Starting Price</div>
                        </div>
                        <div className="hero-stat" style={{ '--i': 1 }}>
                            <div className="hero-stat-number"><span className="counter-value">{acresCounter.count}</span>+</div>
                            <div className="hero-stat-label">Acres Township</div>
                        </div>
                        <div className="hero-stat" style={{ '--i': 2 }} ref={treesCounter.ref}>
                            <div className="hero-stat-number"><span className="counter-value">{treesCounter.count.toLocaleString()}</span>+</div>
                            <div className="hero-stat-label">Trees Planted</div>
                        </div>
                        <div className="hero-stat" style={{ '--i': 3 }}>
                            <div className="hero-stat-number">PMC</div>
                            <div className="hero-stat-label">Within City Limits</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══════════ MARQUEE BAND ═══════════ */}
            <div className="marquee-band" aria-hidden="true">
                <div className="marquee-band-inner">
                    {[...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span className="marquee-band-item" key={i}><span className="marquee-band-dot"></span>{item}</span>
                    ))}
                </div>
            </div>

            {/* ═══════════ OVERVIEW ═══════════ */}
            <section className="section overview" id="overview" aria-label="Project Overview">
                <div className="container">
                    <FloatingParticles count={3} />
                    <div className="overview-grid">
                        <div className="overview-image animate-on-scroll slide-left">
                            <img src="/images/plots.png" alt="Premium NA Bungalow Plot with custom villa in Bavdhan Hills Pune" loading="lazy" />
                            <div className="overview-image-badge">45+ Acres</div>
                        </div>

                        <div className="overview-details animate-on-scroll slide-right">
                            <div>
                                <span className="section-label">About Kekarav Bavdhan</span>
                                <h2 className="section-title">The Number One <span className="gold-text">NA Bungalow Plots in Pune</span> Within PMC Limits</h2>
                            </div>
                            <p className="overview-text"><strong>Kekarav Bungalow NA Plots</strong> offers the number one <strong>NA bungalow plots in Pune</strong> development, spread across <strong>45+ acres in the verdant Bavdhan Hills</strong>. As the city's only <strong>IGBC Platinum certified plotting project within PMC limits</strong>, Kekarav offers the rare privilege of designing your dream villa amidst a thriving ecosystem featuring <strong>60+ bird species</strong> and <strong>2,400+ flourishing trees</strong>.</p>
                            <p className="overview-text">Every <strong>residential plot in Bavdhan</strong> comes with clear NA titles, <strong>G+2 building permission</strong> with optional basement, 15m & 9m wide internal roads, and world-class infrastructure — all protected by <strong>three-layer gated security</strong>.</p>

                            <div className="overview-features animate-on-scroll">
                                {[
                                    { icon: '🏡', title: 'NA Clear Title Plots', desc: 'Fully approved non-agricultural plots for custom villas' },
                                    { icon: '🏗️', title: 'G+2 + Basement Permission', desc: 'Build up to 3 floors with optional basement' },
                                    { icon: '🌿', title: 'IGBC Platinum Certified', desc: 'India\'s highest green building recognition' },
                                    { icon: '🔒', title: '3-Layer Gated Security', desc: 'CCTV, manned guards & perimeter compound wall' },
                                ].map((f, i) => (
                                    <div className="overview-feature" key={i} data-stagger style={{ transitionDelay: `${i * 0.1}s` }}>
                                        <div className="overview-feature-icon">{f.icon}</div>
                                        <div className="overview-feature-content">
                                            <h4>{f.title}</h4>
                                            <p>{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ WHY BAVDHAN ═══════════ */}
            <section className="section why-bavdhan" id="why-bavdhan" aria-label="Why Bavdhan">
                <div className="container">
                    <div className="animate-on-scroll" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                        <span className="section-label" style={{ justifyContent: 'center' }}>Location Intelligence</span>
                        <h2 className="section-title">Why <span className="gold-text">NA Bungalow Plots in Bavdhan</span> Are Pune's Most Sought-After Address</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>Bavdhan has emerged as the premium residential hub of west Pune, offering a perfect blend of natural beauty, urban connectivity, and investment potential.</p>
                    </div>

                    <div className="why-bavdhan-grid animate-on-scroll">
                        {[
                            { icon: '📈', title: '10-15% Annual Appreciation', text: 'Bavdhan\'s real estate has consistently delivered <strong>10-15% annual price appreciation</strong>, outperforming most Pune micro-markets. <strong>NA plots within PMC limits</strong> have shown even higher returns due to limited supply and premium demand.' },
                            { icon: '🚇', title: 'Metro & Ring Road Connectivity', text: 'The upcoming <strong>Chandani Chowk Metro station</strong> (3 km) and <strong>Pune Ring Road</strong> will transform Bavdhan\'s connectivity, significantly boosting property values.' },
                            { icon: '💼', title: 'Proximity to IT Corridors', text: 'Just <strong>15 km from Hinjewadi IT Park</strong> and <strong>9.6 km from Baner</strong>, Bavdhan is the ideal residential address for IT professionals seeking <strong>premium bungalow plots</strong>.' },
                            { icon: '🏥', title: 'World-Class Infrastructure', text: 'Access to top hospitals like <strong>Chellaram Hospital (2 km)</strong>, reputed schools, and <strong>Oxford Golf Resort</strong>. Established <strong>PMC infrastructure</strong> ensures reliable civic amenities.' },
                            { icon: '🏔️', title: 'Scenic Hill Location', text: 'The <strong>Bavdhan Hills</strong> offer elevated terrain, panoramic views, and natural greenery within city limits — the most desirable location for <strong>luxury villa plots in Pune</strong>.' },
                            { icon: '🏛️', title: 'PMC Limit Advantage', text: 'Being within <strong>PMC limits</strong> ensures superior infrastructure, higher property valuation, and better resale potential — a key differentiator from PMRDA projects.' },
                        ].map((card, i) => (
                            <article className="why-card" key={i} data-stagger style={{ opacity: 0, transform: 'translateY(30px)', transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s` }}>
                                <div className="why-card-icon">{card.icon}</div>
                                <h3>{card.title}</h3>
                                <p dangerouslySetInnerHTML={{ __html: card.text }} />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ AMENITIES ═══════════ */}
            <section className="section amenities" id="amenities" aria-label="Amenities">
                <div className="container">
                    <FloatingParticles count={4} />
                    <div className="animate-on-scroll">
                        <span className="section-label">World-Class Amenities</span>
                        <h2 className="section-title">30+ Premium Amenities at <span className="gold-text">Kekarav Bavdhan</span></h2>
                        <p className="section-subtitle">From a state-of-the-art clubhouse and infinity pool to Miyawaki forests and biodiversity parks — every detail at this <strong>gated community in Bavdhan</strong> is designed for an elevated lifestyle.</p>
                    </div>

                    <div className="amenities-image-row animate-on-scroll" style={{ marginTop: '3rem' }}>
                        <div className="amenities-main-image">
                            <img src="/images/amenities.png" alt="Kekarav Bavdhan Clubhouse and Infinity Swimming Pool" loading="lazy" />
                        </div>
                        <div className="amenities-highlights">
                            {[
                                { icon: '🏊', title: 'Clubhouse & Infinity Pool', desc: 'Resort-style infinity pool with premium clubhouse' },
                                { icon: '🌳', title: 'Miyawaki Forest', desc: 'Dense native forest for clean air & biodiversity' },
                                { icon: '🐾', title: 'Pet Park', desc: 'Dedicated off-leash space for furry companions' },
                                { icon: '☀️', title: 'Solar & Sustainable', desc: 'Solar street lights, STP, rainwater harvesting' },
                            ].map((h, i) => (
                                <div className="amenity-highlight" key={i} data-stagger style={{ opacity: 0, transform: 'translateX(40px)', transition: `all 0.5s ease ${i * 0.15}s` }}>
                                    <div className="amenity-highlight-icon">{h.icon}</div>
                                    <div><h4>{h.title}</h4><p>{h.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="amenities-grid animate-on-scroll">
                        {[
                            { icon: '🏋️', name: 'Modern Gymnasium' }, { icon: '🎮', name: 'Indoor Games Room' },
                            { icon: '🧒', name: "Children's Play Area" }, { icon: '🏃', name: 'Jogging & Walking Track' },
                            { icon: '🌸', name: 'Landscape Garden' }, { icon: '👴', name: 'Senior Citizen Park' },
                            { icon: '🛒', name: 'Convenience Store' }, { icon: '🌿', name: 'Biodiversity Park' },
                            { icon: '💧', name: 'Rainwater Harvesting' }, { icon: '🛣️', name: '15m Wide Internal Roads' },
                            { icon: '💡', name: '24/7 Electricity Supply' }, { icon: '🚰', name: 'STP & Sewage System' },
                        ].map((amenity, i) => (
                            <div className="amenity-card" key={i} data-stagger style={{ opacity: 0, transform: 'scale(0.8)', transition: `all 0.4s cubic-bezier(0.175,0.885,0.32,1.275) ${i * 0.06}s` }}>
                                <span className="amenity-card-icon">{amenity.icon}</span>
                                <h4>{amenity.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ INVESTMENT GUIDE ═══════════ */}
            <section className="section investment" id="investment" aria-label="Investment Guide">
                <div className="container">
                    <div className="animate-on-scroll">
                        <span className="section-label">Investment Intelligence</span>
                        <h2 className="section-title">Why <span className="gold-text">NA Plots in Pune</span> Are the Smartest Investment in 2026</h2>
                    </div>

                    <div className="investment-grid animate-on-scroll">
                        <article className="investment-content">
                            <p>The <strong>Pune real estate market in 2026</strong> presents an exceptional opportunity for investors, and <strong>NA bungalow plots</strong> offer the highest ROI potential among all property types.</p>
                            <h3>📊 Superior ROI vs Apartments</h3>
                            <p>While apartments appreciate at 5-8% annually, <strong>NA plots within PMC limits</strong> have consistently delivered <strong>12-18% annual appreciation</strong>. Bavdhan's premium positioning and limited land supply make it a high-demand micro-market.</p>
                            <h3>🏗️ Infrastructure-Driven Growth</h3>
                            <p>The upcoming <strong>Pune Metro Line to Chandani Chowk</strong>, the <strong>Pune Ring Road</strong>, and <strong>Mumbai-Bengaluru Expressway</strong> are set to transform Bavdhan's connectivity, driving property values significantly higher.</p>
                            <h3>💰 Zero Maintenance, Maximum Flexibility</h3>
                            <p>Unlike apartments, <strong>NA plots require zero maintenance costs</strong> until you build. Complete flexibility to design a custom villa, hold for appreciation, or develop at your convenience.</p>
                            <h3>🏛️ PMC Limit Premium</h3>
                            <p>Plots within <strong>PMC limits</strong> command a 20-30% premium over PMRDA areas due to superior infrastructure. Kekarav's PMC-limit location ensures you're investing in Pune's most valued jurisdiction.</p>
                        </article>

                        <div className="investment-stats" ref={investROI.ref}>
                            {[
                                { val: `${investROI.count}%`, label: 'Annual ROI on NA Plots', ref: investROI.ref },
                                { val: `${investPMC.count}%`, label: 'PMC Premium Over PMRDA', ref: investPMC.ref },
                                { val: '₹0', label: 'Maintenance Until You Build' },
                                { val: `${investSold.count}%+`, label: 'Already Sold Out', ref: investSold.ref },
                            ].map((s, i) => (
                                <div className="investment-stat-card" key={i} data-stagger style={{ opacity: 0, transform: 'translateX(40px)', transition: `all 0.5s ease ${i * 0.15}s` }} ref={s.ref}>
                                    <div className="investment-stat-number">{s.val}</div>
                                    <div className="investment-stat-label">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ PLOTS ═══════════ */}
            <section className="section plots" id="plots" aria-label="NA Plot Configurations and Pricing">
                <div className="container">
                    <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                        <span className="section-label" style={{ justifyContent: 'center' }}>NA Plot Configurations</span>
                        <h2 className="section-title">Premium <span className="gold-text">Bungalow Plot Sizes & Prices</span> at Kekarav Bavdhan</h2>
                        <p className="section-subtitle" style={{ margin: '0 auto' }}>Choose from three premium <strong>NA bungalow plot configurations</strong> — each designed for custom villa construction with clear titles and building permissions.</p>
                    </div>

                    <div className="plots-grid">
                        {[
                            { size: '2,000 sq.ft', type: 'Compact Villa Plot', price: '₹1.9 Cr*', priceLabel: 'Onwards', features: ['NA Clear Title Plot', 'G+2 Building Permission', 'Individual Water Connection', 'Gated Community Access'], tilt: tilt1, featured: false },
                            { size: '3,500 sq.ft', type: 'Premium Villa Plot', price: '₹2.5 Cr*', priceLabel: 'Onwards', features: ['NA Clear Title Plot', 'G+2 with Basement Option', 'Premium Green Views', 'Cluster Clubhouse Access', 'Corner / Garden Facing'], tilt: tilt2, featured: true },
                            { size: '5,000+ sq.ft', type: 'Ultra-Premium Estate', price: 'On Request', priceLabel: 'Custom Pricing', features: ['Expansive Estate Plot', 'Panoramic Hill Views', 'Private Garden Space', 'Custom Villa Architecture', 'Premium Location in Layout'], tilt: tilt3, featured: false },
                        ].map((plot, i) => (
                            <div
                                className={`plot-card animate-on-scroll ${plot.featured ? 'featured' : ''}`}
                                key={i}
                                ref={plot.tilt.ref}
                                onMouseMove={plot.tilt.onMouseMove}
                                onMouseLeave={plot.tilt.onMouseLeave}
                                style={{ transitionDelay: `${i * 0.15}s` }}
                            >
                                <div className="plot-card-header">
                                    <div className="plot-card-size">{plot.size}</div>
                                    <div className="plot-card-type">{plot.type}</div>
                                </div>
                                <div className="plot-card-body">
                                    <div className="plot-card-price">
                                        <span className="plot-card-price-amount">{plot.price}</span>
                                        <span className="plot-card-price-label">{plot.priceLabel}</span>
                                    </div>
                                    <div className="plot-card-features">
                                        {plot.features.map((f, j) => (
                                            <div className="plot-card-feature" key={j}><span className="plot-card-feature-check">✓</span> {f}</div>
                                        ))}
                                    </div>
                                    <button className={`btn ${plot.featured ? 'btn-primary' : 'btn-outline'}`} onClick={() => scrollTo('contact')}>
                                        {plot.featured ? 'Enquire Now →' : 'Enquire Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ COMPARISON ═══════════ */}
            <section className="section comparison" id="comparison" aria-label="Project Comparison">
                <div className="container">
                    <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                        <span className="section-label" style={{ justifyContent: 'center' }}>Why Choose Kekarav</span>
                        <h2 className="section-title">Why Kekarav is the #1 Choice for <span className="gold-text">Bungalow Plots in Pune</span></h2>
                    </div>
                    <div className="comparison-table-wrapper animate-on-scroll">
                        <table className="comparison-table">
                            <thead><tr><th>Feature</th><th className="highlight">Kekarav Bavdhan</th><th>Other Projects</th></tr></thead>
                            <tbody>
                                {[
                                    ['Location', 'Bavdhan Hills, PMC Limit', 'Mostly PMRDA / Peripheral'],
                                    ['Township Size', '45+ Acres', '5-20 Acres typically'],
                                    ['Green Certification', 'IGBC Platinum ✅', 'None / Basic'],
                                    ['Plot Sizes', '2,000 - 7,000 sq.ft', 'Limited options'],
                                    ['Building Permission', 'G+2 + Basement', 'G+1 or G+2 only'],
                                    ['Trees Planted', '2,400+ Trees, 60+ Species', 'Basic landscaping'],
                                    ['Security', '3-Layer Gated Security', 'Basic gating'],
                                    ['Developers', '3 Reputed Groups', 'Single developer'],
                                    ['Metro Proximity', '3 km (upcoming)', '10+ km typically'],
                                ].map(([feature, kekarav, other], i) => (
                                    <tr key={i} data-stagger style={{ opacity: 0, transform: 'translateX(-20px)', transition: `all 0.4s ease ${i * 0.07}s` }}>
                                        <td>{feature}</td>
                                        <td className="highlight"><strong>{kekarav}</strong></td>
                                        <td>{other}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ═══════════ LOCATION ═══════════ */}
            <section className="section location" id="location" aria-label="Location Advantages">
                <div className="container">
                    <div className="animate-on-scroll">
                        <span className="section-label">Strategic Location</span>
                        <h2 className="section-title">Kekarav Bavdhan — <span className="gold-text">Pune's Most Connected Address</span></h2>
                    </div>
                    <div className="location-grid">
                        <div className="location-advantages animate-on-scroll">
                            {[
                                { km: '3', name: 'Chandani Chowk Metro (Upcoming)', desc: 'Direct metro connectivity' },
                                { km: '4.6', name: 'Chandani Chowk Junction', desc: 'Major connectivity hub' },
                                { km: '2', name: 'Chellaram Hospital', desc: 'Multi-speciality healthcare' },
                                { km: '6.5', name: 'Pashan & University Area', desc: 'Top educational institutions' },
                                { km: '6.8', name: 'Kothrud', desc: 'Premium residential area' },
                                { km: '9.6', name: 'Baner', desc: 'IT corridor & commercial hub' },
                                { km: '11', name: 'Aundh', desc: 'Medical & tech ecosystem' },
                                { km: '15', name: 'Hinjewadi IT Park', desc: 'Pune\'s largest IT hub' },
                            ].map((loc, i) => (
                                <div className="location-advantage" key={i} data-stagger style={{ opacity: 0, transform: 'translateX(-30px)', transition: `all 0.5s ease ${i * 0.08}s` }}>
                                    <div className="location-advantage-distance">
                                        <span className="location-advantage-km">{loc.km}</span>
                                        <span className="location-advantage-unit">KM</span>
                                    </div>
                                    <div><h4>{loc.name}</h4><p>{loc.desc}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="location-map animate-on-scroll slide-right">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.8!2d73.77!3d18.51!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf0b0b0b0b0b%3A0x0!2sBavdhan%2C%20Pune!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Kekarav Bavdhan Location Map"></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ FAQ ═══════════ */}
            <section className="section faq" id="faq" aria-label="Frequently Asked Questions">
                <div className="container">
                    <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                        <span className="section-label" style={{ justifyContent: 'center' }}>Frequently Asked Questions</span>
                        <h2 className="section-title">Everything About <span className="gold-text">NA Plots at Kekarav Bavdhan</span></h2>
                    </div>
                    <div className="faq-list animate-on-scroll">
                        {faqData.map((faq, i) => (
                            <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i} data-stagger style={{ opacity: 0, transform: 'translateY(15px)', transition: `all 0.4s ease ${i * 0.06}s` }}>
                                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                                    <span>{faq.q}</span>
                                    <span className="faq-toggle">{openFaq === i ? '−' : '+'}</span>
                                </button>
                                <div className="faq-answer"><p>{faq.a}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ DEVELOPERS ═══════════ */}
            <section className="section developers" id="developers" aria-label="Developer Information">
                <div className="container">
                    <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                        <span className="section-label" style={{ justifyContent: 'center' }}>Trusted Developers</span>
                        <h2 className="section-title">Built by <span className="gold-text">Pune's Most Trusted</span> Real Estate Groups</h2>
                    </div>
                    <div className="developers-grid">
                        {[
                            { logo: 'TR', name: 'TRU Realty', desc: 'Pioneers in sustainable, nature-integrated communities. Innovative design philosophy and green building expertise.' },
                            { logo: 'MG', name: 'Malpani Group', desc: 'One of Pune\'s most respected conglomerates with decades of experience delivering landmark projects across Maharashtra.' },
                            { logo: 'SG', name: 'Shrem Group', desc: 'Diversified group with strong portfolio in infrastructure, bringing world-class construction quality and financial backing.' },
                        ].map((dev, i) => (
                            <div className="developer-card animate-on-scroll" key={i} data-stagger style={{ opacity: 0, transform: 'scale(0.9)', transition: `all 0.5s cubic-bezier(0.175,0.885,0.32,1.275) ${i * 0.15}s` }}>
                                <div className="developer-card-logo">{dev.logo}</div>
                                <h3>{dev.name}</h3>
                                <p>{dev.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ CONTACT ═══════════ */}
            <section className="section contact" id="contact" aria-label="Contact Us - Book Site Visit">
                <div className="container">
                    <FloatingParticles count={3} />
                    <div className="animate-on-scroll">
                        <span className="section-label">Book Your Site Visit</span>
                        <h2 className="section-title">Enquire About <span className="gold-text">NA Plots at Kekarav Bavdhan</span></h2>
                        <p className="section-subtitle">Schedule a private site visit to experience Pune's most premium <strong>NA bungalow plots in Bavdhan</strong> first-hand.</p>
                    </div>
                    <div className="contact-grid">
                        <div className="contact-info animate-on-scroll slide-left">
                            {[
                                { icon: '📍', title: 'Project Site Address', text: 'Survey 171, Bavdhan Hills, Pune 411021' },
                                { icon: '📞', title: 'Kekarav Sales Office', text: '+91 XXXXX XXXXX (10 AM – 7 PM)' },
                                { icon: '✉️', title: 'Email Us', text: 'info@kekarav.in' },
                                { icon: '🕐', title: 'Site Visit Timings', text: 'Open All Days — 10:00 AM to 6:00 PM' },
                            ].map((c, i) => (
                                <div className="contact-info-item" key={i} data-stagger style={{ opacity: 0, transform: 'translateX(-30px)', transition: `all 0.5s ease ${i * 0.12}s` }}>
                                    <div className="contact-info-icon">{c.icon}</div>
                                    <div><h4>{c.title}</h4><p>{c.text}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="contact-form-wrapper animate-on-scroll slide-right">
                            {!formSubmitted ? (
                                <form className="contact-form" onSubmit={handleFormSubmit}>
                                    <div className="form-row">
                                        <div className="form-group"><label htmlFor="name">Full Name</label><input type="text" id="name" name="name" placeholder="Your full name" value={formData.name} onChange={handleFormChange} required /></div>
                                        <div className="form-group"><label htmlFor="phone">Phone Number</label><input type="tel" id="phone" name="phone" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleFormChange} required /></div>
                                    </div>
                                    <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleFormChange} required /></div>
                                    <div className="form-group"><label htmlFor="plotSize">Preferred Plot Size</label>
                                        <select id="plotSize" name="plotSize" value={formData.plotSize} onChange={handleFormChange}>
                                            <option value="">Select NA plot size</option>
                                            <option value="2000">2,000 sq.ft — Compact Villa Plot</option>
                                            <option value="3500">3,500 sq.ft — Premium Villa Plot</option>
                                            <option value="5000">5,000 sq.ft — Ultra-Premium Estate</option>
                                            <option value="7000">7,000 sq.ft — Grand Estate</option>
                                        </select>
                                    </div>
                                    <div className="form-group"><label htmlFor="message">Message (Optional)</label><textarea id="message" name="message" rows="3" placeholder="Tell us about your requirements..." value={formData.message} onChange={handleFormChange}></textarea></div>
                                    <div className="form-submit"><button type="submit" className="btn btn-primary">Schedule Site Visit →</button></div>
                                </form>
                            ) : (
                                <div className="form-success"><div className="form-success-icon">🎉</div><h3>Thank You for Your Interest!</h3><p>Our property consultant will reach out within 24 hours to schedule your exclusive site visit.</p></div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="footer" role="contentinfo">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="footer-brand-text">KEKAR<span className="gold-text">AV</span></div>
                            <p className="footer-brand-desc">The number one <strong>NA Bungalow Plots in Pune</strong> located in Bavdhan within PMC limits. IGBC Platinum Certified. Starting ₹1.9 Crore.</p>
                            <div className="footer-certifications"><span className="footer-cert">IGBC Platinum</span><span className="footer-cert">PMC Approved</span><span className="footer-cert">NA Title</span></div>
                        </div>
                        <div className="footer-column"><h4>Quick Links</h4><ul><li><a href="#overview" onClick={(e) => { e.preventDefault(); scrollTo('overview') }}>About Kekarav</a></li><li><a href="#why-bavdhan" onClick={(e) => { e.preventDefault(); scrollTo('why-bavdhan') }}>Why Bavdhan</a></li><li><a href="#amenities" onClick={(e) => { e.preventDefault(); scrollTo('amenities') }}>Amenities</a></li><li><a href="#plots" onClick={(e) => { e.preventDefault(); scrollTo('plots') }}>NA Plot Prices</a></li><li><a href="#investment" onClick={(e) => { e.preventDefault(); scrollTo('investment') }}>Investment Guide</a></li></ul></div>
                        <div className="footer-column"><h4>Resources</h4><ul><li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq') }}>FAQ</a></li><li><a href="#comparison" onClick={(e) => { e.preventDefault(); scrollTo('comparison') }}>Comparison</a></li><li><a href="#location" onClick={(e) => { e.preventDefault(); scrollTo('location') }}>Location Map</a></li><li><a href="#developers" onClick={(e) => { e.preventDefault(); scrollTo('developers') }}>Developers</a></li><li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>Contact Sales</a></li></ul></div>
                        <div className="footer-column"><h4>Project Office</h4><ul><li><a href="#">Survey 171, Bavdhan Hills</a></li><li><a href="#">Pune, Maharashtra 411021</a></li><li><a href="mailto:info@kekarav.in">info@kekarav.in</a></li></ul></div>
                    </div>
                    <div className="seo-footer animate-on-scroll"><h4>Kekarav Bungalow NA Plots — Number One NA Bungalow Plots in Pune</h4><p><a href="#plots">NA Bungalow Plots in Bavdhan, Pune</a> | <a href="#plots">Kekarav Bungalow NA Plots</a> | <a href="#plots">Number One NA Bungalow Plots in Pune</a> | <a href="#plots">Villa Plots in Pune</a> | <a href="#location">Bungalow Plots near Hinjewadi</a> | <a href="#investment">NA Plots Investment 2026</a> | <a href="#faq">IGBC Certified Plots</a> | <a href="#comparison">Best Plotting Projects Pune</a></p><p className="seo-footer-areas"><strong>Nearby:</strong> Kothrud | Pashan | Baner | Aundh | Hinjewadi | Chandani Chowk | Warje | Sus | Mulshi | Pirangut | Wakad</p></div>
                    <div className="footer-bottom"><p>© 2026 Kekarav Bavdhan. All rights reserved. | By TRU Realty, Malpani Group & Shrem Group</p><p className="footer-disclaimer">Disclaimer: Content is for informational purposes. Prices subject to change. All images are artist's impressions.</p></div>
                </div>
            </footer>
        </>
    )
}

export default App
