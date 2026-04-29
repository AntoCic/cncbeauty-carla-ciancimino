import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { TreatmentData } from '../../models/Treatment';

export async function getTreatmentsByCategory(categoryId: string): Promise<TreatmentData[]> {
  const q = query(collection(db, 'treatments'), where('categoryIds', 'array-contains', categoryId));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() } as TreatmentData))
    .filter(t => t.storeVisible !== false);
}

export async function getTreatmentById(id: string): Promise<TreatmentData | null> {
  const snap = await getDoc(doc(db, 'treatments', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as TreatmentData;
}
