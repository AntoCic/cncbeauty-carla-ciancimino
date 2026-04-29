import { createBrowserRouter } from 'react-router-dom';
import Home from './views/Home/Home';
import TreatmentCategories from './views/TreatmentCategories/TreatmentCategories';
import ProductCategories from './views/ProductCategories/ProductCategories';
import TreatmentList from './views/TreatmentList/TreatmentList';
import ProductList from './views/ProductList/ProductList';
import ItemDetail from './views/ItemDetail/ItemDetail';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/trattamenti', element: <TreatmentCategories /> },
  { path: '/prodotti', element: <ProductCategories /> },
  { path: '/trattamenti/:categoryId', element: <TreatmentList /> },
  { path: '/prodotti/:categoryId', element: <ProductList /> },
  { path: '/trattamenti/:categoryId/:id', element: <ItemDetail type="treatment" /> },
  { path: '/prodotti/:categoryId/:id', element: <ItemDetail type="product" /> },
]);
