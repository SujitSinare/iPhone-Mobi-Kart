import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { ProductImage } from '../../components/common/ProductImage.jsx';
import { removeFromCart, updateCartQuantity } from '../../store/slices/cartSlice.js';

export function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.items);
  const enrichedCartItems = useMemo(
    () =>
      cartItems.map((item) => {
        const product = products.find((currentProduct) => currentProduct.id === item.id);
        const currentStock = product?.stock ?? 0;

        return {
          ...item,
          stock: currentStock,
          isOutOfStock: currentStock <= 0,
          hasQuantityIssue: item.quantity > currentStock,
        };
      }),
    [cartItems, products],
  );
  const cartTotal = useMemo(
    () => enrichedCartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [enrichedCartItems],
  );
  const hasUnavailableItems = enrichedCartItems.some((item) => item.isOutOfStock || item.hasQuantityIssue);

  if (cartItems.length === 0) {
    return (
      <section className="page-shell space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Cart</h1>
          <p className="mt-1 text-sm text-steel">Add iPhones to your cart before checkout.</p>
        </div>
        <EmptyState
          title="Your cart is empty"
          message="Browse products and add your preferred iPhone models here."
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      </section>
    );
  }

  return (
    <section className="page-shell space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Cart</h1>
        <p className="mt-1 text-sm text-steel">Review items, update quantities, and continue to checkout.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          {enrichedCartItems.map((item) => (
            <article key={item.id} className="panel grid gap-4 p-4 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
              <ProductImage src={item.imageUrl} alt={item.name} className="h-28 w-full rounded-md object-contain sm:w-28" />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-accent">{item.brand}</p>
                <h2 className="mt-1 text-lg font-bold text-ink">{item.name}</h2>
                <p className="mt-1 text-sm text-steel">₹{item.price.toLocaleString('en-IN')} each</p>
                <p className={`mt-1 text-xs font-bold ${item.isOutOfStock || item.hasQuantityIssue ? 'text-red-600' : 'text-steel'}`}>
                  {item.isOutOfStock
                    ? 'Out of Stock'
                    : item.hasQuantityIssue
                      ? `Only ${item.stock} available`
                      : `${item.stock} available`}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <input
                  className="input-field w-24"
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  disabled={item.isOutOfStock}
                  onChange={(event) =>
                    dispatch(updateCartQuantity({ id: item.id, quantity: event.target.value, stock: item.stock }))
                  }
                />
                <button className="btn-secondary" type="button" onClick={() => dispatch(removeFromCart(item.id))}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
        <aside className="panel h-fit p-5">
          <h2 className="text-lg font-bold text-ink">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-steel">Items</span>
              <span className="font-semibold text-ink">{enrichedCartItems.reduce((total, item) => total + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-gray-100 pt-3">
              <span className="font-bold text-ink">Total</span>
              <span className="font-black text-ink">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
          {hasUnavailableItems ? (
            <p className="mt-5 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              Update or remove out-of-stock items before checkout.
            </p>
          ) : (
            <Link to="/checkout" className="btn-primary mt-5 w-full">
              Checkout
            </Link>
          )}
        </aside>
      </div>
    </section>
  );
}
