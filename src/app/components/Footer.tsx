import { Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import logoImage from 'figma:asset/f1c97467f912436f82a69b06050f8e87665000a0.png';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-white py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img src={logoImage} alt="Marque" className="h-14 w-auto mb-6" />
            <p className="text-white/40 text-sm leading-relaxed">
              {t.footer.tagline}
            </p>
          </motion.div>

          {/* Shop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h4 className="mb-6 tracking-wide text-sm text-white/80" style={{ fontWeight: 300 }}>{t.footer.shop}</h4>
            <ul className="space-y-3 text-white/40 text-sm">
              {t.footer.shopLinks.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                >
                  <motion.a 
                    href="#" 
                    className="hover:text-white transition-colors"
                    whileHover={{ x: 3 }}
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h4 className="mb-6 tracking-wide text-sm text-white/80" style={{ fontWeight: 300 }}>{t.footer.support}</h4>
            <ul className="space-y-3 text-white/40 text-sm">
              {t.footer.supportLinks.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                >
                  <motion.a 
                    href="#" 
                    className="hover:text-white transition-colors"
                    whileHover={{ x: 3 }}
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="mb-6 tracking-wide text-sm text-white/80" style={{ fontWeight: 300 }}>{t.footer.newsletter}</h4>
            <p className="text-white/40 text-sm mb-4 leading-relaxed">
              {t.footer.newsletterText}
            </p>
            <div className="flex gap-0">
              <input
                type="email"
                placeholder={t.footer.emailPlaceholder}
                className="bg-white/5 border border-white/10 px-4 py-3 text-sm flex-1 focus:outline-none focus:border-white/20 transition-colors text-white placeholder:text-white/30"
              />
              <motion.button 
                className="bg-white text-black px-6 py-3 text-xs transition-colors uppercase tracking-widest hover:bg-white/90"
                whileTap={{ scale: 0.95 }}
              >
                {t.footer.join}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Instagram CTA — Full Width Banner */}
        <motion.a
          href="https://www.instagram.com/wleddarb/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-6 border border-white/10 rounded-2xl py-8 px-10 mb-6 hover:border-white/40 hover:bg-white/5 transition-all duration-500 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.01 }}
        >
          <motion.div
            className="text-white/60 group-hover:text-white transition-colors duration-300"
            whileHover={{ rotate: 10, scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Instagram size={36} strokeWidth={1.2} />
          </motion.div>
          <div>
            <p className="text-white text-lg font-light tracking-[0.2em] uppercase group-hover:text-amber-100 transition-colors duration-300">@wleddarb</p>
            <p className="text-white/30 text-xs tracking-widest uppercase mt-1">Suivez-nous sur Instagram</p>
          </div>
          <motion.div
            className="ml-auto text-white/20 group-hover:text-white/60 transition-colors"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.div>
        </motion.a>

        {/* Bottom Bar */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <p className="text-white/20 text-xs tracking-widest mb-4 md:mb-0 uppercase">
            {t.footer.rights}
          </p>
          <p className="text-white/20 text-xs tracking-widest uppercase">ولاد درب — Tunisie</p>
        </motion.div>
      </div>
    </footer>
  );
}