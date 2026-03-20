import { ShoppingBag, Globe, PackageSearch } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from 'figma:asset/f1c97467f912436f82a69b06050f8e87665000a0.png';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  onCartClick: () => void;
  onTrackClick: () => void;
  cartItemCount: number;
}

export function Navbar({ onCartClick, onTrackClick, cartItemCount }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: t.nav.collection, href: '#collection' },
    { label: t.nav.about, href: '#about' },
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      initial={{ y: -100 }}
      animate={{ 
        y: 0,
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)'
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-[1600px] mx-auto px-8 py-5">
        {/* Use relative+absolute trick: logo left, icons right, nav absolutely centered */}
        <div className="relative flex items-center justify-between">
          
          {/* LEFT — Logo (shrink-0 means it never compresses) */}
          <motion.div
            className="flex items-center shrink-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img src={logoImage} alt="Marque" className="h-10 w-auto" />
          </motion.div>

          {/* CENTER — Nav links (absolutely centered in full width) */}
          <motion.div
            className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {menuItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="relative text-white text-sm tracking-[0.3em] uppercase font-bold group"
                whileHover={{ y: -1 }}
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-amber-100 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </motion.div>

          {/* RIGHT — Icons (shrink-0) */}
          <div className="flex items-center shrink-0 gap-5 z-10">
            
            {/* Track Order Icon */}
            <motion.button 
              className="text-white/70 hover:text-amber-100 transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onTrackClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              title={t.nav.trackOrder}
              transition={{ duration: 0.8, delay: 0.45 }}
            >
              <PackageSearch size={22} strokeWidth={1.5} />
            </motion.button>

            {/* Language Switcher */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe size={20} strokeWidth={1.5} />
                <span className="text-xs uppercase">{language}</span>
              </motion.button>
              
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 bg-neutral-950 border border-white/10 overflow-hidden"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button
                      onClick={() => {
                        setLanguage('fr');
                        setLangMenuOpen(false);
                      }}
                      className={`block w-full px-6 py-3 text-left text-sm transition-colors ${
                        language === 'fr' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Français
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setLangMenuOpen(false);
                      }}
                      className={`block w-full px-6 py-3 text-left text-sm transition-colors ${
                        language === 'en' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Cart Icon */}
            <motion.button 
              className="text-white/70 hover:text-white transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {cartItemCount}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}