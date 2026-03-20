import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import logoImage from 'figma:asset/f1c97467f912436f82a69b06050f8e87665000a0.png';
import { useLanguage } from '../contexts/LanguageContext';

const frames = [
  "https://images.unsplash.com/photo-1771340183956-6f69d2d08f43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWxzJTIwc3RyZWV0d2VhciUyMG91dGRvb3IlMjB1cmJhbnxlbnwxfHx8fDE3NzIwNDIxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1654758790539-766103dd71d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwamFja2V0JTIwZGV0YWlsJTIwY2xvc2V1cHxlbnwxfHx8fDE3NzIwNDIxMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1758387813664-5cd1211304f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwZWRpdG9yaWFsJTIwYmxhY2slMjBjbG90aGluZ3xlbnwxfHx8fDE3NzIwNDIzNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1513188447171-ecf00455f051?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBibGFjayUyMGNsb3RoaW5nJTIwbWluaW1hbHxlbnwxfHx8fDE3NzE5NTYzNjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1761522001173-407848107951?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZmFzaGlvbiUyMG1vZGVsJTIwbWluaW1hbCUyMGRhcmt8ZW58MXx8fHwxNzcyMDQyMzY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1542327534-59a1fe8daf73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXR3ZWFyJTIwYnJhbmQlMjB1cmJhbiUyMGZhc2hpb258ZW58MXx8fHwxNzcxOTU2MzczfDA&ixlib=rb-4.1.0&q=80&w=1080",
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

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.15]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -150, -300]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 0.7, 0]);

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
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-neutral-900">
        {/* Frame images */}
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
              style={{
                opacity: frameOpacity,
                scale,
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${frame})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </motion.div>
          );
        })}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 pointer-events-none" />

        {/* Content */}
        <motion.div 
          className="relative z-10 text-center px-6 flex flex-col items-center max-w-4xl"
          style={{ 
            y: textY,
            opacity: textOpacity 
          }}
        >
          <motion.img
            src={logoImage}
            alt="Marque"
            className="w-24 md:w-40 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.h1 
            className="text-4xl md:text-7xl text-amber-100 tracking-[0.2em] mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontWeight: 300, letterSpacing: '0.15em' }}
          >
            {t.hero.title}
          </motion.h1>
          {!imagesLoaded && (
            <motion.p 
              className="text-sm text-white/40 mt-6"
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
            className="mt-12 flex flex-col items-center gap-10"
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