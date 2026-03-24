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
  about: {
    sectionLabel: string;
    title: string;
    sub: string;
    quote1: string;
    quote2: string;
    p1: string;
    p2: string;
    values: string[];
    worldwide: string;
    followUs: string;
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
      name: 'Drop Omar Labidi',
      description: "L'apogée de notre collection. Une fusion parfaite entre l'héritage de la rue et l'innovation contemporaine. Chaque couture raconte l'histoire de Wled Darb — une pièce qui transforme la mémoire en vêtement.",
      details: [
        'Molleton 450 GSM (Heavyweight)',
        'Sérigraphie Haute Densité',
        'Coupe Oversized Premium',
        'Edition Limitée "Omar Labidi"'
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
    about: {
      sectionLabel: 'Notre Histoire',
      title: 'À Propos',
      sub: 'OULED DARB — TUNISIE',
      quote1: '" Pas juste des vêtements.',
      quote2: 'Des histoires de la rue. "',
      p1: 'Une marque née dans les ruelles — qui donne des finitions réelles et transforme la mémoire en vêtements. Chaque couture est une signature, chaque pièce une page.',
      p2: 'صداقة / تضامن / عفوية — Amitié, Solidarité, Spontanéité.',
      values: ['Street Culture', 'Justice', 'Memory', 'Peace (سلام)'],
      worldwide: 'Worldwide',
      followUs: 'Suivez-nous sur Instagram',
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
      name: 'Drop Omar Labidi',
      description: "The peak of our collection. A perfect fusion between street heritage and contemporary innovation. Every stitch tells the story of Wled Darb — a piece that transforms memory into clothing.",
      details: [
        '450 GSM Heavyweight Fleece',
        'High-Density Screen Printing',
        'Premium Oversized Fit',
        'Limited "Omar Labidi" Edition'
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
    about: {
      sectionLabel: 'Our Story',
      title: 'About Us',
      sub: 'OULED DARB — TUNISIA',
      quote1: '" Not Just Clothes.',
      quote2: 'Stories From The Street. "',
      p1: 'A brand born in the streets — giving real finishes and turning memory into clothing. Every stitch is a signature, every piece a page.',
      p2: 'صداقة / تضامن / عفوية — Friendship, Solidarity, Spontaneity.',
      values: ['Street Culture', 'Justice', 'Memory', 'Peace (سلام)'],
      worldwide: 'Worldwide',
      followUs: 'Follow us on Instagram',
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