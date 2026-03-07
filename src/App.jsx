import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import SeoKeywordsMatrix from './components/SeoKeywordsMatrix'
import SeoBlogSection from './components/SeoBlogSection'
import LocalityGuide from './components/LocalityGuide'
import EmiCalculator from './components/EmiCalculator'
import Testimonials from './components/Testimonials'
import ComparisonMatrix from './components/ComparisonMatrix'
import InfrastructureIndex from './components/InfrastructureIndex'
import MarketTicker from './components/MarketTicker'
import VideoWalkthrough from './components/VideoWalkthrough'
import StickyActionBar from './components/StickyActionBar'
import TrustSignals from './components/TrustSignals'
import { translations } from './data/translations'

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
    const [lang, setLang] = useState('en')
    const t = translations[lang]
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', plotSize: '', message: '' })
    const [openFaq, setOpenFaq] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
    const heroRef = useRef(null)
    const navRef = useRef(null)

    /* ─── Sync document language ─── */
    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

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
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await fetch("https://formsubmit.co/ajax/propsmartrealty@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: "New Enquiry from Kekarav Bavdhan Website",
                    ...formData
                })
            });
            setFormSubmitted(true);
            setFormData({ name: '', phone: '', email: '', plotSize: '', message: '' });
            setTimeout(() => {
                setFormSubmitted(false);
                setIsModalOpen(false);
            }, 5000);
        } catch (error) {
            console.error(error);
        }
    }
    const scrollTo = (id) => { setMobileMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

    const marqueeItems = t.marquee

    const navItems = [
        { id: 'overview', label: t.nav.overview },
        { id: 'why-bavdhan', label: t.nav.why_bavdhan },
        { id: 'amenities', label: t.nav.amenities },
        { id: 'plots', label: t.nav.plots },
        { id: 'locality-guide', label: t.nav.neighborhoods },
        { id: 'emi-calculator', label: t.nav.roi_calc },
        { id: 'testimonials', label: t.nav.reviews },
        { id: 'location', label: t.nav.location },
    ]

    return (
        <>
            <MarketTicker t={t.ticker} />

            {/* ═══════════ NAVBAR ═══════════ */}
            <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
                <div className="container">
                    <a href="/" className="navbar-logo" aria-label="Kekarav Bavdhan">
                        <span className="navbar-logo-text">
                            KEKAR<span className="navbar-logo-accent">AV</span>
                        </span>
                    </a>

                    <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
                        <div className="lang-toggle">
                            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
                            <span className="lang-divider">|</span>
                            <button className={lang === 'mr' ? 'active' : ''} onClick={() => setLang('mr')}>मराठी</button>
                        </div>
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
                        <button className="btn btn-primary navbar-cta" onClick={() => setIsModalOpen(true)}>
                            {t.nav.book_visit}
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
                    <img src="/images/hero.webp" alt="Kekarav Bavdhan Premium NA Bungalow Plots Aerial View - Luxury Gated Community in Bavdhan Hills, Pune" loading="eager" />
                </div>
                <div
                    className="hero-overlay"
                    style={{
                        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(197,160,89,0.12) 0%, transparent 60%), linear-gradient(135deg, rgba(6,29,25,0.85) 0%, rgba(10,46,41,0.6) 50%, rgba(10,46,41,0.4) 100%)`
                    }}
                ></div>
                <FloatingParticles count={6} />

                <div className="container hero-content">
                    <span className="hero-label">{t.hero.label}</span>
                    <h1 className="hero-title">
                        {t.hero.title_start}<br />
                        <span className="gold">
                            <Typewriter words={t.hero.title_accent_words} speed={90} pause={3000} />
                        </span><br />
                        {t.hero.title_end}
                    </h1>

                    <p className="hero-desc" dangerouslySetInnerHTML={{ __html: t.hero.subtitle.replace('NA plots from 2,000 to 7,000 sq.ft', '<strong>NA plots from 2,000 to 7,000 sq.ft</strong>').replace('Bavdhan Hills within PMC limits', '<strong>Bavdhan Hills within PMC limits</strong>').replace('45+ acre', '45+ acre').replace('IGBC Platinum certification', 'IGBC Platinum certification').replace('₹1.9 Crore onwards', '<strong>₹1.9 Crore onwards</strong>') }} />

                    <div className="hero-actions">
                        <button className="btn btn-primary btn-ripple" onClick={() => setIsModalOpen(true)}>
                            {t.hero.cta_visit} →
                        </button>
                        <button className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.9)' }} onClick={() => scrollTo('plots')}>
                            {t.hero.cta_view}
                        </button>
                    </div>
                </div>

                <div className="hero-stats" ref={acresCounter.ref}>
                    <div className="container">
                        <div className="hero-stat" style={{ '--i': 0 }}>
                            <div className="hero-stat-number">₹1.9 Cr</div>
                            <div className="hero-stat-label">{t.hero.stats.price}</div>
                        </div>
                        <div className="hero-stat" style={{ '--i': 1 }}>
                            <div className="hero-stat-number"><span className="counter-value">{acresCounter.count}</span>+</div>
                            <div className="hero-stat-label">{t.hero.stats.acres}</div>
                        </div>
                        <div className="hero-stat" style={{ '--i': 2 }} ref={treesCounter.ref}>
                            <div className="hero-stat-number"><span className="counter-value">{treesCounter.count.toLocaleString()}</span>+</div>
                            <div className="hero-stat-label">{t.hero.stats.trees}</div>
                        </div>
                        <div className="hero-stat" style={{ '--i': 3 }}>
                            <div className="hero-stat-number">PMC</div>
                            <div className="hero-stat-label">{t.hero.stats.pmc}</div>
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
                            <img src="/images/plots.webp" alt="Premium NA Bungalow Plot with custom villa in Bavdhan Hills Pune" loading="lazy" />
                            <div className="overview-image-badge">45+ Acres</div>
                        </div>

                        <div className="overview-details animate-on-scroll slide-right">
                            <div>
                                <span className="section-label">{t.overview.label}</span>
                                <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.overview.title.replace('NA Bungalow Plots in Pune', '<span class="gold-text">NA Bungalow Plots in Pune</span>') }} />
                            </div>
                            <p className="overview-text" dangerouslySetInnerHTML={{ __html: t.overview.text1.replace('Kekarav Bungalow NA Plots', '<strong>Kekarav Bungalow NA Plots</strong>').replace('NA bungalow plots in Pune', '<strong>NA bungalow plots in Pune</strong>').replace('45+ acres', '<strong>45+ acres</strong>').replace('Bavdhan Hills', '<strong>Bavdhan Hills</strong>').replace('IGBC Platinum certified', '<strong>IGBC Platinum certified</strong>').replace('PMC limits', '<strong>PMC limits</strong>').replace('60+ bird species', '<strong>60+ bird species</strong>').replace('2,400+ flourishing trees', '<strong>2,400+ flourishing trees</strong>') }} />
                            <p className="overview-text" dangerouslySetInnerHTML={{ __html: t.overview.text2.replace('residential plot in Bavdhan', '<strong>residential plot in Bavdhan</strong>').replace('clear NA titles', '<strong>clear NA titles</strong>').replace('G+2 building permission', '<strong>G+2 building permission</strong>').replace('three-layer gated security', '<strong>three-layer gated security</strong>') }} />

                            <div className="overview-features animate-on-scroll">
                                {t.overview.features.map((f, i) => (
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
                        <span className="section-label" style={{ justifyContent: 'center' }}>{t.why.label}</span>
                        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.why.title.replace('NA Bungalow Plots in Bavdhan', '<span class="gold-text">NA Bungalow Plots in Bavdhan</span>') }} />
                        <p className="section-subtitle" style={{ margin: '0 auto var(--space-3xl)' }}>{t.why.subtitle}</p>
                    </div>

                    <div className="why-bavdhan-grid animate-on-scroll">
                        {t.why.cards.map((card, i) => {
                            const icons = ['📈', '🚇', '💼', '🏥', '🏔️', '🏛️'];
                            return (
                                <article className="why-card" key={i} data-stagger style={{ opacity: 0, transform: 'translateY(30px)', transition: `all 0.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s` }}>
                                    <div className="why-card-icon">{icons[i]}</div>
                                    <h3>{card.title}</h3>
                                    <p dangerouslySetInnerHTML={{ __html: card.text.replace(/(\d+-\d+%|15 km|9.6 km|3 km|PMC|NA plots|Chandani Chowk Metro station|Pune Ring Road|Hinjewadi IT Park|Baner|Chellaram Hospital|Oxford Golf Resort|Bavdhan Hills|luxury villa plots in Pune|PMC limits|PMRDA projects)/g, '<strong>$&</strong>') }} />
                                </article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <VideoWalkthrough />

            {/* ═══════════ AMENITIES ═══════════ */}
            <section className="section amenities" id="amenities" aria-label="Amenities">
                <div className="container">
                    <FloatingParticles count={4} />
                    <div className="animate-on-scroll">
                        <span className="section-label">{t.amenities.label}</span>
                        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.amenities.title.replace('Kekarav Bavdhan', '<span class="gold-text">Kekarav Bavdhan</span>') }} />
                        <p className="section-subtitle" dangerouslySetInnerHTML={{ __html: t.amenities.subtitle.replace('gated community in Bavdhan', '<strong>gated community in Bavdhan</strong>') }} />
                    </div>

                    <div className="amenities-image-row animate-on-scroll" style={{ marginTop: '3rem' }}>
                        <div className="amenities-main-image">
                            <img src="/images/amenities.webp" alt="Kekarav Bavdhan Clubhouse and Infinity Swimming Pool" loading="lazy" />
                        </div>
                        <div className="amenities-highlights">
                            {t.amenities.highlights.map((h, i) => (
                                <div className="amenity-highlight" key={i} data-stagger style={{ opacity: 0, transform: 'translateX(40px)', transition: `all 0.5s ease ${i * 0.15}s` }}>
                                    <div className="amenity-highlight-icon">{h.icon}</div>
                                    <div><h4>{h.title}</h4><p>{h.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="amenities-grid animate-on-scroll">
                        {t.amenities.grid.map((amenity, i) => (
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
                        <span className="section-label">{t.investment.label}</span>
                        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.investment.title.replace('NA Plots in Pune', '<span class="gold-text">NA Plots in Pune</span>') }} />
                    </div>

                    <div className="investment-grid animate-on-scroll">
                        <article className="investment-content">
                            <p dangerouslySetInnerHTML={{ __html: t.investment.text1.replace('Pune real estate market in 2026', '<strong>Pune real estate market in 2026</strong>').replace('NA bungalow plots', '<strong>NA bungalow plots</strong>') }} />
                            <h3>{t.investment.heading1}</h3>
                            <p dangerouslySetInnerHTML={{ __html: t.investment.text2.replace('NA plots within PMC limits', '<strong>NA plots within PMC limits</strong>').replace('12-18% annual appreciation', '<strong>12-18% annual appreciation</strong>') }} />
                            <h3>{t.investment.heading2}</h3>
                            <p dangerouslySetInnerHTML={{ __html: t.investment.text3.replace('Pune Metro Line to Chandani Chowk', '<strong>Pune Metro Line to Chandani Chowk</strong>').replace('Pune Ring Road', '<strong>Pune Ring Road</strong>').replace('Mumbai-Bengaluru Expressway', '<strong>Mumbai-Bengaluru Expressway</strong>') }} />
                            <h3>{t.investment.heading3}</h3>
                            <p dangerouslySetInnerHTML={{ __html: t.investment.text4.replace('NA plots require zero maintenance costs', '<strong>NA plots require zero maintenance costs</strong>') }} />
                            <h3>{t.investment.heading4}</h3>
                            <p dangerouslySetInnerHTML={{ __html: t.investment.text5.replace('PMC limits', '<strong>PMC limits</strong>') }} />
                        </article>

                        <div className="investment-stats" ref={investROI.ref}>
                            {[
                                { val: `${investROI.count}%`, label: t.investment.stats.roi, ref: investROI.ref },
                                { val: `${investPMC.count}%`, label: t.investment.stats.pmc, ref: investPMC.ref },
                                { val: '₹0', label: t.investment.stats.maintenance },
                                { val: `${investSold.count}%+`, label: t.investment.stats.sold, ref: investSold.ref },
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
                                    <button className={`btn ${plot.featured ? 'btn-primary' : 'btn-outline'}`} onClick={() => setIsModalOpen(true)}>
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

            <LocalityGuide t={t.locality} />
            <EmiCalculator t={t.emi} />
            <Testimonials t={t.testimonials} />
            <ComparisonMatrix t={t.comparison} />
            <InfrastructureIndex t={t.infra} data={infrastructureData} />
            <TrustSignals t={t.trust} />

            {/* ═══════════ FAQ ═══════════ */}
            <section className="section faq" id="faq" aria-label="Frequently Asked Questions">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": t.faq.items.map(faq => ({
                                "@type": "Question",
                                "name": faq.q,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": faq.a
                                }
                            }))
                        })
                    }}
                />
                <div className="container">
                    <div className="animate-on-scroll" style={{ textAlign: 'center' }}>
                        <span className="section-label" style={{ justifyContent: 'center' }}>{t.faq.label}</span>
                        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.faq.title.replace('NA Plots at Kekarav Bavdhan', '<span class="gold-text">NA Plots at Kekarav Bavdhan</span>') }} />
                    </div>
                    <div className="faq-list animate-on-scroll">
                        {t.faq.items.map((faq, i) => (
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
                        <span className="section-label" style={{ justifyContent: 'center' }}>{t.developers.label}</span>
                        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.developers.title.replace('Most Trusted Real Estate Groups', '<span class=\"gold-text\">Most Trusted Real Estate Groups</span>') }} />
                    </div>
                    <div className="developers-grid">
                        {t.developers.items.map((dev, i) => (
                            <div className="developer-card animate-on-scroll" key={i} data-stagger style={{ opacity: 0, transform: 'scale(0.9)', transition: `all 0.5s cubic-bezier(0.175,0.885,0.32,1.275) ${i * 0.15}s` }}>
                                <div className="developer-card-logo">{dev.name.split(' ').map(n => n[0]).join('')}</div>
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
                        <span className="section-label">{t.contact.title}</span>
                        <h2 className="section-title" dangerouslySetInnerHTML={{ __html: t.contact.title.replace('Expert Consultation', '<span class=\"gold-text\">Expert Consultation</span>') }} />
                        <p className="section-subtitle">{t.contact.subtitle}</p>
                    </div>
                    <div className="contact-grid">
                        <div className="contact-info animate-on-scroll slide-left">
                            <div className="contact-form-container animate-on-scroll slide-left">
                                {!formSubmitted ? (
                                    <form className="contact-form" onSubmit={handleFormSubmit}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="name">{t.contact.name}</label>
                                                <input type="text" id="name" name="name" placeholder={t.contact.name} value={formData.name} onChange={handleFormChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">{t.contact.phone}</label>
                                                <input type="tel" id="phone" name="phone" placeholder="+91 7744009295" value={formData.phone} onChange={handleFormChange} required />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">{t.contact.email}</label>
                                            <input type="email" id="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleFormChange} required />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="plotSize">{t.contact.plot_size}</label>
                                            <select id="plotSize" name="plotSize" value={formData.plotSize} onChange={handleFormChange}>
                                                {t.contact.plot_options.map((opt, i) => (
                                                    <option key={i} value={i === 0 ? "" : opt.split(' — ')[0]}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message">{t.contact.message}</label>
                                            <textarea id="message" name="message" rows="4" placeholder={t.contact.message} value={formData.message} onChange={handleFormChange}></textarea>
                                        </div>
                                        <div className="form-submit">
                                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>{t.contact.submit}</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="form-success">
                                        <div className="form-success-icon">🎉</div>
                                        <h3>{t.contact.success_title}</h3>
                                        <p>{t.contact.success_msg}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <SeoBlogSection />

            <SeoKeywordsMatrix />

            <TrustSignals t={t.trust} />

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="footer" role="contentinfo">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="footer-brand-text">KEKAR<span className="gold-text">AV</span></div>
                            <p className="footer-brand-desc" dangerouslySetInnerHTML={{ __html: t.footer.brand.replace('NA Bungalow Plots in Pune', '<strong>NA Bungalow Plots in Pune</strong>').replace('Bavdhan', '<strong>Bavdhan</strong>').replace('PMC limits', '<strong>PMC limits</strong>') }} />
                            <div className="footer-certifications">
                                <span className="footer-cert">{t.footer.cert1}</span>
                                <span className="footer-cert">{t.footer.cert2}</span>
                                <span className="footer-cert">{t.footer.cert3}</span>
                            </div>
                        </div>
                        <div className="footer-column">
                            <h4>{t.footer.links_title1}</h4>
                            <ul>
                                <li><a href="#overview" onClick={(e) => { e.preventDefault(); scrollTo('overview') }}>{t.footer.link_overview}</a></li>
                                <li><a href="#why-bavdhan" onClick={(e) => { e.preventDefault(); scrollTo('why-bavdhan') }}>{t.footer.link_why}</a></li>
                                <li><a href="#amenities" onClick={(e) => { e.preventDefault(); scrollTo('amenities') }}>{t.footer.link_amenities}</a></li>
                                <li><a href="#plots" onClick={(e) => { e.preventDefault(); scrollTo('plots') }}>{t.footer.link_plots}</a></li>
                                <li><a href="#investment" onClick={(e) => { e.preventDefault(); scrollTo('investment') }}>{t.footer.link_investment}</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>{t.footer.links_title2}</h4>
                            <ul>
                                <li><a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq') }}>{t.footer.link_faq}</a></li>
                                <li><a href="#comparison" onClick={(e) => { e.preventDefault(); scrollTo('comparison') }}>{t.footer.link_comparison}</a></li>
                                <li><a href="#location" onClick={(e) => { e.preventDefault(); scrollTo('location') }}>{t.footer.link_location}</a></li>
                                <li><a href="#developers" onClick={(e) => { e.preventDefault(); scrollTo('developers') }}>{t.footer.link_developers}</a></li>
                                <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact') }}>{t.footer.link_contact}</a></li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>{t.footer.links_title3}</h4>
                            <ul>
                                <li><a href="#">{t.footer.address_l1}</a></li>
                                <li><a href="#">{t.footer.address_l2}</a></li>
                                <li><a href="tel:+917744009295">+91 7744 009 295</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="seo-footer animate-on-scroll">
                        <h4>Kekarav Bungalow NA Plots — Number One NA Bungalow Plots in Pune</h4>
                        <p>
                            <a href="#plots">NA Bungalow Plots in Bavdhan, Pune</a> | <a href="#plots">Kekarav Bungalow NA Plots</a> | <a href="#plots">Number One NA Bungalow Plots in Pune</a> | <a href="#plots">Villa Plots in Pune</a> | <a href="#location">Bungalow Plots near Hinjewadi</a> | <a href="#investment">NA Plots Investment 2026</a> | <a href="#faq">IGBC Certified Plots</a> | <a href="#comparison">Best Plotting Projects Pune</a>
                        </p>
                        <p className="seo-footer-areas"><strong>{t.footer.nearby}</strong> Kothrud | Pashan | Baner | Aundh | Hinjewadi | Chandani Chowk | Warje | Sus | Mulshi | Pirangut | Wakad</p>
                    </div>
                    <div className="footer-bottom">
                        <p>{t.footer.copyright}</p>
                        <p className="footer-disclaimer">{t.footer.disclaimer}</p>
                    </div>
                </div>
            </footer>

            {/* ═══════════ WHATSAPP BUTTON ═══════════ */}
            <a href="https://wa.me/917744009295?text=Hello%2C%20I%20am%20interested%20in%20NA%20Bungalow%20Plots%20in%20Bavdhan" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>

            {/* ═══════════ ENQUIRY MODAL ═══════════ */}
            <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`} onClick={() => setIsModalOpen(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setIsModalOpen(false)} aria-label="Close modal">×</button>
                    <div className="modal-header">
                        <h2>{t.contact.title}</h2>
                        <p>{t.contact.subtitle}</p>
                    </div>
                    {!formSubmitted ? (
                        <form className="contact-form" onSubmit={handleFormSubmit}>
                            <div className="form-row">
                                <div className="form-group"><label htmlFor="modal-name">{t.contact.name}</label><input type="text" id="modal-name" name="name" placeholder={t.contact.name} value={formData.name} onChange={handleFormChange} required /></div>
                                <div className="form-group"><label htmlFor="modal-phone">{t.contact.phone}</label><input type="tel" id="modal-phone" name="phone" placeholder="+91 7744009295" value={formData.phone} onChange={handleFormChange} required /></div>
                            </div>
                            <div className="form-group"><label htmlFor="modal-email">{t.contact.email}</label><input type="email" id="modal-email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleFormChange} required /></div>
                            <div className="form-group"><label htmlFor="modal-plotSize">{t.contact.plot_size}</label>
                                <select id="modal-plotSize" name="plotSize" value={formData.plotSize} onChange={handleFormChange}>
                                    {t.contact.plot_options.map((opt, i) => (
                                        <option key={i} value={i === 0 ? "" : opt.split(' — ')[0]}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group"><label htmlFor="modal-message">{t.contact.message}</label><textarea id="modal-message" name="message" rows="3" placeholder={t.contact.message} value={formData.message} onChange={handleFormChange}></textarea></div>
                            <div className="form-submit"><button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{t.contact.submit}</button></div>
                        </form>
                    ) : (
                        <div className="form-success">
                            <div className="form-success-icon">🎉</div>
                            <h3>{t.contact.success_title}</h3>
                            <p>{t.contact.success_msg}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Lead Gen Bar for Mobile/Desktop */}
            <StickyActionBar t={t.sticky} onBookVisit={() => setIsModalOpen(true)} />
        </>
    )
}

export default App
