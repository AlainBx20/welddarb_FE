import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, getDocs, collection, query, orderBy } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYs-fqBzrYsmrgmL7E5xieUTiHF1lZEz0",
  authDomain: "welddarb-10b38.firebaseapp.com",
  projectId: "welddarb-10b38",
  storageBucket: "welddarb-10b38.firebasestorage.app",
  messagingSenderId: "844883257062",
  appId: "1:844883257062:web:ec64e1f4b2e1faa7033d27",
  measurementId: "G-B6FLGERE17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);

export interface OrderStatusData {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  date: string;
  customerName: string;
  phone?: string;
  address?: string;
  items?: any[];
}

// Fonction pour sauvegarder (créer) une commande dans Firebase
export async function createOrderInFirebase(orderData: Partial<OrderStatusData>): Promise<string> {
  try {
    // Générer un ID de commande unique, ex: ORD-8A5F2
    const orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const docRef = doc(db, "orders", orderId);
    await setDoc(docRef, {
      ...orderData,
      id: orderId,
      status: 'PENDING', // Statut initial par défaut
      createdAt: serverTimestamp(),
      date: new Date().toISOString()
    });

    return orderId;
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    throw error;
  }
}

// Fonction pour tracker une commande spécifique
export async function trackOrderInFirebase(orderId: string): Promise<OrderStatusData | null> {
  try {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as OrderStatusData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erreur lors du tracking de la commande:", error);
    throw error;
  }
}

// Fonction SECRET ADMIN : Mettre à jour le statut d'une commande
export async function updateOrderStatusInFirebase(orderId: string, newStatus: string): Promise<boolean> {
  try {
    // import { updateDoc } from "firebase/firestore"; // We need to add updateDoc to the imports at top
    // actually doing it properly with setDoc(docRef, { status: newStatus }, { merge: true }) works and doesn't require new imports
    const docRef = doc(db, "orders", orderId);
    await setDoc(docRef, { status: newStatus }, { merge: true });
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw error;
  }
}

// Fonction SECRET ADMIN : Récupérer toutes les commandes
export async function fetchAllOrdersFromFirebase(): Promise<OrderStatusData[]> {
  try {
    const q = query(collection(db, "orders"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const orders: OrderStatusData[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push({ id: docSnap.id, ...docSnap.data() } as OrderStatusData);
    });
    return orders;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    throw error;
  }
}
