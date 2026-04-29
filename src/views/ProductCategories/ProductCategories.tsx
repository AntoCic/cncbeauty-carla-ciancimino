import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductCategories } from '../../db/productCategory/productCategoryRepo';
import type { ProductCategoryData } from '../../models/ProductCategory';

const ProductCategories = () => {
  const [categories, setCategories] = useState<ProductCategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-4">
      <Link to="/" className="text-muted small">&larr; Home</Link>
      <h1 className="mt-2 mb-4">Prodotti</h1>

      {loading && <p>Caricamento...</p>}

      <div className="row g-3">
        {categories.map(cat => (
          <div key={cat.id} className="col-12 col-sm-6 col-md-4">
            <Link to={`/prodotti/${cat.id}`} className="d-block p-3 border rounded text-decoration-none">
              {cat.emoji && <span className="me-2">{cat.emoji}</span>}
              <strong>{cat.title}</strong>
              {cat.subtitle && <p className="mb-0 mt-1 text-muted small">{cat.subtitle}</p>}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
