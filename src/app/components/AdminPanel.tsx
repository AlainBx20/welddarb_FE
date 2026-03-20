import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, RefreshCw, CheckCircle2, Package, Clock, AlertCircle, Phone, MapPin, Hash, Lock } from 'lucide-react';
import { fetchAllOrdersFromFirebase, updateOrderStatusInFirebase, OrderStatusData } from '../firebaseConfig';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [orders, setOrders] = useState<OrderStatusData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllOrdersFromFirebase();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadOrders();
    }
  }, [isOpen, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const secretPass = import.meta.env.VITE_ADMIN_PASSWORD || 'ADA';
    if (password === secretPass) {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect.');
    }
  };

  // Reset auth when closed
  useEffect(() => {
    if (!isOpen) {
      setIsAuthenticated(false);
      setPassword('');
    }
  }, [isOpen]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusInFirebase(orderId, newStatus);
      await loadOrders();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'PENDING':
        return { color: 'text-yellow-500', icon: <Clock size={16} />, text: 'En attente' };
      case 'PROCESSING':
        return { color: 'text-blue-500', icon: <Package size={16} />, text: 'En cours' };
      case 'SHIPPED':
        return { color: 'text-purple-500', icon: <Package size={16} />, text: 'Expédiée' };
      case 'DELIVERED':
        return { color: 'text-green-500', icon: <CheckCircle2 size={16} />, text: 'Livrée' };
      case 'CANCELLED':
        return { color: 'text-red-500', icon: <AlertCircle size={16} />, text: 'Annulée' };
      default:
        return { color: 'text-white/50', icon: <Package size={16} />, text: 'Inconnu' };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-xl flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xl text-white font-light tracking-widest uppercase">
                Panel Admin (SECRET)
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={loadOrders}
                className="text-white/40 hover:text-white transition-colors p-2"
                disabled={isLoading}
              >
                <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors border border-white/10 p-2 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
            {!isAuthenticated ? (
              <div className="h-full flex items-center justify-center">
                <motion.form 
                  onSubmit={handleLogin}
                  className="bg-white/5 border border-white/10 p-10 rounded-2xl w-full max-w-sm text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Lock className="mx-auto mb-6 text-amber-100" size={48} />
                  <h3 className="text-white text-xl font-light mb-6 uppercase tracking-widest">Accès Restreint</h3>
                  <div className="space-y-6 mb-8 text-left">
                    <div>
                      <label className="text-[10px] text-white/30 uppercase tracking-widest ml-1 mb-3 block">Clef d'Accès Admin</label>
                      <input 
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full bg-black border border-white/10 text-white px-6 py-4 rounded-xl focus:border-amber-100 outline-none text-center tracking-[0.5em] text-lg transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-amber-100 text-black py-4 rounded-lg font-bold tracking-widest uppercase hover:bg-white transition-colors"
                  >
                    Débloquer
                  </button>
                </motion.form>
              </div>
            ) : isLoading && orders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/20 uppercase tracking-[0.3em]">
                Chargement des dossiers secrets...
              </div>
            ) : orders.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/20 uppercase tracking-[0.3em]">
                Aucune commande dans la base.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                      {/* Order Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-amber-100 font-mono text-lg">{order.id}</span>
                            <span className="text-white/20">|</span>
                            <span className="text-white/80 text-sm">{new Date(order.date).toLocaleString()}</span>
                          </div>
                          <div className={`p-2 px-3 rounded-full bg-white/5 border border-white/5 flex items-center gap-2 ${getStatusDisplay(order.status).color}`}>
                            {getStatusDisplay(order.status).icon}
                            <span className="text-[10px] uppercase font-bold tracking-widest">{getStatusDisplay(order.status).text}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Hash size={16} className="text-white/30 mt-1" />
                              <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Client</p>
                                <p className="text-white text-sm">{order.customerName}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <Phone size={16} className="text-white/30 mt-1" />
                              <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Téléphone</p>
                                <p className="text-white text-sm">{order.phone || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin size={16} className="text-white/30 mt-1" />
                            <div>
                              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">Adresse de Livraison</p>
                              <p className="text-white text-sm leading-relaxed">{order.address || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-between">
                        <div>
                          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-4">Mettre à jour le statut</p>
                          <div className="grid grid-cols-1 gap-2">
                            {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusUpdate(order.id, s)}
                                disabled={updatingId === order.id}
                                className={`text-[10px] uppercase tracking-[0.2em] py-2 px-4 rounded-lg border transition-all ${
                                  order.status === s 
                                    ? 'bg-white text-black border-white' 
                                    : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                                }`}
                              >
                                {s === 'PENDING' ? 'Attente' : s === 'PROCESSING' ? 'Préparation' : s === 'SHIPPED' ? 'Expédiée' : s === 'DELIVERED' ? 'Livrée' : 'Annulée'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mt-8 pt-4 border-t border-white/5">
                          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1 font-bold">Total</p>
                          <p className="text-amber-100 text-xl font-mono">{order.total} TND</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
