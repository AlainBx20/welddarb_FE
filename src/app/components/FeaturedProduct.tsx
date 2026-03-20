import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchProducts, ProductDTO } from '../api';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// =========================================================================
// 💰 SECTION VISIBLE POUR DEVELOPPEURS: CHANGER LES PRIX ICI
// =========================================================================
export const PRICES_CONFIG = {
  MASTER_PRODUCT: 180, // Prix unique après fusion
};
// =========================================================================

// Images Produit 1
import p1_img1 from './ressources/Produit_1/DSC07232.JPG';
import p1_img2 from './ressources/Produit_1/DSC07235.JPG';
import p1_img3 from './ressources/Produit_1/DSC07236.JPG';
import p1_img4 from './ressources/Produit_1/DSC07237.JPG';
import p1_img5 from './ressources/Produit_1/DSC07239.JPG';

// Images Produit 2
import p2_img1 from './ressources/Produit_2/DSC07233.JPG';
import p2_img2 from './ressources/Produit_2/DSC07238.JPG';

const sizes = ['S', 'M', 'L', 'XL'];

const LOCAL_PRODUCTS = [
  {
    localId: 9991,
    name: 'Veste Heritage Signature',
    price: PRICES_CONFIG.MASTER_PRODUCT,
    description: "L'apogée de notre collection. Une fusion parfaite entre la lignée Heritage et l'audace Signature. Confectionnée dans un tissu premium avec des détails de couture artisanale, cette pièce représente l'essence même de Weldarab.",
    category: "Collection Exclusive",
    images: [p1_img1, p2_img1, p1_img2, p2_img2, p1_img3, p1_img4, p1_img5],
  }
];

