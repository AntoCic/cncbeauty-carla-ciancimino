import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import { APP_CONFIG_ID, APP_CONFIG_DEFAULTS } from '../../models/AppConfig';
import type { AppConfigData } from '../../models/AppConfig';

export async function getAppConfig(): Promise<AppConfigData> {
  const snap = await getDoc(doc(db, 'appConfig', APP_CONFIG_ID));
  if (!snap.exists()) return { id: APP_CONFIG_ID, ...APP_CONFIG_DEFAULTS };
  return { id: snap.id, ...APP_CONFIG_DEFAULTS, ...snap.data() } as AppConfigData;
}
