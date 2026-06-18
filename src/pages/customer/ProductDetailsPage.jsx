import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { ProductImage } from '../../components/common/ProductImage.jsx';
import { addToCart } from '../../store/slices/cartSlice.js';

export function ProductDetailsPage() {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const { id } = useParams();
  const cartItems = useSelector((state) => state.cart.items.find((item) => item.id === id));
  const product = useSelector((state) => state.products.items.find((item) => item.id === id));

  if (!product) {
    return (
      <section className="page-shell">
        <div className="panel p-6">
          <h1 className="text-2xl font-bold text-ink">Product not found</h1>
          <Link to="/products" className="btn-primary mt-4">
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section className="page-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-soft">
        <ProductImage src={product.imageUrl} alt={product.name} className="h-full min-h-96 w-full object-cover" />
      </div>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-accent">{product.brand}</p>
          <h1 className="mt-2 text-3xl font-black text-ink">{product.name}</h1>
        </div>
        <p className="text-3xl font-bold text-ink">₹{product.price.toLocaleString('en-IN')}</p>
        <p className="leading-7 text-steel">{product.description}</p>
        <p className={`text-sm font-bold ${isOutOfStock ? 'text-red-600' : 'text-steel'}`}>
          {isOutOfStock ? 'Out of Stock' : `${product.stock} units available`}
        </p>
        <button
          className="btn-primary disabled:cursor-not-allowed disabled:bg-gray-300"
          type="button"
          disabled={isOutOfStock || (cartItems?.quantity >= product.stock)}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
        </button>
        {added ? <p className="text-sm font-bold text-accent">Item added to your cart.</p> : null}
      </div>
    </section>
  );
}
