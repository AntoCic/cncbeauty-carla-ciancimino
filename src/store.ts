import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import appConfigReducer, { fetchAppConfig } from './db/appConfig/appConfigSlice';

export const store = configureStore({
  reducer: {
    appConfig: appConfigReducer,
  },
  // appConfigRepo.ts spread grezzamente `snap.data()` in `AppConfigData`: qualunque campo
  // Timestamp del documento Firestore (dichiarato come `AppConfigReview.date`, o non dichiarato
  // nel tipo come `createdAt`/`updatedAt` scritti dal gestionale) arriva così com'è nello store.
  // Voluto — `AppConfigReview.date` serve come Timestamp reale a Testimonials.tsx (`.toMillis()`)
  // — quindi va escluso dal controllo di serializzabilità di default di Redux Toolkit, ma solo
  // per l'azione di questo fetch (non per l'intero store, nel caso in futuro si aggiungano altre
  // slice che devono restare piatte).
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [fetchAppConfig.fulfilled.type],
        ignoredPaths: [/^appConfig\.data/],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
