import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart } from '../../store/slices/cartSlice.js';
import { ProductImage } from '../common/ProductImage.jsx';

export function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const isOutOfStock = product.stock <= 0;
  const cartItems = useSelector((state) => state.cart.items.find((item) => item.id === product.id));

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="panel overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100">
        <ProductImage src={product.imageUrl} alt={product.name} className="h-full w-full object-contain" />
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">{product.brand}</p>
          <h3 className="mt-1 text-base font-bold text-ink">{product.name}</h3>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="font-bold text-ink">₹{product.price.toLocaleString('en-IN')}</span>
          <span className={`text-xs font-bold ${isOutOfStock ? 'text-red-600' : 'text-steel'}`}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </span>
        </div>
        <Link to={`/products/${product.id}`} className="btn-secondary w-full">
          View Details
        </Link>
        <button
          className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-gray-300"
          type="button"
          disabled={isOutOfStock || (cartItems?.quantity >= product.stock)}
          onClick={handleAddToCart}
        >
          {isOutOfStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
        </button>
        {added ? <p className="text-center text-xs font-bold text-accent">Item added to your cart.</p> : null}
      </div>
    </article>
  );
}
