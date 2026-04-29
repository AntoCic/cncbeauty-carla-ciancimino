import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { TreatmentCategoryData } from '../../models/TreatmentCategory';

export async function getTreatmentCategories(): Promise<TreatmentCategoryData[]> {
  const snap = await getDocs(collection(db, 'treatmentsCategories'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TreatmentCategoryData));
}

export async function getTreatmentCategoryById(id: string): Promise<TreatmentCategoryData | null> {
  const snap = await getDoc(doc(db, 'treatmentsCategories', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as TreatmentCategoryData;
}
