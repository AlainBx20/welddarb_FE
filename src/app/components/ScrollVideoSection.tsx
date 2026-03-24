import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

import { useLanguage } from '../contexts/LanguageContext';

const frames = [
  "/shooting/shooting_page-0001.jpg",
  "/shooting/shooting_page-0002.jpg",
  "/shooting/shooting_page-0003.jpg",
  "/shooting/shooting_page-0004.jpg",
  "/shooting/shooting_page-0005.jpg",
  "/shooting/shooting_page-0007.jpg",
];

interface ScrollVideoSectionProps {
  onTrackClick: () => void;
}

export function ScrollVideoSection({ onTrackClick }: ScrollVideoSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const textY = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -80, -200]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25, 0.5], [1, 0.6, 0]);


  useEffect(() => {
    const imagePromises = frames.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  const frameIndex = scrollProgress * (frames.length - 1);
  const currentFrameIndex = Math.floor(frameIndex);
  const nextFrameIndex = Math.min(currentFrameIndex + 1, frames.length - 1);
  const blendFactor = frameIndex - currentFrameIndex;

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        {/* Full-screen image layers */}
        {frames.map((frame, index) => {
          let frameOpacity = 0;

          if (index === currentFrameIndex) {
            frameOpacity = 1 - blendFactor;
          } else if (index === nextFrameIndex) {
            frameOpacity = blendFactor;
          }

          return (
            <motion.div
              key={index}
              className="absolute inset-0"
              style={{ opacity: frameOpacity }}
            >
              {/* The image fills the entire screen. 
                  object-cover crops it to fill; object-top keeps faces visible.
                  The motion style pans it down slowly as user scrolls for cinematic effect. */}
              <img
                src={frame}
                alt={`Shooting ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center 2%' }}
              />
            </motion.div>
          );
        })}

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 pointer-events-none" />

        {/* Hero Content — centered */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
          style={{
            y: textY,
            opacity: textOpacity,
          }}
        >

          <motion.h1
            className="text-4xl md:text-7xl text-amber-100 tracking-[0.15em] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontWeight: 300 }}
          >
            {t.hero.title}
          </motion.h1>

          {!imagesLoaded && (
            <motion.p
              className="text-sm text-white/40 mt-4"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t.hero.loading}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="mt-10 flex flex-col items-center gap-8"
          >
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="#collection"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-amber-100 text-black px-8 py-5 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-500 hover:scale-105 hover:bg-white hover:shadow-[0_0_30px_rgba(254,243,199,0.5)] cursor-pointer text-center"
              >
                {t.hero.viewCollection}
              </a>
              <button
                onClick={onTrackClick}
                className="border border-amber-100/40 text-amber-100/90 px-8 py-5 rounded-full text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-500 hover:bg-amber-100 hover:text-black hover:border-amber-100 hover:shadow-[0_0_20px_rgba(254,243,199,0.3)] cursor-pointer"
              >
                {t.nav.trackOrder}
              </button>
            </div>

            <div className="flex flex-col items-center">
              <motion.p
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-white/40 text-[10px] tracking-widest uppercase"
              >
                {t.hero.scroll}
              </motion.p>
              <motion.div
                className="w-px h-16 bg-gradient-to-b from-amber-100/40 to-transparent mx-auto mt-4"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}