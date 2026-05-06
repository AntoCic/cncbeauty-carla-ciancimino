import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { TreatmentCategoryData } from '../../models/TreatmentCategory';

export async function getTreatmentCategories(): Promise<TreatmentCategoryData[]> {
  console.log('[db] getTreatmentCategories: fetching all');
  const snap = await getDocs(collection(db, 'treatmentsCategories'));
  const result = snap.docs.map(d => ({ id: d.id, ...d.data() } as TreatmentCategoryData));
  console.log(`[db] getTreatmentCategories: ${result.length} items`, result);
  return result;
}

export async function getTreatmentCategoryById(id: string): Promise<TreatmentCategoryData | null> {
  console.log(`[db] getTreatmentCategoryById: fetching id=${id}`);
  const snap = await getDoc(doc(db, 'treatmentsCategories', id));
  if (!snap.exists()) {
    console.warn(`[db] getTreatmentCategoryById: not found id=${id}`);
    return null;
  }
  const result = { id: snap.id, ...snap.data() } as TreatmentCategoryData;
  console.log(`[db] getTreatmentCategoryById: got`, result);
  return result;
}
