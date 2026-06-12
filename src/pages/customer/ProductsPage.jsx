import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { ProductCard } from '../../components/products/ProductCard.jsx';

export function ProductsPage() {
  const products = useSelector((state) => state.products.items);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.brand, product.category, product.description]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [products, searchTerm]);

  return (
    <section className="page-shell space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Products</h1>
          <p className="mt-1 text-sm text-steel">Browse available iPhones and open details before adding to cart.</p>
        </div>
        <input
          className="input-field sm:max-w-xs"
          placeholder="Search products"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      {filteredProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" message="Try searching by model, brand, category, or description." />
      )}
    </section>
  );
}
