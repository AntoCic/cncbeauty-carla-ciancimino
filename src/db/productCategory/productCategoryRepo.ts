import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { ProductCategoryData } from '../../models/ProductCategory';

export async function getProductCategories(): Promise<ProductCategoryData[]> {
  console.log('[db] getProductCategories: fetching all');
  const snap = await getDocs(collection(db, 'productsCategories'));
  const result = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProductCategoryData));
  console.log(`[db] getProductCategories: ${result.length} items`, result);
  return result;
}

export async function getProductCategoryById(id: string): Promise<ProductCategoryData | null> {
  console.log(`[db] getProductCategoryById: fetching id=${id}`);
  const snap = await getDoc(doc(db, 'productsCategories', id));
  if (!snap.exists()) {
    console.warn(`[db] getProductCategoryById: not found id=${id}`);
    return null;
  }
  const result = { id: snap.id, ...snap.data() } as ProductCategoryData;
  console.log(`[db] getProductCategoryById: got`, result);
  return result;
}
