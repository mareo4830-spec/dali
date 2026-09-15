import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { MENU_ITEMS } from '../data/menuData';

const COLLECTION_NAME = 'menuItems';

/**
 * Suscripción en tiempo real a los documentos de la colección 'menuItems'
 * @param {Function} onDataCallback - Recibe la lista actualizada de items
 * @param {Function} onErrorCallback - Recibe el error si ocurre
 * @returns {Function} Unsubscribe function
 */
export function subscribeToMenuItems(onDataCallback, onErrorCallback) {
  if (!isFirebaseConfigured || !db) {
    console.info('Firebase no está configurado aún o faltan credenciales en .env. Usando datos locales de reserva.');
    onDataCallback(MENU_ITEMS, false);
    return () => {};
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          items.push({
            id: docSnap.id,
            ...docSnap.data(),
          });
        });

        // Notificar los datos obtenidos en tiempo real
        onDataCallback(items, true);
      },
      (error) => {
        console.error('Error escuchando Firestore menuItems:', error);
        if (onErrorCallback) onErrorCallback(error);
        // Fallback a los datos locales en caso de fallo de red o permisos
        onDataCallback(MENU_ITEMS, false);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Excepción al conectar con Firestore:', error);
    if (onErrorCallback) onErrorCallback(error);
    onDataCallback(MENU_ITEMS, false);
    return () => {};
  }
}

/**
 * Añadir una nueva bebida a Firestore
 * @param {Object} itemData
 * @returns {Promise<string>} Id del documento creado
 */
export async function addMenuItem(itemData) {
  if (!db) throw new Error('Base de datos no inicializada. Configura Firebase en .env');

  const payload = {
    category: itemData.category || 'copas',
    name: itemData.name || '',
    price: itemData.price || '',
    photo: itemData.photo || '',
    badge: itemData.badge || '',
    neonColor: itemData.neonColor || 'cyan',
    subtext: itemData.subtext || '',
    description: itemData.description || '',
    specs: Array.isArray(itemData.specs) ? itemData.specs : [],
    popular: Boolean(itemData.popular),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
  return docRef.id;
}

/**
 * Actualizar una bebida existente en Firestore
 * @param {string} id
 * @param {Object} itemData
 */
export async function updateMenuItem(id, itemData) {
  if (!db) throw new Error('Base de datos no inicializada. Configura Firebase en .env');

  const docRef = doc(db, COLLECTION_NAME, id);
  const payload = {
    category: itemData.category,
    name: itemData.name,
    price: itemData.price,
    photo: itemData.photo,
    badge: itemData.badge || '',
    neonColor: itemData.neonColor || 'cyan',
    subtext: itemData.subtext || '',
    description: itemData.description || '',
    specs: Array.isArray(itemData.specs) ? itemData.specs : [],
    popular: Boolean(itemData.popular),
    updatedAt: serverTimestamp(),
  };

  await updateDoc(docRef, payload);
}

/**
 * Eliminar una bebida de Firestore
 * @param {string} id
 */
export async function deleteMenuItem(id) {
  if (!db) throw new Error('Base de datos no inicializada. Configura Firebase en .env');

  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

/**
 * Siembra masiva de las bebidas por defecto a Firestore
 * @returns {Promise<number>} Cantidad de bebidas migradas
 */
export async function seedDefaultMenuItems() {
  if (!db) throw new Error('Base de datos no inicializada. Configura Firebase en .env');

  const batch = writeBatch(db);
  const colRef = collection(db, COLLECTION_NAME);

  for (const item of MENU_ITEMS) {
    // Usamos el id original como id de documento o generamos uno nuevo
    const docRef = doc(colRef, item.id);
    batch.set(docRef, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
  return MENU_ITEMS.length;
}