// Composant Carousel Réutilisable
function ImageCarousel({ images, productName }: { images: string[], productName: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative group overflow-hidden bg-neutral-900 border border-white/5 rounded-2xl shadow-2xl z-0" ref={emblaRef} style={{ transform: 'translateZ(0)' }}>
      <div className="flex aspect-[3/4] will-change-transform">
        {images.map((img, idx) => (
          <div className="flex-[0_0_100%] min-w-0" key={idx} style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
            <img
              src={img}
              alt={`${productName} - Vue ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-md hover:bg-black/80 shadow-lg"
            onClick={scrollPrev}
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-md hover:bg-black/80 shadow-lg"
            onClick={scrollNext}
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
          
          {/* Indicateur de slider stylé */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, dotIdx) => (
              <div key={dotIdx} className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-sm" />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Composant d'affichage d'un seul produit avec flexibilité
function SingleProductView({ 
  productData, 
  backendProduct, 
  onAddToCart, 
  t, 
  isInView,
  index 
}: { 
  productData: typeof LOCAL_PRODUCTS[0], 
  backendProduct: ProductDTO | undefined, 
  onAddToCart: any, 
  t: any, 
  isInView: boolean,
  index: number
}) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [isAdding, setIsAdding] = useState(false);

  // Sync avec Backend s'il existe
  const finalId = backendProduct?.id || productData.localId;
  const finalPrice = backendProduct?.price || productData.price;
  const finalName = backendProduct?.name || productData.name;

  const handleAdd = () => {
    setIsAdding(true);
    onAddToCart({
      id: Number(finalId),
      name: finalName,
      price: Number(finalPrice),
      image: productData.images[0],
      size: selectedSize
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  const isReverse = index % 2 !== 0;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-40 last:mb-0 ${isReverse ? 'lg:[&>div:first-child]:order-last' : ''}`}>
      {/* Images Carousel avec effet glow interactif */}
      <motion.div
        initial={{ opacity: 0, x: isReverse ? 60 : -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.2 + (index * 0.2), ease: [0.22, 1, 0.36, 1] }}
        className="relative group"
      >
        <div className="absolute -inset-4 bg-gradient-to-tr from-amber-700/20 to-transparent blur-3xl -z-10 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
        <ImageCarousel images={productData.images} productName={finalName} />
      </motion.div>

      {/* Détails du produit */}
      <motion.div
        initial={{ opacity: 0, x: isReverse ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1.2, delay: 0.4 + (index * 0.2), ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col justify-center"
      >
        {/* Catégorie */}
        <p className="text-amber-100/60 text-xs tracking-[0.4em] mb-4 uppercase inline-block">
          {productData.category}
        </p>

        {/* Titre */}
        <h3 className="text-white text-5xl md:text-6xl tracking-tight mb-8" style={{ fontWeight: 300 }}>
          {finalName}
        </h3>

        {/* Prix */}
        <div className="mb-10">
          <p className="text-4xl text-amber-50 flex items-baseline gap-2 bg-white/5 inline-block px-6 py-4 rounded-xl border border-white/5 shadow-inner" style={{ fontWeight: 300 }}>
            {finalPrice} <span className="text-2xl font-light text-amber-100/50">TND</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
          {productData.description}
        </p>

        {/* Listes / Détails */}
        <div className="space-y-4 mb-14 pb-12 border-b border-white/10">
          {t.product.details.map((detail: string, dIndex: number) => (
            <motion.div
              key={detail}
              className="flex items-center gap-4 text-white/50 text-base"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + dIndex * 0.1 + (index * 0.1) }}
            >
              <div className="w-1.5 h-1.5 bg-amber-200/50 rounded-full shadow-[0_0_10px_rgba(253,230,138,0.5)]" />
              <span>{detail}</span>
            </motion.div>
          ))}
        </div>

        {/* Sélecteur de Tailles Premium */}
        <div className="mb-12">
          <p className="text-white/40 text-[10px] tracking-[0.3em] mb-5 uppercase">{t.product.selectSize}</p>
          <div className="flex flex-wrap gap-4">
            {sizes.map((size) => (
              <motion.button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-14 h-14 rounded-full border text-sm font-medium transition-all duration-300 ${
                  selectedSize === size
                    ? 'border-transparent bg-amber-100 text-black shadow-[0_0_30px_rgba(254,243,199,0.3)]'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/40 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bouton Panier Principal */}
        <motion.button
          onClick={handleAdd}
          className="w-full bg-white hover:bg-amber-100 text-black py-6 rounded-xl tracking-[0.25em] text-sm transition-all relative overflow-hidden group font-medium shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(254,243,199,0.3)]"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-neutral-200"
            initial={{ x: '-100%' }}
            animate={isAdding ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.8 }}
          />
          <span className="relative z-10 uppercase flex items-center justify-center gap-2">
            {isAdding ? t.product.added : t.product.addToCart}
          </span>
        </motion.button>

        {/* Info Avantages */}
        <div className="mt-10 grid grid-cols-2 gap-y-4 gap-x-2 text-white/40 text-xs">
          <p className="flex items-center gap-2">✓ {t.product.freeShipping}</p>
          <p className="flex items-center gap-2">✓ {t.product.returns}</p>
          <p className="flex items-center gap-2 col-span-2">✓ {t.product.authenticity}</p>
        </div>
      </motion.div>
    </div>
  );
}

interface FeaturedProductProps {
  onAddToCart: (product: { id: number; name: string; price: number; image: string; size: string }) => void;
}

export function FeaturedProduct({ onAddToCart }: FeaturedProductProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [backendProducts, setBackendProducts] = useState<ProductDTO[]>([]);
  const { t } = useLanguage();

  const getProducts = async () => {
    try {
      const dbProducts = await fetchProducts();
      setBackendProducts(dbProducts || []);
    } catch (error) {
      console.error("Failed to fetch products from backend:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <section id="collection" className="bg-[#050505] py-40 px-6 overflow-hidden relative" ref={sectionRef}>
      {/* Texture background super subtile */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* En-tête de Section Centralisé */}
        <motion.div
          className="text-center mb-40 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center justify-center gap-6 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-100/50" />
            <p className="text-amber-100/90 text-sm tracking-[0.5em] uppercase font-light">Édition Limitée</p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-100/50" />
          </div>
          <h2 className="text-white text-6xl md:text-8xl tracking-tighter" style={{ fontWeight: 200 }}>
            Découvrir la Collection
          </h2>
        </motion.div>

        {/* Affichage Dynamique des 2 produits */}
        <div className="space-y-40">
          {LOCAL_PRODUCTS.map((localProduct, index) => {
            // Logique de Matching avec la DB (si elle contient les produits de la même ligne)
            const matchedDbProduct = backendProducts.find(
              (p) => p.name.includes(localProduct.name.split(' ')[0]) && (p.price === localProduct.price || p.price > 0)
            );

            return (
              <SingleProductView
                key={localProduct.localId}
                productData={localProduct}
                backendProduct={matchedDbProduct}
                onAddToCart={onAddToCart}
                t={t}
                isInView={isInView}
                index={index}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}