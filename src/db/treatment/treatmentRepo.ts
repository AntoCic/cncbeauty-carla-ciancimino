import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { TreatmentData } from '../../models/Treatment';

export async function getTreatmentsByCategory(categoryId: string): Promise<TreatmentData[]> {
  console.log(`[db] getTreatmentsByCategory: fetching categoryId=${categoryId}`);
  const q = query(collection(db, 'treatments'), where('categoryIds', 'array-contains', categoryId));
  const snap = await getDocs(q);
  const result = snap.docs
    .map(d => ({ id: d.id, ...d.data() } as TreatmentData))
    .filter(t => t.storeVisible !== false);
  console.log(`[db] getTreatmentsByCategory: ${result.length} visible items`, result);
  return result;
}

export async function getTreatmentById(id: string): Promise<TreatmentData | null> {
  console.log(`[db] getTreatmentById: fetching id=${id}`);
  const snap = await getDoc(doc(db, 'treatments', id));
  if (!snap.exists()) {
    console.warn(`[db] getTreatmentById: not found id=${id}`);
    return null;
  }
  const result = { id: snap.id, ...snap.data() } as TreatmentData;
  console.log(`[db] getTreatmentById: got`, result);
  return result;
}

export async function getTreatmentBySlug(slug: string): Promise<TreatmentData | null> {
  console.log(`[db] getTreatmentBySlug: fetching slug=${slug}`);
  const snap = await getDocs(query(collection(db, 'treatments'), where('slug', '==', slug)));
  if (snap.empty) {
    console.warn(`[db] getTreatmentBySlug: not found slug=${slug}`);
    return null;
  }
  const d = snap.docs[0];
  const result = { id: d.id, ...d.data() } as TreatmentData;
  console.log(`[db] getTreatmentBySlug: got`, result);
  return result;
}
