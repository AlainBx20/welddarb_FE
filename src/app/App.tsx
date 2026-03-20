import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScrollVideoSection } from './components/ScrollVideoSection';
import { FeaturedProduct } from './components/FeaturedProduct';
import { Footer } from './components/Footer';
import { CartPanel } from './components/CartPanel';
import { TrackOrderModal } from './components/TrackOrderModal';
import { AdminPanel } from './components/AdminPanel';
import { LanguageProvider } from './contexts/LanguageContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Secret Admin Access: /ADA route OR hash #admin-weldarab OR Ctrl+Shift+A
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;

    // Open directly if URL is /ADA or /#admin-weldarab
    if (path === '/ADA' || path === '/ada' || hash === '#admin-weldarab') {
      setIsAdminOpen(true);
    }

    // Keyboard shortcut: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddToCart = (product: { id: number; name: string; price: number; image: string; size: string }) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id && item.size === product.size
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });

    // Open cart panel when item is added
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <LanguageProvider>
      <div className="size-full bg-black">
        <Navbar
          onCartClick={() => setIsCartOpen(true)}
          onTrackClick={() => setIsTrackModalOpen(true)}
          cartItemCount={totalItems}
        />
        <ScrollVideoSection onTrackClick={() => setIsTrackModalOpen(true)} />
        <FeaturedProduct onAddToCart={handleAddToCart} />
        <Footer />
        <CartPanel
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
        <TrackOrderModal
          isOpen={isTrackModalOpen}
          onClose={() => setIsTrackModalOpen(false)}
        />
        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </div>
    </LanguageProvider>
  );
}