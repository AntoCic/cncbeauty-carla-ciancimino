import type { Timestamp } from 'firebase/firestore';

/** Mirrors cncbeauty-menage's PromotionData shape (see cncbeauty-menage/src/models/Promotion.ts). */
export interface PromotionData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'general' | 'products' | 'treatments';
  categoryIds?: string[];
  startDate: Timestamp;
  endDate: Timestamp;
  active: boolean;
  updateBy: string;
}
