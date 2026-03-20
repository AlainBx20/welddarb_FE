import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import posterImage from './ressources/Poster/Poster.png';

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const posterY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section id="about" className="relative bg-black overflow-hidden" ref={ref}>

      {/* TORN PAPER — top edge */}
      <div className="w-full relative" style={{ height: '70px', marginBottom: '-1px' }}>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,70 L0,30 Q60,5 120,28 Q180,50 240,20 Q300,0 360,22 Q420,45 480,18 Q540,0 600,24 Q660,48 720,16 Q780,0 840,26 Q900,52 960,18 Q1020,0 1080,22 Q1140,44 1200,16 Q1260,0 1320,20 Q1380,42 1440,22 L1440,70 Z"
            fill="#050505"
          />
        </svg>
      </div>

      {/* Dark textured background */}
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28">

        {/* Section Header */}
        <motion.div
          className="text-center mb-28"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center justify-center gap-6 mb-6">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/25" />
            <p className="text-white/35 text-[10px] tracking-[0.7em] uppercase">{t.about.sectionLabel}</p>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/25" />
          </div>
          <h2 className="text-white text-7xl md:text-[9rem] tracking-tighter leading-none" style={{ fontWeight: 100 }}>
            {t.about.title}
          </h2>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-24 items-center mb-20">

          {/* ===== POSTER SIDE ===== */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: posterY }}
          >
            {/* Outer ambient glow */}
            <div className="absolute -inset-10 bg-white/[0.04] blur-[80px] rounded-full pointer-events-none" />

            {/* === TAPE STRIPS — big, visible, with texture === */}
            {/* Top center tape */}
            <div
              className="absolute z-30"
              style={{
                top: '-18px',
                left: '50%',
                transform: 'translateX(-55%) rotate(-2.5deg)',
                width: '90px',
                height: '28px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.5) 100%)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '2px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
            >
              <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)', borderRadius:'2px' }} />
            </div>

            {/* Bottom right tape */}
            <div
              className="absolute z-30"
              style={{
                bottom: '-14px',
                right: '18%',
                transform: 'rotate(4deg)',
                width: '70px',
                height: '24px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.42) 100%)',
                backdropFilter: 'blur(3px)',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: '2px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}
            >
              <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)', borderRadius:'2px' }} />
            </div>

            {/* The Poster image */}
            <motion.div
              whileHover={{ scale: 1.03, rotate: -1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-[460px]"
              initial={{ rotate: -2 }}
              animate={isInView ? { rotate: -1.5 } : { rotate: -2 }}
            >
              <img
                src={posterImage}
                alt="Wled Darb — Manifeste"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'contrast(1.08) brightness(1.02)',
                  width: '100%',
                  display: 'block',
                }}
              />
            </motion.div>
          </motion.div>

          {/* ===== TEXT SIDE ===== */}
          <motion.div
            className="flex flex-col justify-center gap-8"
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-white/20 text-[10px] tracking-[0.8em] uppercase">{t.about.sub}</p>

            <div>
              <h3 className="text-white text-4xl md:text-5xl leading-tight" style={{ fontWeight: 200 }}>
                {t.about.quote1}
              </h3>
              <h3 className="text-amber-100/55 text-4xl md:text-5xl leading-tight" style={{ fontWeight: 200 }}>
                {t.about.quote2}
              </h3>
            </div>

            <div className="h-px w-12 bg-white/15" />

            <div className="space-y-4 text-white/45 text-[15px] leading-relaxed max-w-lg">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>

            {/* Values pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {t.about.values.map((val, i) => (
                <motion.span
                  key={val}
                  className="text-white/55 text-[10px] tracking-[0.25em] uppercase border border-white/15 px-5 py-2.5 rounded-full hover:border-amber-100/60 hover:text-amber-100 transition-all duration-300 cursor-default"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.08 }}
                >
                  {val}
                </motion.span>
              ))}
            </div>

            {/* Worldwide badge */}
            <motion.div
              className="inline-flex items-center gap-4 border border-white/15 hover:border-white/40 transition-colors duration-300 px-8 py-4 w-fit"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <div className="w-2 h-2 rounded-full bg-amber-100/80 animate-pulse" />
              <span className="text-white/60 text-[10px] tracking-[0.5em] uppercase">{t.about.worldwide}</span>
            </motion.div>
          </motion.div>
        </div>

      </div>

      {/* TORN PAPER — bottom edge */}
      <div className="w-full relative" style={{ height: '70px', marginTop: '-1px' }}>
        <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0,0 L0,45 Q60,65 120,42 Q180,20 240,50 Q300,70 360,48 Q420,25 480,52 Q540,70 600,46 Q660,22 720,54 Q780,70 840,44 Q900,18 960,52 Q1020,70 1080,48 Q1140,26 1200,54 Q1260,70 1320,50 Q1380,28 1440,48 L1440,0 Z"
            fill="#000000"
          />
        </svg>
      </div>
    </section>
  );
}
