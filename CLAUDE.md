# Project Context

## What this is

**CNC Beauty** — sito vetrina pubblico per il centro estetico di Carla Ciancimino, con sede a Sciacca (AG).

Questo è il sito **pubblico** (no area autenticata, no rotte protette). Esiste un secondo progetto separato per l'area di amministrazione. Alcuni dati (catalogo trattamenti, prodotti, configurazione) sono gestiti dall'admin e letti qui via Firestore.

Il progetto è destinato a diventare un sito vetrina di alta qualità con animazioni (Framer Motion, GSAP) e ottimizzazione SEO/GEO, ma si costruisce incrementalmente.

---

## Language
- **TypeScript only** — no plain JS files. React components use `.tsx`, all other modules use `.ts`.

## Stack
- **Frontend**: Vite + React (TSX)
- **Database**: Firestore (lettura pubblica di `appConfig`, catalogo)
- **Auth**: Firebase Authentication (non usata nel frontend pubblico — solo nel progetto admin)
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting — sito: `cncbeauty-carla-ciancimino`
- **Routing**: React Router v6
- **State management**: Redux Toolkit (slices; il progetto è predisposto ma non ha ancora slice attivi)
- **Animazioni**: Framer Motion + GSAP (installati, da usare progressivamente)

## Firebase deploy
- Progetto Firebase: `cncbeauty-ce`
- Hosting target: `public` → `cncbeauty-carla-ciancimino`
- Deploy: `npm run deploy` (esegue build + `firebase deploy --only hosting:public`)
- Non sovrascrive mai il sito admin (`cncbeauty-ce`), che è un target separato

## Firestore — collezioni pubbliche (read-only dal frontend)
- `/appConfig/main` — configurazione globale del negozio (orari, contatti, testi legali, ecc.) — lettura pubblica
- `/treatments/{id}` — trattamenti del catalogo (storeVisible: true da mostrare)
- `/treatmentsCategories/{id}` — categorie trattamenti
- `/products/{id}` — prodotti del catalogo (storeVisible: true da mostrare)
- `/productsCategories/{id}` — categorie prodotti

Non esistono write operations dal frontend pubblico.

---

## Icons & Emojis
- Prefer **Google Material Symbols** (`material-symbols-outlined` icon font)
- No icon libraries (FontAwesome, etc.)

## Styling conventions
- **Bootstrap 5** classes per layout e utility (grid, spacing, buttons, ecc.)
- **CSS Modules** (`.module.css`) per stili a livello di componente — ogni componente che necessita di stili custom crea un `.module.css` nella stessa cartella
- **Global CSS** solo per cose veramente generiche:
  - `src/styles/main.css` — solo `@import`, nessuna regola diretta
  - `src/styles/partials/` — file parziali (es. `font.css` per `@font-face`/import font), tutti importati in `main.css`

## Components
- **Btn** — usare per tutti i bottoni a meno che non serva un design custom specifico. Import da `src/components/Btn/Btn`.
- **Modal** — dialog riutilizzabile. Import da `src/components/Modal/Modal`.
- **Accordion** — accordion riutilizzabile. Import da `src/components/Accordion/Accordion`.
- **toast** — wrapper di `react-hot-toast` (vedi sezione Toast qui sotto). Import da `src/components/toast/toast`.

---

## Project structure

```
root/
├── public/
│   └── img/
│       └── <category>/        # immagini raggruppate per il sito
├── .firebaserc                # target hosting: public → cncbeauty-carla-ciancimino
├── firebase.json              # hosting target "public", emulatori
├── CHANGELOG.md               # storico versioni, aggiornato ad ogni release
└── src/
    ├── App.tsx                # solo RouterProvider, nessuna logica auth
    ├── main.tsx               # entry point: Redux Provider + Toaster + App
    ├── router.tsx             # rotte pubbliche (nessuna rotta protetta)
    ├── store.ts               # Redux store (predisposto per futuri slice)
    ├── firebase-config.ts     # firebaseConfig + VAPID_PUBLIC_KEY (da .env)
    ├── models/                # solo interfacce TypeScript dei documenti Firestore
    │   ├── AppConfig.ts       # AppConfigData + APP_CONFIG_DEFAULTS + APP_CONFIG_ID
    │   ├── Treatment.ts       # TreatmentData
    │   ├── TreatmentCategory.ts
    │   ├── Product.ts         # ProductData
    │   └── ProductCategory.ts
    ├── components/            # componenti riutilizzabili globali
    │   ├── firebase/
    │   │   └── firebase.ts    # init Firebase: app, auth, db, storage, functions + emulatori
    │   ├── Btn/
    │   ├── Modal/
    │   ├── Accordion/
    │   └── toast/
    │       └── toast.tsx      # wrapper react-hot-toast (importare SEMPRE da qui)
    ├── db/                    # layer Firestore (repo + slice per feature)
    │   └── <feature>/
    │       ├── featureRepo.ts      # getAll, getById, query filtrate
    │       └── featureSlice.ts     # Redux Toolkit slice
    ├── views/                 # una cartella per rotta
    │   └── <FeatureName>/
    │       ├── FeatureName.tsx
    │       ├── FeatureName.module.css
    │       └── cmp/           # sotto-componenti usati solo in questa view
    ├── styles/
    │   ├── main.css           # solo @import
    │   └── partials/
    │       └── font.css
    └── enums/                 # un file .ts per enum
        └── SomeEnum.ts
```

## Layer responsibilities

### `models/`
Solo interfacce TypeScript che rispecchiano la struttura dei documenti Firestore. Nessuna logica, nessuna classe. `AppConfig.ts` include anche `APP_CONFIG_DEFAULTS` con i valori di default dell'app.

### `db/<feature>/`
- **`featureRepo.ts`** — lettura da Firestore: `getAll`, `getById`, query filtrate. Usato per popolare gli slice Redux.
- **`featureSlice.ts`** — Redux Toolkit slice per la feature

### `components/`
Solo componenti e hook riutilizzabili globalmente. Tutto ciò che è specifico di una singola view va in `views/<Feature>/cmp/`.

### `views/`
Una cartella per rotta. Raggruppare per dominio/modello quando le rotte sono correlate.

### `enums/`
Ogni file esporta:
1. Un oggetto `const` con `key === value` (string enum pattern)
2. Un helper `getValue(key)`
3. Un type-guard `isSomeEnum(val)`

---

## Toast

Usare sempre il wrapper del progetto — **mai importare direttamente da `react-hot-toast`** nel codice feature.

```typescript
import { toast } from '../../components/toast/toast'; // aggiustare il path relativo

toast.success('Salvato');
toast.error('Qualcosa è andato storto');
toast.error('Upload fallito', { subtitle: 'File supera il limite di 10 MB', duration: 5000 });
toast.loading('Salvataggio…', { id: 'save-op' });
toast.dismiss('save-op');
```

`ToastOptions` estende le opzioni native di react-hot-toast con un campo aggiuntivo `subtitle?: string`.

---

## Firebase environment
- Config frontend via `.env` (prefisso `VITE_`)
- Il file `src/firebase-config.ts` legge le variabili d'ambiente e le esporta

## Animazioni
- **Framer Motion** — per animazioni React dichiarative (fade in, slide, ecc.)
- **GSAP** — per animazioni più complesse, timeline, scroll-triggered
- Non usare nessuna delle due finché non esplicitamente richiesto

## SEO / GEO (futuro)
- Il sito è destinato ad avere ottimizzazione SEO e geo-referenziazione
- Non implementare nulla in questo ambito finché non esplicitamente richiesto
