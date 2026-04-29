import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { ProductData } from '../../models/Product';

export async function getProductsByCategory(categoryId: string): Promise<ProductData[]> {
  const q = query(collection(db, 'products'), where('categoryIds', 'array-contains', categoryId));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as ProductData))
    .filter(p => p.storeVisible !== false);
}

export async function getProductById(id: string): Promise<ProductData | null> {
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ProductData;
}
