import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Phone,
  MessageCircle,
  Check,
  Grid2x2,
  Sofa,
  BedDouble,
  Layers,
  Calculator,
  Droplets,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  BUSINESS,
  SERVICES,
  METHOD_STEPS,
  HOW_IT_WORKS,
  TESTIMONIALS,
  REAL_RESULTS_GALLERY,
  FAQS,
  buildWhatsAppUrl,
} from './data';
import { MegaWordmark } from './components/MegaWordmark';
import { SandTransitionImage } from './components/SandTransitionImage';
import { PriceCalculator } from './components/PriceCalculator';

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  // Navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active chapter state for Services (7.3)
  const [activeChapter, setActiveChapter] = useState(0);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);
  const [isHoveredChapter, setIsHoveredChapter] = useState(false);

  // Video deferred loading
  const [mountDesktopVideo, setMountDesktopVideo] = useState(false);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const [mobileVideoInView, setMobileVideoInView] = useState(false);

  // Gallery scroll tracking (7.6)
  const galleryRef = useRef<HTMLDivElement>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Method counter animation (7.4)
  const [methodCounter, setMethodCounter] = useState(0);
  const [methodHasAnimated, setMethodHasAnimated] = useState(false);

  // FAQ accordion state (7.10)
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Floating CTA visibility tracking
  const heroRef = useRef<HTMLElement>(null);
  const finalCtaRef = useRef<HTMLElement>(null);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  // SVG Foam Bubble icon
  const FoamBubbleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="8" cy="14" r="5" />
      <circle cx="16" cy="14" r="4" opacity="0.85" />
      <circle cx="12" cy="7" r="3" opacity="0.7" />
    </svg>
  );

  // Desktop video mount delay (2800ms)
  useEffect(() => {
    if (prefersReducedMotion) return;
    // Check saveData
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;

    const timer = setTimeout(() => {
      setMountDesktopVideo(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  // Mobile video IntersectionObserver
  useEffect(() => {
    const el = mobileVideoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMobileVideoInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Services Auto-advance (3500ms)
  useEffect(() => {
    if (!autoAdvanceEnabled || isHoveredChapter || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % SERVICES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [autoAdvanceEnabled, isHoveredChapter, prefersReducedMotion]);

  // Floating mobile/desktop bar observer
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !finalCtaRef.current) return;
      const heroBottom = heroRef.current.getBoundingClientRect().bottom;
      const finalCtaTop = finalCtaRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // Show after leaving hero, hide when final CTA is in view
      const pastHero = heroBottom < 100;
      const beforeFinal = finalCtaTop > windowHeight - 50;
      setShowFloatingBar(pastHero && beforeFinal);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gallery scroll listener
  const handleGalleryScroll = () => {
    if (!galleryRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
    const totalCards = REAL_RESULTS_GALLERY.length;
    const cardWidth = scrollWidth / totalCards;
    const currentIndex = Math.min(
      totalCards - 1,
      Math.max(0, Math.round(scrollLeft / cardWidth))
    );
    setGalleryIndex(currentIndex);
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!galleryRef.current) return;
    const cardWidth = galleryRef.current.clientWidth * 0.75;
    galleryRef.current.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth',
    });
  };

  // Close mobile menu on Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Method 80% count-up when triggered
  const triggerMethodCounter = () => {
    if (methodHasAnimated) return;
    setMethodHasAnimated(true);
    if (prefersReducedMotion) {
      setMethodCounter(80);
      return;
    }
    const duration = 800;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeVal = 1 - Math.pow(1 - progress, 3);
      setMethodCounter(Math.round(easeVal * 80));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const currentService = SERVICES[activeChapter];

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#111] font-sans antialiased selection:bg-black selection:text-white relative">
      {/* =========================================================================
          7.1 [01] HERO — min-h-screen, fondo #fcfcfc
          ========================================================================= */}
      <section
        ref={heroRef}
        id="inicio"
        className="relative min-h-screen flex flex-col justify-between pt-6 px-6 md:px-16 pb-12 overflow-hidden bg-[#fcfcfc]"
      >
        {/* Background Desktop Video */}
        {mountDesktopVideo && !prefersReducedMotion && (
          <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/media/hero-poster.webp"
              className="w-full h-full object-cover grayscale opacity-85 transition-opacity duration-1000"
            >
              <source src="/media/hero-video.mp4" type="video/mp4" />
              <source src="/media/hero-video.webm" type="video/webm" />
            </video>
            {/* White gradient mask: solid at 45% left, fading transparent towards right */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, #fcfcfc 0%, #fcfcfc 45%, rgba(252, 252, 252, 0.75) 65%, rgba(252, 252, 252, 0.15) 100%)',
              }}
            />
          </div>
        )}

        {/* 7.1.a) Wordmark "DR. CLEAN" */}
        <div className="relative z-20 w-full">
          <MegaWordmark />
        </div>

        {/* 7.1.b) Sub-nav editorial in mono */}
        <motion.nav
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 mt-6 md:mt-8 pt-4 border-t border-black/10 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-gray-800"
          aria-label="Navegación principal"
        >
          <div className="flex items-start justify-between gap-4">
            {/* Left Column (15%) */}
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-gray-900 leading-tight">
                LAVADO <br className="hidden sm:inline" />A DOMICILIO <br className="hidden sm:inline" />SANTIAGO
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden sm:block" strokeWidth={1} />
            </div>

            {/* Center Column (30% desktop) */}
            <div className="hidden md:block max-w-[360px] text-gray-700 leading-relaxed font-normal normal-case text-xs tracking-normal">
              Lavado de alfombras, tapices, colchones y pisos a domicilio en el sector oriente de Santiago.
            </div>

            {/* Right Column: Anchors (15% desktop) */}
            <div className="hidden lg:flex items-center gap-5 text-gray-600">
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1} />
              <a href="#servicios" className="hover:text-black hover:underline underline-offset-4 transition-colors">
                Servicios
              </a>
              <a href="#metodo" className="hover:text-black hover:underline underline-offset-4 transition-colors">
                Método
              </a>
              <a href="#precios" className="hover:text-black hover:underline underline-offset-4 transition-colors">
                Precios
              </a>
              <a href="#cobertura" className="hover:text-black hover:underline underline-offset-4 transition-colors">
                Cobertura
              </a>
              <a href="#preguntas" className="hover:text-black hover:underline underline-offset-4 transition-colors">
                Preguntas
              </a>
            </div>

            {/* Hamburger Button (2 lines) */}
            <div className="lg:hidden ml-auto z-50">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                className="group flex flex-col justify-center items-end gap-1.5 p-2 focus:outline-none cursor-pointer"
              >
                <span
                  className={`h-[1.5px] bg-[#111] transition-all duration-300 ease-out ${
                    mobileMenuOpen
                      ? 'w-6 rotate-45 translate-y-[3.5px]'
                      : 'w-7 group-hover:w-5'
                  }`}
                />
                <span
                  className={`h-[1.5px] bg-[#111] transition-all duration-300 ease-out ${
                    mobileMenuOpen
                      ? 'w-6 -rotate-45 -translate-y-[4px]'
                      : 'w-5 group-hover:w-8'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-40 bg-[#fcfcfc] pt-28 px-8 pb-10 flex flex-col justify-between"
            >
              <div className="flex flex-col space-y-6">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-400">
                  NAVEGACIÓN
                </span>
                <nav className="flex flex-col space-y-4 text-2xl font-medium tracking-tight">
                  <a
                    href="#servicios"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-gray-600 transition-colors"
                  >
                    Servicios
                  </a>
                  <a
                    href="#metodo"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-gray-600 transition-colors"
                  >
                    Método
                  </a>
                  <a
                    href="#precios"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-gray-600 transition-colors"
                  >
                    Precios
                  </a>
                  <a
                    href="#resultados"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-gray-600 transition-colors"
                  >
                    Resultados
                  </a>
                  <a
                    href="#cobertura"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-gray-600 transition-colors"
                  >
                    Cobertura
                  </a>
                  <a
                    href="#preguntas"
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-gray-600 transition-colors"
                  >
                    Preguntas frecuentes
                  </a>
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <a
                  href={buildWhatsAppUrl('Hola, quiero cotizar un servicio de limpieza a domicilio')}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="hero"
                  className="btn-primary-editorial w-full justify-center"
                >
                  <span className="btn-slide-panel" />
                  <span className="btn-content">
                    <FoamBubbleIcon />
                    <span>Cotizar por WhatsApp</span>
                  </span>
                </a>
                <a
                  href="tel:+56945431315"
                  className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-md font-mono text-xs uppercase tracking-wider text-gray-800"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Llamar al +56 9 4543 1315</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Main Content Row */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mt-12 md:mt-24 lg:mt-32">
          {/* 7.1.c) Left Column: H1 and primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 max-w-[540px]"
          >
            {/* Index indicator */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs tracking-widest text-gray-500">01</span>
              <span className="w-16 h-[1.5px] bg-black/20" />
            </div>

            {/* Single H1 on page */}
            <h1 className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.5rem] font-normal tracking-tight leading-[0.98] text-[#111] mb-6">
              Lavado de alfombras a domicilio
            </h1>

            <p className="text-[14px] text-gray-700 leading-relaxed max-w-[340px] mb-4">
              Limpieza profunda con espuma controlada para alfombras, tapices, colchones y pisos. Secado en horas y sanitización incluida.
            </p>

            <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#111] font-medium mb-8">
              MURO A MURO DESDE $3.500/M² + IVA
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={buildWhatsAppUrl('Hola, quiero cotizar un servicio de limpieza a domicilio')}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="hero"
                className="btn-primary-editorial"
              >
                <span className="btn-slide-panel" />
                <span className="btn-content">
                  <span className="btn-icon-bubble">
                    <FoamBubbleIcon />
                  </span>
                  <span>Cotizar por WhatsApp</span>
                </span>
              </a>

              <a
                href="#precios"
                className="btn-secondary-circle group"
              >
                <span className="circle-ring">
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider font-medium text-gray-900">
                  Ver precios
                </span>
              </a>
            </div>

            {/* Mobile Video Card under buttons */}
            <div className="lg:hidden mt-8 w-full aspect-[4/5] rounded-md overflow-hidden bg-black/5 relative border border-black/10">
              <video
                ref={mobileVideoRef}
                autoPlay={mobileVideoInView}
                loop
                muted
                playsInline
                poster="/media/hero-poster.webp"
                preload="none"
                className="w-full h-full object-cover"
              >
                {mobileVideoInView && (
                  <>
                    <source src="/media/hero-video.mp4" type="video/mp4" />
                    <source src="/media/hero-video.webm" type="video/webm" />
                  </>
                )}
              </video>
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-white uppercase tracking-wider">
                Video real de servicio
              </div>
            </div>
          </motion.div>

          {/* 7.1.d) Right Column: Ficha técnica (desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block lg:col-span-4 ml-auto w-[220px] bg-white/60 backdrop-blur-sm p-4 border border-black/10 rounded-md"
          >
            <div className="font-mono text-[11px] font-semibold tracking-wider text-black uppercase mb-1">
              ESPUMA CONTROLADA
            </div>
            <div className="text-[12px] text-gray-600 mb-4 leading-snug">
              Maquinaria suiza / limpieza con mínima humedad
            </div>

            <div className="space-y-2.5 py-3 border-y border-gray-200">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Agua</span>
                <span className="font-mono font-medium text-black">Hasta −80%</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Secado alfombra</span>
                <span className="font-mono font-medium text-black">8–24 h</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-wider">Experiencia</span>
                <span className="font-mono font-medium text-black">+15 años</span>
              </div>
            </div>

            <div className="mt-4">
              <a
                href="#metodo"
                className="btn-secondary-circle group"
              >
                <span className="circle-ring !w-7 !h-7">
                  <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-gray-900 font-medium">
                  Ver el método
                </span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* 7.1.f) Scroll Indicator (desktop, delay 1.2s) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="hidden lg:flex items-center gap-3 relative z-10 pt-10"
        >
          <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center gap-[2px]">
            <span className="w-[1px] h-3 bg-gray-500 animate-pulse" />
            <span className="w-[1px] h-3 bg-gray-500 animate-pulse delay-100" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
            DESLIZA PARA VER MÁS
          </span>
        </motion.div>
      </section>

      {/* =========================================================================
          7.2 [02] DECLARACIÓN + SERVICIOS RÁPIDOS — fondo #fcfcfc
          ========================================================================= */}
      <section
        id="declaracion"
        className="relative min-h-[75vh] md:min-h-screen flex flex-col justify-between py-24 px-6 md:px-16 bg-[#fcfcfc] overflow-hidden"
      >
        <div className="max-w-[1040px] mx-auto text-center w-full">
          {/* Label */}
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-black mb-8 block">
            <span className="text-gray-500">[ 02 ]</span> Qué limpiamos
          </span>

          {/* Large Centered Headline */}
          <motion.h2
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[2.2rem] sm:text-[3rem] md:text-[4.2rem] font-medium tracking-tight text-[#111] leading-[1.1] mb-12 text-balance"
          >
            Limpiamos en profundidad alfombras, tapices, colchones y pisos,
            <span className="hidden md:inline"><br /></span>
            sin que saques nada de tu casa.
          </motion.h2>

          {/* Quick-filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => {
                setAutoAdvanceEnabled(false);
                setActiveChapter(0);
                document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm text-[11px] font-mono uppercase tracking-wider text-gray-800 hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <Grid2x2 className="w-3.5 h-3.5" />
              <span>Alfombras</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAutoAdvanceEnabled(false);
                setActiveChapter(1);
                document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm text-[11px] font-mono uppercase tracking-wider text-gray-800 hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <Sofa className="w-3.5 h-3.5" />
              <span>Sillones</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAutoAdvanceEnabled(false);
                setActiveChapter(2);
                document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm text-[11px] font-mono uppercase tracking-wider text-gray-800 hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <BedDouble className="w-3.5 h-3.5" />
              <span>Colchones</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAutoAdvanceEnabled(false);
                setActiveChapter(3);
                document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm text-[11px] font-mono uppercase tracking-wider text-gray-800 hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pisos</span>
            </button>

            <a
              href="#precios"
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white/70 backdrop-blur-sm text-[11px] font-mono uppercase tracking-wider text-gray-800 hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Precios</span>
            </a>
          </div>
        </div>

        {/* Spatial Spacer for the floating carpet that invades from 7.3 */}
        <div className="min-h-[220px] md:min-h-[450px] w-full pointer-events-none" />

        {/* Desktop Corner Metadata */}
        <div className="hidden lg:flex items-center justify-between font-mono text-[10px] text-gray-500 tracking-[0.2em] uppercase pt-8 border-t border-gray-200">
          <span>NO MOJAMOS. LIMPIAMOS CON ESPUMA.</span>
          <span>DOCTOR CLEAN © {new Date().getFullYear()}</span>
        </div>
      </section>

      {/* =========================================================================
          7.3 [03] SERVICIOS COMO CAPÍTULOS — fondo #0a0a0a, texto blanco
          ========================================================================= */}
      <section
        id="servicios"
        tabIndex={-1}
        className="relative z-30 bg-[#0a0a0a] text-white px-6 md:px-16 pt-32 md:pt-48 pb-24 overflow-hidden outline-none scroll-mt-12"
      >
        {/* 7.3.a) Floating Invading Carpet */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] md:w-[900px] pointer-events-none z-10 overflow-visible">
          <motion.div
            initial={{ opacity: 0, y: '-55%' }}
            whileInView={{ opacity: 1, y: '-72%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: 'perspective(1200px) rotateX(55deg) rotateZ(-8deg)',
            }}
            className="w-full shadow-2xl rounded-md overflow-hidden"
          >
            <img
              src="/media/alfombra-hero.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-auto object-cover opacity-95"
            />
          </motion.div>
        </div>

        {/* Section Label */}
        <div className="flex items-center gap-2 mb-8">
          <span className="font-mono text-xs tracking-[0.2em] text-gray-400">
            [ 03 ] SERVICIOS
          </span>
        </div>

        {/* 7.3.b) Header row with inline circular icons */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-end pb-12 border-b border-[#222]">
          <div className="xl:col-span-8">
            <h2 className="text-[1.8rem] sm:text-[2.6rem] md:text-[3.8rem] font-normal tracking-tight leading-[1.08] text-white">
              Más de 15 años limpiando{' '}
              <span className="inline-flex items-center gap-1.5 align-middle mx-1">
                <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-600 bg-black flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-default">
                  <Sofa className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-black" />
                </span>
                <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-600 bg-black flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-default">
                  <Droplets className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-black" />
                </span>
                <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-600 bg-black flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-default">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-black" />
                </span>
              </span>{' '}
              hogares y oficinas del sector oriente.
            </h2>
          </div>

          <div className="xl:col-span-4 flex flex-col xl:items-end space-y-3">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-400">
              NO INUNDAMOS TU ALFOMBRA / LA LIMPIAMOS CON ESPUMA
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-gray-700 bg-black text-gray-300">
                A DOMICILIO
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-gray-700 bg-black text-gray-300">
                SANITIZACIÓN INCLUIDA
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-gray-700 bg-black text-gray-300">
                GARANTÍA DE SATISFACCIÓN
              </span>
            </div>
          </div>
        </div>

        {/* 7.3.c) Chapter Split Panel */}
        <div
          onMouseEnter={() => setIsHoveredChapter(true)}
          onMouseLeave={() => setIsHoveredChapter(false)}
          onFocus={() => setIsHoveredChapter(true)}
          onBlur={() => setIsHoveredChapter(false)}
          className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] mt-8 border border-gray-800 rounded-md overflow-hidden bg-[#0c0c0c]"
        >
          {/* Left Column (35%): Sand Transition Image + Counter */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-gray-800 p-6 flex flex-col justify-between min-h-[380px] lg:min-h-[500px]">
            <div className="font-mono text-[10px] text-gray-500 tracking-[0.3em]">
              ***
            </div>

            <div className="flex-1 flex items-center justify-center my-4 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <SandTransitionImage
                  key={currentService.id}
                  src={currentService.image}
                  alt={currentService.imageAlt}
                />
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#222] font-mono text-xs text-gray-400">
              <span>{currentService.shortTag}</span>
              <div className="flex items-center gap-1 font-mono text-sm">
                <span className="text-white font-medium">{currentService.number}</span>
                <span className="text-gray-600">/</span>
                <span className="text-gray-500">04</span>
              </div>
            </div>
          </div>

          {/* Right Column (65%): Tablist of Chapters */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
              <span>Limpieza profunda a domicilio. Secado en horas.</span>
              <span className="text-white font-medium">Servicio {currentService.number}</span>
            </div>

            {/* Accessible Tablist */}
            <div
              role="tablist"
              aria-label="Lista de servicios de limpieza"
              className="divide-y divide-gray-800/80"
            >
              {SERVICES.map((service, index) => {
                const isActive = activeChapter === index;

                return (
                  <div
                    key={service.id}
                    role="tab"
                    id={`tab-${service.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${service.id}`}
                    tabIndex={0}
                    onClick={() => {
                      setAutoAdvanceEnabled(false);
                      setActiveChapter(index);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setAutoAdvanceEnabled(false);
                        setActiveChapter((prev) => (prev + 1) % SERVICES.length);
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setAutoAdvanceEnabled(false);
                        setActiveChapter((prev) => (prev - 1 + SERVICES.length) % SERVICES.length);
                      }
                    }}
                    className={`p-6 md:p-8 cursor-pointer transition-colors outline-none focus-visible:bg-[#1a1a1a] ${
                      isActive ? 'bg-[#141414]' : 'hover:bg-[#101010]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs text-gray-500">{service.number}</span>
                        <h3
                          className={`text-2xl md:text-[2rem] font-medium tracking-tight transition-colors ${
                            isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {service.name}
                        </h3>
                      </div>
                      <ArrowUpRight
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isActive
                            ? 'text-white translate-x-1 -translate-y-1'
                            : 'text-gray-600'
                        }`}
                      />
                    </div>

                    {/* Active Expanded Content (Motion layout) */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id={`panel-${service.id}`}
                          role="tabpanel"
                          aria-labelledby={`tab-${service.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-2">
                            <p className="text-sm md:text-[15px] text-gray-300 leading-relaxed max-w-2xl">
                              {service.description}
                            </p>

                            {service.monoDetails && (
                              <div className="mt-4 font-mono text-[11px] tracking-wider text-gray-400 uppercase">
                                {service.monoDetails}
                              </div>
                            )}

                            <div className="mt-6">
                              <a
                                href={buildWhatsAppUrl(service.whatsappMsg)}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-cta={service.dataCta}
                                className="btn-primary-inverted"
                              >
                                <span className="btn-slide-panel" />
                                <span className="btn-content">
                                  <FoamBubbleIcon />
                                  <span>{service.buttonText}</span>
                                </span>
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Bottom Panel Strip */}
            <div className="p-4 border-t border-gray-800 font-mono text-[10px] text-gray-500 uppercase tracking-widest text-right">
              {autoAdvanceEnabled ? 'AUTOAVANCE ACTIVO (PAUSA AL HOVER)' : 'SELECCIÓN MANUAL'}
            </div>
          </div>
        </div>

        {/* 7.3.d) Bottom Strip */}
        <div className="pt-8 mt-12 border-t border-gray-800 flex items-center justify-between font-mono text-[10px] text-gray-500 tracking-[0.2em] uppercase">
          <span>LIMPIEZA PROFUNDA A DOMICILIO · SANTIAGO</span>
          <span>DOCTOR CLEAN</span>
        </div>
      </section>

      {/* =========================================================================
          7.4 [04] EL MÉTODO — fondo #fcfcfc
          ========================================================================= */}
      <section
        id="metodo"
        className="py-24 px-6 md:px-16 bg-[#fcfcfc] border-b border-gray-200"
      >
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-black mb-8 block">
          <span className="text-gray-500">[ 04 ]</span> El método
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Headline and -80% stat */}
          <div className="lg:col-span-6">
            <h2 className="text-[2.2rem] sm:text-[3rem] md:text-[3.8rem] font-medium tracking-tight leading-[1.08] text-[#111] mb-8">
              No inundamos tu alfombra. La limpiamos con espuma.
            </h2>

            {/* Giant -80% figure */}
            <motion.div
              onViewportEnter={triggerMethodCounter}
              viewport={{ once: true }}
              className="my-8"
            >
              <div className="text-[12vw] lg:text-[7.5rem] font-light tracking-[-0.04em] leading-[0.85] text-[#111] font-mono tabular-nums">
                −{methodCounter}%
              </div>
              <div className="mt-3 font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase text-gray-600 font-medium">
                MENOS AGUA QUE LA INYECCIÓN-EXTRACCIÓN
              </div>
            </motion.div>

            {/* Doctor's Honesty Note Box */}
            <div className="mt-10 p-5 border border-[#111] rounded-md bg-white">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-black block mb-2">
                NOTA DEL DOCTOR
              </span>
              <p className="text-xs md:text-[13px] text-gray-800 leading-relaxed">
                En casos de suciedad extrema puede ser necesario usar más humedad y el secado se alarga. Siempre te lo avisamos antes de empezar.
              </p>
            </div>
          </div>

          {/* Right Column: 4-step technical spec */}
          <div className="lg:col-span-6">
            <div className="divide-y divide-gray-300 border-t border-gray-300">
              {METHOD_STEPS.map((step) => (
                <div key={step.number} className="py-6">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="font-mono text-xs text-gray-500">{step.number}</span>
                    <h3 className="text-lg md:text-xl font-medium text-[#111]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pl-8">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Certification footer notice */}
            <div className="mt-8 pt-6 border-t border-gray-300 text-xs text-gray-700 leading-relaxed">
              <span className="font-semibold text-black">Certificaciones:</span> Productos biodegradables certificados con normas ISO 9001 e ISO 14001. Sanitización profunda incluida sin costo extra.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7.5 [05] PRECIOS + CALCULADORA — fondo #fcfcfc
          ========================================================================= */}
      <section
        id="precios"
        className="py-24 px-6 md:px-16 bg-[#fcfcfc] border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-black mb-8 block">
            <span className="text-gray-500">[ 05 ]</span> Precios
          </span>

          <PriceCalculator />
        </div>
      </section>

      {/* =========================================================================
          7.6 [06] RESULTADOS REALES — fondo #0a0a0a
          ========================================================================= */}
      <section
        id="resultados"
        className="py-24 px-6 md:px-16 bg-[#0a0a0a] text-white overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs tracking-[0.2em] text-gray-400 uppercase mb-3 block">
              [ 06 ] RESULTADOS REALES
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
              No te lo contamos. Míralo.
            </h2>
          </div>

          {/* Carousel Controls & Counter */}
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-gray-400">
              0{galleryIndex + 1} / 0{REAL_RESULTS_GALLERY.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollGallery('left')}
                aria-label="Ver resultado anterior"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollGallery('right')}
                aria-label="Ver resultado siguiente"
                className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 1px Progress Bar */}
        <div className="w-full h-[1px] bg-gray-800 mb-8 relative">
          <div
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
            style={{
              width: `${((galleryIndex + 1) / REAL_RESULTS_GALLERY.length) * 100}%`,
            }}
          />
        </div>

        {/* Horizontal Snap Strip */}
        <div
          ref={galleryRef}
          onScroll={handleGalleryScroll}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 no-scrollbar cursor-grab active:cursor-grabbing"
        >
          {REAL_RESULTS_GALLERY.map((item) => (
            <div
              key={item.id}
              className="shrink-0 w-[82vw] sm:w-[480px] md:w-[540px] snap-start bg-[#141414] border border-gray-800 rounded-md overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4 border-t border-gray-800">
                <span className="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <a
            href={buildWhatsAppUrl('Hola, quiero cotizar un servicio de limpieza a domicilio')}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="resultados"
            className="btn-primary-inverted"
          >
            <span className="btn-slide-panel" />
            <span className="btn-content">
              <FoamBubbleIcon />
              <span>Quiero este resultado</span>
            </span>
          </a>
        </div>
      </section>

      {/* =========================================================================
          7.7 [07] CÓMO FUNCIONA — fondo #fcfcfc
          ========================================================================= */}
      <section
        id="como-funciona"
        className="py-24 px-6 md:px-16 bg-[#fcfcfc] border-b border-gray-200"
      >
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-black mb-8 block">
          <span className="text-gray-500">[ 07 ]</span> Cómo funciona
        </span>

        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#111] mb-12">
          De la cotización al secado final.
        </h2>

        {/* 4 Steps List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-16 border-b border-gray-300">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.number} className="border-t border-gray-300 pt-6">
              <span className="font-mono text-xs text-gray-500 mb-2 block">{step.number}</span>
              <h3 className="text-lg font-medium text-[#111] mb-2">{step.title}</h3>
              <p className="text-xs text-gray-700 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        {/* "ANTES DE QUE LLEGUEMOS" Box */}
        <div className="mt-12 p-6 md:p-8 border border-[#111] rounded-md bg-white">
          <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-black mb-4 block">
            ANTES DE QUE LLEGUEMOS
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <span className="text-xs text-gray-800 leading-relaxed">
                Despeja objetos pequeños: sillas livianas, plantas, zapatos, cajas y electrónicos.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <span className="text-xs text-gray-800 leading-relaxed">
                Movemos muebles de hasta 30 kg sin costo y los devolvemos a su lugar exacto.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <span className="text-xs text-gray-800 leading-relaxed">
                Bibliotecas, vitrinas y racks con objetos frágiles o pesados los despejas tú previamente.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <span className="text-xs text-gray-800 leading-relaxed">
                Puedes reprogramar tu visita sin costo avisando con 48 horas de anticipación.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7.8 [08] TESTIMONIOS — fondo #fcfcfc
          ========================================================================= */}
      <section
        id="testimonios"
        className="py-24 px-6 md:px-16 bg-[#fcfcfc] border-b border-gray-200"
      >
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-black mb-8 block">
          <span className="text-gray-500">[ 08 ]</span> Clientes
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="relative flex flex-col justify-between">
              <div>
                <span className="text-6xl font-serif text-gray-300 leading-none select-none block -mb-6">
                  “
                </span>
                <blockquote className="text-xl md:text-2xl font-light text-[#111] leading-relaxed relative z-10 mb-6">
                  {t.quote}
                </blockquote>
              </div>
              <div className="font-mono text-[11px] tracking-[0.2em] text-gray-700 uppercase">
                {t.author} — {t.commune}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href={BUSINESS.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-wider underline text-gray-800 hover:text-black inline-flex items-center gap-1"
          >
            Ver reseñas en Google Maps ↗
          </a>
        </div>
      </section>

      {/* =========================================================================
          7.9 [09] COBERTURA — fondo #0a0a0a
          ========================================================================= */}
      <section
        id="cobertura"
        className="py-24 px-6 md:px-16 bg-[#0a0a0a] text-white"
      >
        <div className="max-w-5xl">
          <span className="font-mono text-xs tracking-[0.2em] text-gray-400 uppercase mb-4 block">
            [ 09 ] COBERTURA
          </span>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-12">
            Vamos a tu casa en el sector oriente.
          </h2>

          {/* 6 Communes List */}
          <div className="divide-y divide-gray-800 border-y border-gray-800">
            {BUSINESS.primaryCommunes.map((commune) => (
              <a
                key={commune}
                href={buildWhatsAppUrl(`Hola, quiero cotizar un servicio de limpieza a domicilio en ${commune}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group py-5 md:py-6 flex items-center justify-between transition-colors hover:text-white"
              >
                <span className="text-xl md:text-3xl font-medium tracking-tight text-gray-400 group-hover:text-white transition-colors">
                  {commune}
                </span>
                <div className="flex items-center gap-2 font-mono text-xs text-gray-500 group-hover:text-white transition-colors">
                  <span className="hidden sm:inline">COTIZAR AQUÍ</span>
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </a>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-400">
            ¿Otra comuna de la Región Metropolitana? Escríbenos: puede aplicar recargo por traslado.
          </p>

          <div className="mt-12 p-6 border border-gray-800 rounded-md bg-[#121212] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block mb-1">
                OFICINA PRINCIPAL
              </span>
              <div className="font-mono text-xs md:text-sm text-gray-200">
                {BUSINESS.address}
              </div>
            </div>

            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-600 font-mono text-xs text-white hover:bg-white hover:text-black transition-colors shrink-0"
            >
              <span>Cómo llegar</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7.10 [10] PREGUNTAS FRECUENTES — fondo #fcfcfc
          ========================================================================= */}
      <section
        id="preguntas"
        className="py-24 px-6 md:px-16 bg-[#fcfcfc] border-b border-gray-200"
      >
        <div className="max-w-4xl">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-black mb-8 block">
            <span className="text-gray-500">[ 10 ]</span> Preguntas frecuentes
          </span>

          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-[#111] mb-12">
            Todo lo que necesitas saber antes de contratar.
          </h2>

          <div className="divide-y divide-gray-300 border-y border-gray-300">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div key={faq.id} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-ans-${faq.id}`}
                    className="w-full flex items-center justify-between text-left group focus:outline-none"
                  >
                    <span className="text-lg md:text-xl font-medium text-[#111] pr-4">
                      {faq.question}
                    </span>
                    <span className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center shrink-0 transition-colors group-hover:border-black">
                      <Plus
                        className={`w-4 h-4 text-[#111] transition-transform duration-300 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-ans-${faq.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 text-sm md:text-[15px] text-gray-700 leading-relaxed pr-12">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7.11 CTA FINAL + CIERRE — fondo #fcfcfc
          ========================================================================= */}
      <section
        ref={finalCtaRef}
        id="cierre"
        className="relative pt-24 pb-0 px-6 md:px-16 bg-[#fcfcfc] overflow-hidden text-center"
      >
        <div className="max-w-3xl mx-auto pb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#111] mb-6">
            ¿Lista tu casa para volver a estar impecable?
          </h2>
          <p className="text-base text-gray-700 mb-8 max-w-xl mx-auto">
            Escríbenos con una foto o tus medidas y te cotizamos sin compromiso.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={buildWhatsAppUrl('Hola, quiero cotizar un servicio de limpieza a domicilio')}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="final"
              className="btn-primary-editorial"
            >
              <span className="btn-slide-panel" />
              <span className="btn-content">
                <FoamBubbleIcon />
                <span>Cotizar por WhatsApp</span>
              </span>
            </a>

            <a
              href="tel:+56945431315"
              className="inline-flex items-center gap-2 px-6 py-3.5 border border-gray-400 rounded-md font-mono text-xs uppercase tracking-wider text-[#111] hover:border-black transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Llamar al +56 9 4543 1315</span>
            </a>
          </div>
        </div>

        {/* Wordmark "DR. CLEAN" cut off at the bottom edge */}
        <div className="w-full overflow-hidden select-none pointer-events-none -mb-3">
          <MegaWordmark isCutoffBottom />
        </div>
      </section>

      {/* =========================================================================
          7.12 FOOTER — fondo #0a0a0a, mono 10–11px
          ========================================================================= */}
      <footer className="bg-[#0a0a0a] text-gray-400 py-16 px-6 md:px-16 font-mono text-[10px] md:text-[11px] border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          {/* Logo & Descriptor */}
          <div className="md:col-span-4 space-y-4">
            <img
              src="/media/doctor-clean-logo.png"
              alt="Doctor Clean logo oficial"
              className="h-10 w-auto object-contain"
            />
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Lavado de alfombras, tapices y pisos a domicilio en Santiago.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-2 uppercase tracking-wider">
            <span className="text-white block font-medium mb-3">SECCIONES</span>
            <div><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></div>
            <div><a href="#metodo" className="hover:text-white transition-colors">El Método</a></div>
            <div><a href="#precios" className="hover:text-white transition-colors">Precios y Calculadora</a></div>
            <div><a href="#cobertura" className="hover:text-white transition-colors">Cobertura</a></div>
            <div><a href="#preguntas" className="hover:text-white transition-colors">Preguntas frecuentes</a></div>
          </div>

          {/* Communes and Contact */}
          <div className="md:col-span-3 space-y-2 uppercase tracking-wider">
            <span className="text-white block font-medium mb-3">COBERTURA PRINCIPAL</span>
            <div className="text-gray-500">
              Las Condes · Providencia · Vitacura · La Reina · Ñuñoa · Lo Barnechea
            </div>
            <div className="pt-3 text-gray-400 normal-case">
              {BUSINESS.address}
            </div>
            <div>
              <a href="tel:+56945431315" className="hover:text-white transition-colors">
                Teléfono: +56 9 4543 1315
              </a>
            </div>
          </div>

          {/* Socials & Cleaning Tips */}
          <div className="md:col-span-2 space-y-2 uppercase tracking-wider">
            <span className="text-white block font-medium mb-3">REDES Y BLOG</span>
            <div>
              <a
                href={BUSINESS.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram ↗
              </a>
            </div>
            <div>
              <a
                href={BUSINESS.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Facebook ↗
              </a>
            </div>
            <div>
              <a
                href={BUSINESS.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                X (Twitter) ↗
              </a>
            </div>
            <div className="pt-2">
              <a
                href="https://drclean.cl/consejos-limpieza-hogar/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-gray-300 hover:text-white transition-colors"
              >
                Consejos de limpieza ↗
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
          <span>© {new Date().getFullYear()} Doctor Clean. Todos los derechos reservados.</span>
          <span>SANTIAGO DE CHILE</span>
        </div>
      </footer>

      {/* =========================================================================
          7.14 BARRA FLOTANTE
          - Mobile: Barra fija inferior (64px + safe-area)
          - Desktop: Botón circular flotante 56px abajo a la derecha
          ========================================================================= */}
      <AnimatePresence>
        {showFloatingBar && (
          <>
            {/* Mobile Bottom Fixed Bar */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-gray-800 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl"
              style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
            >
              <a
                href={buildWhatsAppUrl('Hola, quiero cotizar un servicio de limpieza a domicilio')}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="flotante"
                className="flex-1 bg-white text-black font-medium text-xs py-3 px-4 rounded flex items-center justify-center gap-2 uppercase tracking-wider font-mono shadow"
              >
                <MessageCircle className="w-4 h-4 fill-black" />
                <span>WhatsApp</span>
              </a>

              <a
                href="tel:+56945431315"
                className="flex-1 border border-gray-600 text-white font-medium text-xs py-3 px-4 rounded flex items-center justify-center gap-2 uppercase tracking-wider font-mono hover:border-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Llamar</span>
              </a>
            </motion.div>

            {/* Desktop Circular Floating Button (56px) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="hidden lg:block fixed bottom-8 right-8 z-50"
            >
              <a
                href={buildWhatsAppUrl('Hola, quiero cotizar un servicio de limpieza a domicilio')}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="flotante"
                aria-label="Contactar por WhatsApp a Doctor Clean"
                className="w-14 h-14 rounded-full bg-[#111] text-white flex items-center justify-center shadow-2xl border border-gray-700 hover:bg-white hover:text-[#111] hover:border-[#111] transition-all duration-300 group"
              >
                <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
