import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductsByCategory } from '../../db/product/productRepo';
import { getProductCategoryById } from '../../db/productCategory/productCategoryRepo';
import type { ProductData } from '../../models/Product';

const fmt = (price: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);

const ProductList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryTitle, setCategoryTitle] = useState('');
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    Promise.all([
      getProductCategoryById(categoryId),
      getProductsByCategory(categoryId),
    ]).then(([cat, items]) => {
      if (cat) setCategoryTitle(cat.title);
      setProducts(items);
    }).finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="container py-4">
      <Link to="/prodotti" className="text-muted small">&larr; Prodotti</Link>
      <h1 className="mt-2 mb-4">{categoryTitle || 'Categoria'}</h1>

      {loading && <p>Caricamento...</p>}

      <div className="row g-3">
        {products.map(p => (
          <div key={p.id} className="col-12 col-md-6">
            <Link
              to={`/prodotti/${categoryId}/${p.id}`}
              className="d-block p-3 border rounded text-decoration-none"
            >
              <strong>{p.title}</strong>
              {p.subtitle && <p className="mb-1 text-muted small">{p.subtitle}</p>}
              {typeof p.price === 'number' && (
                <div className="mt-1 small">{fmt(p.price)}</div>
              )}
            </Link>
          </div>
        ))}
        {!loading && products.length === 0 && (
          <p className="text-muted">Nessun prodotto disponibile.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
