import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { ProductCard } from '../../components/products/ProductCard.jsx';

export function ProductsPage() {
  const products = useSelector((state) => state.products.items);
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (groupName) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const getSeries = (name) => {
    const numMatch = name.match(/^(iPhone\s+\d+)/i);
    if (numMatch) return numMatch[1];
    
    const seMatch = name.match(/^(iPhone\s+SE)/i);
    if (seMatch) return seMatch[1];
    
    const parts = name.split(' ');
    return parts.slice(0, 2).join(' ');
  };

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

  const groupedProducts = useMemo(() => {
    const groups = {};
    filteredProducts.forEach((product) => {
      const series = getSeries(product.name);
      if (!groups[series]) {
        groups[series] = [];
      }
      groups[series].push(product);
    });
    return groups;
  }, [filteredProducts]);

  const sortedGroupNames = useMemo(() => {
    return Object.keys(groupedProducts).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numB - numA;
      }
      if (!isNaN(numA)) return -1;
      if (!isNaN(numB)) return 1;
      return a.localeCompare(b);
    });
  }, [groupedProducts]);

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

      {sortedGroupNames.length > 0 ? (
        <div className="space-y-4">
          {sortedGroupNames.map((groupName) => {
            const groupItems = groupedProducts[groupName];
            const isCollapsed = !!collapsedGroups[groupName];

            return (
              <div key={groupName} className="panel overflow-hidden border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => toggleGroup(groupName)}
                  className="flex w-full items-center justify-between bg-gray-50/40 px-5 py-4 transition hover:bg-gray-50/80"
                >
                  <div className="text-left">
                    <h2 className="text-base font-extrabold text-ink sm:text-lg">{groupName} Series</h2>
                    <p className="text-xs font-semibold text-steel">
                      {groupItems.length} {groupItems.length === 1 ? 'model' : 'models'} available
                    </p>
                  </div>
                  <svg
                    className={`h-5 w-5 text-steel transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[5000px] opacity-100'
                  }`}
                >
                  <div className="border-t border-gray-100 p-5">
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {groupItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No products found" message="Try searching by model, brand, category, or description." />
      )}
    </section>
  );
}
