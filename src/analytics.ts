import { getAnalytics, logEvent, type Analytics } from 'firebase/analytics';
import { app } from './components/firebase/firebase';

let instance: Analytics | null = null;

export function initAnalytics(): void {
  if (instance) return;
  instance = getAnalytics(app);
}

export function trackPageView(path: string): void {
  if (!instance) return;
  logEvent(instance, 'page_view', { page_path: path });
}
