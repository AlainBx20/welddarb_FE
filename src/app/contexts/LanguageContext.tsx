import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface Translations {
  nav: {
    newArrivals: string;
    collection: string;
    about: string;
    contact: string;
    trackOrder: string;
  };
  hero: {
    title: string;
    scroll: string;
    loading: string;
    viewCollection: string;
  };
  product: {
    featured: string;
    name: string;
    description: string;
    details: string[];
    selectSize: string;
    addToCart: string;
    added: string;
    freeShipping: string;
    returns: string;
    authenticity: string;
  };
  cart: {
    title: string;
    empty: string;
    continueShopping: string;
    size: string;
    subtotal: string;
    shipping: string;
    total: string;
    checkout: string;
  };
  footer: {
    tagline: string;
    shop: string;
    shopLinks: string[];
    support: string;
    supportLinks: string[];
    newsletter: string;
    newsletterText: string;
    emailPlaceholder: string;
    join: string;
    rights: string;
  };
}

const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      newArrivals: 'Nouveautés',
      collection: 'Collection',
      about: 'À Propos',
      contact: 'Contact',
      trackOrder: 'Suivre ma commande',
    },
    hero: {
      title: 'LUXE REDÉFINI',
      scroll: 'DÉFILER POUR EXPLORER',
      loading: 'Chargement...',
      viewCollection: 'VOIR LA COLLECTION',
    },
    product: {
      featured: 'En Vedette',
      name: 'Veste Heritage',
      description: 'Une pièce intemporelle méticuleusement confectionnée en laine italienne premium. Chaque couture raconte une histoire d\'artisanat traditionnel et d\'innovation moderne.',
      details: [
        'Tissu en laine italienne',
        'Détails cousus main',
        'Quincaillerie d\'époque',
        'Édition numérotée'
      ],
      selectSize: 'Sélectionner la Taille',
      addToCart: 'Ajouter au Panier',
      added: 'Ajouté',
      freeShipping: 'Livraison gratuite dans le monde entier',
      returns: 'Politique de retour de 30 jours',
      authenticity: 'Authenticité garantie',
    },
    cart: {
      title: 'Panier',
      empty: 'Votre panier est vide',
      continueShopping: 'Continuer vos Achats',
      size: 'Taille',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      total: 'Total',
      checkout: 'Commander',
    },
    footer: {
      tagline: 'Où l\'élégance intemporelle rencontre le design contemporain.',
      shop: 'Boutique',
      shopLinks: ['Nouveautés', 'Hommes', 'Femmes', 'Accessoires'],
      support: 'Support',
      supportLinks: ['Contact', 'Livraison', 'Retours', 'FAQ'],
      newsletter: 'Restez Informé',
      newsletterText: 'Abonnez-vous pour des offres exclusives.',
      emailPlaceholder: 'Email',
      join: 'Rejoindre',
      rights: '© 2026 ولاد درب. Tous droits réservés.',
    },
  },
  en: {
    nav: {
      newArrivals: 'New Arrivals',
      collection: 'Collection',
      about: 'About',
      contact: 'Contact',
      trackOrder: 'Track Order',
    },
    hero: {
      title: 'LUXURY REDEFINED',
      scroll: 'SCROLL TO EXPLORE',
      loading: 'Loading...',
      viewCollection: 'VIEW COLLECTION',
    },
    product: {
      featured: 'Featured',
      name: 'Heritage Jacket',
      description: 'A timeless piece meticulously crafted from premium Italian wool. Every stitch tells a story of heritage craftsmanship and modern innovation.',
      details: [
        'Italian wool fabric',
        'Hand-stitched details',
        'Heritage hardware',
        'Numbered edition'
      ],
      selectSize: 'Select Size',
      addToCart: 'Add to Cart',
      added: 'Added',
      freeShipping: 'Free shipping worldwide',
      returns: '30-day return policy',
      authenticity: 'Authenticity guaranteed',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      size: 'Size',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      checkout: 'Checkout',
    },
    footer: {
      tagline: 'Where timeless elegance meets contemporary design.',
      shop: 'Shop',
      shopLinks: ['New Arrivals', 'Men', 'Women', 'Accessories'],
      support: 'Support',
      supportLinks: ['Contact', 'Shipping', 'Returns', 'FAQ'],
      newsletter: 'Stay Updated',
      newsletterText: 'Subscribe for exclusive offers.',
      emailPlaceholder: 'Email',
      join: 'Join',
      rights: '© 2026 ولاد درب. All rights reserved.',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr'); // French as default

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}