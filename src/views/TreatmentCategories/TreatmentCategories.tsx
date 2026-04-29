import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTreatmentCategories } from '../../db/treatmentCategory/treatmentCategoryRepo';
import type { TreatmentCategoryData } from '../../models/TreatmentCategory';

const TreatmentCategories = () => {
  const [categories, setCategories] = useState<TreatmentCategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTreatmentCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-4">
      <Link to="/" className="text-muted small">&larr; Home</Link>
      <h1 className="mt-2 mb-4">Trattamenti</h1>

      {loading && <p>Caricamento...</p>}

      <div className="row g-3">
        {categories.map(cat => (
          <div key={cat.id} className="col-12 col-sm-6 col-md-4">
            <Link to={`/trattamenti/${cat.id}`} className="d-block p-3 border rounded text-decoration-none">
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

export default TreatmentCategories;
