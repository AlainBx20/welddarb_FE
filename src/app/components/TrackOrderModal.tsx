import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Package, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { trackOrderInFirebase, OrderStatusData } from '../firebaseConfig';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrackOrderModal({ isOpen, onClose }: TrackOrderModalProps) {
  const { t } = useLanguage();
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<OrderStatusData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const data = await trackOrderInFirebase(orderId.trim());
      if (data) {
        setResult(data);
      } else {
        setError('Commande introuvable. Vérifiez votre numéro de commande.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Erreur de connexion avec Firebase. Vérifiez la configuration (firebaseConfig.ts).');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'PENDING':
        return { color: 'text-yellow-500', icon: <Clock size={20} />, text: 'En attente' };
      case 'PROCESSING':
        return { color: 'text-blue-500', icon: <Package size={20} />, text: 'En cours de préparation' };
      case 'SHIPPED':
        return { color: 'text-purple-500', icon: <Package size={20} />, text: 'Expédiée' };
      case 'DELIVERED':
        return { color: 'text-green-500', icon: <CheckCircle2 size={20} />, text: 'Livrée' };
      case 'CANCELLED':
        return { color: 'text-red-500', icon: <AlertCircle size={20} />, text: 'Annulée' };
      default:
        return { color: 'text-white/50', icon: <Package size={20} />, text: 'Statut inconnu' };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#0a0a0a] border border-white/10 w-full max-w-md p-8 rounded-2xl relative shadow-2xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            {/* Bouton Fermer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-light text-white mb-2 tracking-wide uppercase">
              {t.nav.trackOrder}
            </h3>
            <p className="text-white/40 text-xs mb-8">
              Entrez votre numéro de commande fourni lors de l'achat pour voir l'état actuel.
            </p>

            {/* Formulaire de recherche */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="EX: ORD-123456"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-4 pr-12 focus:outline-none focus:border-amber-100/50 transition-colors uppercase text-sm tracking-widest"
                />
                <button
                  type="submit"
                  disabled={isSearching || !orderId.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-100 text-black p-2 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Loading */}
            {isSearching && (
              <div className="text-center text-white/50 text-xs py-4 flex flex-col items-center gap-3">
                <div className="w-5 h-5 border-2 border-amber-100/20 border-t-amber-100 rounded-full animate-spin" />
                Recherche dans Firebase...
              </div>
            )}

            {/* Erreur */}
            {error && !isSearching && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Résultat positif */}
            {result && !isSearching && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-2">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-white/40 text-xs mb-1 uppercase tracking-wider">Commande</p>
                    <p className="text-white font-mono text-xl">{result.id}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className={`p-3 rounded-full bg-white/5 ${getStatusDisplay(result.status).color}`}>
                      {getStatusDisplay(result.status).icon}
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Statut</p>
                      <p className={`text-sm font-medium ${getStatusDisplay(result.status).color}`}>
                        {getStatusDisplay(result.status).text}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Montant Total</p>
                      <p className="text-white tracking-widest text-sm">{result.total} TND</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Client</p>
                      <p className="text-white/80 text-sm">{result.customerName}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
