import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { clearCart } from '../../store/slices/cartSlice.js';
import { addOrder } from '../../store/slices/orderSlice.js';
import { reduceStockForOrder } from '../../store/slices/productSlice.js';

export function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const products = useSelector((state) => state.products.items);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    mobileNumber: currentUser?.mobileNumber || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
  });
  const [error, setError] = useState('');
  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const unavailableItem = cartItems.find((item) => {
      const product = products.find((currentProduct) => currentProduct.id === item.id);
      return !product || item.quantity > product.stock;
    });

    if (unavailableItem) {
      const product = products.find((currentProduct) => currentProduct.id === unavailableItem.id);
      setError(
        product?.stock <= 0
          ? `${unavailableItem.name} is out of stock.`
          : `${unavailableItem.name} has only ${product?.stock || 0} unit(s) available.`,
      );
      return;
    }

    dispatch(
      addOrder({
        userId: currentUser.id,
        customer: {
          name: formData.fullName,
          mobileNumber: formData.mobileNumber,
          email: currentUser.email,
        },
        shippingAddress: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        },
        items: cartItems,
        total: cartTotal,
      }),
    );
    dispatch(reduceStockForOrder(cartItems));
    dispatch(clearCart());
    navigate('/dashboard', { replace: true });
  };

  if (cartItems.length === 0) {
    return (
      <section className="page-shell space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Checkout</h1>
          <p className="mt-1 text-sm text-steel">Add products before placing an order.</p>
        </div>
        <EmptyState
          title="Nothing to checkout"
          message="Your cart is empty right now."
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      </section>
    );
  }

  return (
    <section className="page-shell space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Checkout</h1>
        <p className="mt-1 text-sm text-steel">Confirm delivery details and place your order.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <form className="panel grid gap-4 p-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input
            className="input-field"
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            name="mobileNumber"
            placeholder="Mobile number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
          <textarea
            className="input-field min-h-28 resize-y sm:col-span-2"
            name="addressLine1"
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />
          <input
            className="input-field sm:col-span-2"
            name="addressLine2"
            placeholder="Address Line 2"
            value={formData.addressLine2}
            onChange={handleChange}
          />
          <input
            className="input-field"
            name="landmark"
            placeholder="Landmark"
            value={formData.landmark}
            onChange={handleChange}
          />
          <input className="input-field" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          <input className="input-field" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
          <input className="input-field" name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
          <input
            className="input-field sm:col-span-2"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 sm:col-span-2">
              {error}
            </p>
          ) : null}
          <button className="btn-primary sm:col-span-2" type="submit">
            Place Order
          </button>
        </form>
        <aside className="panel h-fit p-5">
          <h2 className="text-lg font-bold text-ink">Checkout Summary</h2>
          <div className="mt-5 divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 py-3 text-sm">
                <span className="text-steel">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold text-ink">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between gap-4 border-t border-gray-200 pt-4">
            <span className="font-bold text-ink">Total</span>
            <span className="font-black text-ink">₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
