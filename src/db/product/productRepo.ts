import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { ProductData } from '../../models/Product';

export async function getProductsByCategory(categoryId: string): Promise<ProductData[]> {
  console.log(`[db] getProductsByCategory: fetching categoryId=${categoryId}`);
  const q = query(collection(db, 'products'), where('categoryIds', 'array-contains', categoryId));
  const snap = await getDocs(q);
  const result = snap.docs
    .map(d => ({ id: d.id, ...d.data() } as ProductData))
    .filter(p => p.storeVisible !== false);
  console.log(`[db] getProductsByCategory: ${result.length} visible items`, result);
  return result;
}

export async function getProductById(id: string): Promise<ProductData | null> {
  console.log(`[db] getProductById: fetching id=${id}`);
  const snap = await getDoc(doc(db, 'products', id));
  if (!snap.exists()) {
    console.warn(`[db] getProductById: not found id=${id}`);
    return null;
  }
  const result = { id: snap.id, ...snap.data() } as ProductData;
  console.log(`[db] getProductById: got`, result);
  return result;
}

export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  console.log(`[db] getProductBySlug: fetching slug=${slug}`);
  const snap = await getDocs(query(collection(db, 'products'), where('slug', '==', slug)));
  if (snap.empty) {
    console.warn(`[db] getProductBySlug: not found slug=${slug}`);
    return null;
  }
  const d = snap.docs[0];
  const result = { id: d.id, ...d.data() } as ProductData;
  console.log(`[db] getProductBySlug: got`, result);
  return result;
}
