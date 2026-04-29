import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { ProductCategoryData } from '../../models/ProductCategory';

export async function getProductCategories(): Promise<ProductCategoryData[]> {
  const snap = await getDocs(collection(db, 'productsCategories'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ProductCategoryData));
}

export async function getProductCategoryById(id: string): Promise<ProductCategoryData | null> {
  const snap = await getDoc(doc(db, 'productsCategories', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ProductCategoryData;
}
