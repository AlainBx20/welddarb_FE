import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { createOrderInFirebase, OrderStatusData } from '../firebaseConfig';
import { sendAdminOrderNotification } from '../emailService';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export function CartPanel({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartPanelProps) {
  const { t } = useLanguage();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [view, setView] = useState<'cart' | 'checkout'>('cart');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0; // Livraison Gratuite (auparavant 7 TND)
  const total = subtotal + shipping;

  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setOrderStatus('idle');
    setCreatedOrderId(null);

    const order: Partial<OrderStatusData> = {
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      total: total,
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        size: item.size || 'N/A'
      }))
    };

    try {
      // Direct Firebase integration
      const newId = await createOrderInFirebase(order);
      setCreatedOrderId(newId);
      setOrderStatus('success');

      // 📧 Notification par email à l'admin (Optionnel : on ne bloque pas si l'email échoue)
      try {
        await sendAdminOrderNotification({
          order_id: newId,
          customer_name: customerInfo.name,
          total_price: `${total.toFixed(2)} TND`,
          product_name: items.map(i => `${i.name} (${i.size || 'N/A'}) x${i.quantity}`).join(", ")
        });
      } catch (emailErr) {
        console.warn("L'email n'a pas pu être envoyé, mais la commande est en base.", emailErr);
      }
    } catch (error) {
      console.error("Firebase Checkout failed:", error);
      setOrderStatus('error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-neutral-950 border-l border-white/10 z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 350 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/10">
              <h2 className="text-xl text-white tracking-wide" style={{ fontWeight: 300 }}>
                {t.cart.title}
              </h2>
              <motion.button
                onClick={() => { onClose(); setTimeout(() => setView('cart'), 300); }}
                className="text-white/50 hover:text-white transition-colors"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} strokeWidth={1.5} />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8">
              {orderStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-amber-100 mb-6"
                  >
                    <CheckCircle2 size={64} strokeWidth={1} />
                  </motion.div>
                  <h3 className="text-white text-xl mb-2" style={{ fontWeight: 300 }}>Commande Réussie</h3>
                  <p className="text-white/40 mb-2 text-sm">Votre commande a été confirmée.</p>
                  {createdOrderId && (
                    <div className="bg-amber-100/10 border border-amber-100/20 px-4 py-3 rounded-lg mb-8">
                      <p className="text-amber-100/60 text-[10px] tracking-widest uppercase mb-1">Numéro de Suivi</p>
                      <p className="text-amber-100 font-mono text-lg font-bold">{createdOrderId}</p>
                    </div>
                  )}
                  <motion.button
                    onClick={() => { onClose(); setTimeout(() => { setView('cart'); setOrderStatus('idle'); setCustomerInfo({name:'', phone:'', address:''})}, 300); }}
                    className="text-white text-xs tracking-widest hover:text-white/70 transition-colors uppercase"
                  >
                    {t.cart.continueShopping}
                  </motion.button>
                </div>
              ) : view === 'checkout' ? (
                <div className="space-y-6">
                  <h3 className="text-white text-lg font-light tracking-wide mb-4">Détails de Livraison</h3>
                  
                  <div>
                    <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Nom Complet *</label>
                    <input 
                      type="text" 
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-100/50 transition-colors placeholder:text-white/20"
                      placeholder="Ahmed Trabelsi"
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Téléphone *</label>
                    <input 
                      type="tel" 
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-100/50 transition-colors placeholder:text-white/20"
                      placeholder="21 345 678"
                    />
                  </div>

                  <div>
                    <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Adresse Complète *</label>
                    <textarea 
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-amber-100/50 transition-colors h-24 resize-none placeholder:text-white/20"
                      placeholder="Appartement, Rue, Ville, Code Postal"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="button"
                      onClick={() => setView('cart')}
                      className="text-white/50 text-xs hover:text-white transition-colors flex items-center gap-2"
                    >
                      <span>← Retour au panier</span>
                    </button>
                  </div>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-white/40 mb-6 text-sm">{t.cart.empty}</p>
                  <motion.button
                    onClick={onClose}
                    className="text-white text-xs tracking-widest hover:text-white/70 transition-colors uppercase"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t.cart.continueShopping}
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-5 pb-6 border-b border-white/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <div className="w-24 h-32 bg-neutral-900 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-white text-sm mb-1" style={{ fontWeight: 300 }}>
                            {item.name}
                          </h3>
                          {item.size && (
                            <p className="text-white/30 text-xs mb-2">{t.cart.size}: {item.size}</p>
                          )}
                          <p className="text-white/70 text-sm">{item.price} TND</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-white/10 px-3 py-1">
                            <motion.button
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="text-white/50 hover:text-white"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus size={12} strokeWidth={1.5} />
                            </motion.button>
                            <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                            <motion.button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="text-white/50 hover:text-white"
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus size={12} strokeWidth={1.5} />
                            </motion.button>
                          </div>
                          <motion.button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-white/30 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={16} strokeWidth={1.5} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && orderStatus !== 'success' && (
              <div className="border-t border-white/10 p-8 space-y-6 bg-neutral-950">
                <div className="space-y-3">
                  <div className="flex justify-between text-white/50 text-sm">
                    <span>{t.cart.subtotal}</span>
                    <span>{subtotal.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between text-white/50 text-sm">
                    <span>{t.cart.shipping}</span>
                    <span>{shipping.toFixed(2)} TND</span>
                  </div>
                  <div className="flex justify-between text-white text-lg pt-3 border-t border-white/10">
                    <span style={{ fontWeight: 300 }}>{t.cart.total}</span>
                    <span style={{ fontWeight: 300 }}>{total.toFixed(2)} TND</span>
                  </div>
                </div>

                {orderStatus === 'error' && (
                  <p className="text-red-400 text-xs text-center">Erreur lors de la communication avec Firebase.</p>
                )}

                {view === 'cart' ? (
                  <motion.button
                    onClick={() => setView('checkout')}
                    disabled={isCheckingOut}
                    className="w-full bg-white hover:bg-neutral-100 text-black py-5 tracking-[0.2em] text-xs transition-all uppercase disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t.cart.checkout}
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleCheckout}
                    disabled={isCheckingOut || !customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()}
                    className="w-full bg-amber-100 hover:bg-white text-black py-5 tracking-[0.2em] text-xs transition-all uppercase disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isCheckingOut ? t.hero.loading : "Confirmer la commande"}
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}