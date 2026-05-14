import { useEffect } from 'react';
import { createBrowserRouter, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Home from './views/Home/Home';
import TreatmentCategories from './views/TreatmentCategories/TreatmentCategories';
import ProductCategories from './views/ProductCategories/ProductCategories';
import TreatmentList from './views/TreatmentList/TreatmentList';
import ProductList from './views/ProductList/ProductList';
import ItemDetail from './views/ItemDetail/ItemDetail';
import LegalPage from './views/LegalPage/LegalPage';
import CookieBanner from './components/CookieBanner/CookieBanner';
import { trackPageView } from './analytics';

const RouteTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
  return null;
};

const RootLayout = () => (
  <>
    <ScrollRestoration />
    <RouteTracker />
    <Outlet />
    <CookieBanner />
  </>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/trattamenti', element: <TreatmentCategories /> },
      { path: '/prodotti', element: <ProductCategories /> },
      { path: '/trattamenti/:categorySlug', element: <TreatmentList /> },
      { path: '/prodotti/:categorySlug', element: <ProductList /> },
      { path: '/trattamenti/:categorySlug/:slug', element: <ItemDetail type="treatment" /> },
      { path: '/prodotti/:categorySlug/:slug', element: <ItemDetail type="product" /> },
      { path: '/privacy', element: <LegalPage type="privacy" /> },
      { path: '/cookie', element: <LegalPage type="cookie" /> },
      { path: '/termini', element: <LegalPage type="terms" /> },
    ],
  },
]);
