import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTreatmentById } from '../../db/treatment/treatmentRepo';
import { getProductById } from '../../db/product/productRepo';
import type { TreatmentData } from '../../models/Treatment';
import type { ProductData } from '../../models/Product';

interface Props {
  type: 'treatment' | 'product';
}

const fmt = (price: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);

const ItemDetail = ({ type }: Props) => {
  const { categoryId, id } = useParams<{ categoryId: string; id: string }>();
  const [item, setItem] = useState<TreatmentData | ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const backTo = type === 'treatment' ? `/trattamenti/${categoryId}` : `/prodotti/${categoryId}`;
  const backLabel = type === 'treatment' ? '← Trattamenti' : '← Prodotti';

  useEffect(() => {
    if (!id) return;
    const fetch = type === 'treatment' ? getTreatmentById : getProductById;
    fetch(id)
      .then(data => {
        if (!data) setNotFound(true);
        else setItem(data);
      })
      .finally(() => setLoading(false));
  }, [id, type]);

  if (loading) return <div className="container py-4"><p>Caricamento...</p></div>;
  if (notFound || !item) return (
    <div className="container py-4">
      <Link to={backTo} className="text-muted small">{backLabel}</Link>
      <p className="mt-3">Elemento non trovato.</p>
    </div>
  );

  const isTreatment = type === 'treatment';
  const t = isTreatment ? item as TreatmentData : null;
  const p = !isTreatment ? item as ProductData : null;

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>
      <Link to={backTo} className="text-muted small">{backLabel}</Link>

      <h1 className="mt-2">{item.title}</h1>
      {item.subtitle && <p className="lead text-muted">{item.subtitle}</p>}

      <div className="d-flex flex-wrap gap-3 my-3">
        {typeof item.price === 'number' && (
          <span className="badge bg-secondary fs-6">{fmt(item.price)}</span>
        )}
        {t?.duration && (
          <span className="badge bg-light text-dark border fs-6">{t.duration} min</span>
        )}
      </div>

      {item.description && (
        <section className="mb-4">
          <h5>Descrizione</h5>
          <p>{item.description}</p>
        </section>
      )}

      {item.tipiDiPelle && (
        <section className="mb-4">
          <h5>Tipi di pelle</h5>
          <p>{item.tipiDiPelle}</p>
        </section>
      )}

      {item.ingredienti && (
        <section className="mb-4">
          <h5>Ingredienti</h5>
          <p>{item.ingredienti}</p>
        </section>
      )}

      {p?.consigliUso && (
        <section className="mb-4">
          <h5>Consigli d'uso</h5>
          <p>{p.consigliUso}</p>
        </section>
      )}
    </div>
  );
};

export default ItemDetail;
