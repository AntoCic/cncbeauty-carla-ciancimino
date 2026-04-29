import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTreatmentsByCategory } from '../../db/treatment/treatmentRepo';
import { getTreatmentCategoryById } from '../../db/treatmentCategory/treatmentCategoryRepo';
import type { TreatmentData } from '../../models/Treatment';

const fmt = (price: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);

const TreatmentList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryTitle, setCategoryTitle] = useState('');
  const [treatments, setTreatments] = useState<TreatmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) return;
    Promise.all([
      getTreatmentCategoryById(categoryId),
      getTreatmentsByCategory(categoryId),
    ]).then(([cat, items]) => {
      if (cat) setCategoryTitle(cat.title);
      setTreatments(items);
    }).finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="container py-4">
      <Link to="/trattamenti" className="text-muted small">&larr; Trattamenti</Link>
      <h1 className="mt-2 mb-4">{categoryTitle || 'Categoria'}</h1>

      {loading && <p>Caricamento...</p>}

      <div className="row g-3">
        {treatments.map(t => (
          <div key={t.id} className="col-12 col-md-6">
            <Link
              to={`/trattamenti/${categoryId}/${t.id}`}
              className="d-block p-3 border rounded text-decoration-none"
            >
              <strong>{t.title}</strong>
              {t.subtitle && <p className="mb-1 text-muted small">{t.subtitle}</p>}
              <div className="d-flex gap-3 mt-1 small">
                {typeof t.price === 'number' && <span>{fmt(t.price)}</span>}
                {typeof t.duration === 'number' && <span>{t.duration} min</span>}
              </div>
            </Link>
          </div>
        ))}
        {!loading && treatments.length === 0 && (
          <p className="text-muted">Nessun trattamento disponibile.</p>
        )}
      </div>
    </div>
  );
};

export default TreatmentList;
