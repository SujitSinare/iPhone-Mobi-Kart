import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { ProductImage } from '../../components/common/ProductImage.jsx';

export function OrdersPage() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const orders = useSelector((state) =>
    state.orders.items.filter((order) => order.userId === state.auth.currentUser?.id),
  );

  return (
    <section className="page-shell space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Order History</h1>
        <p className="mt-1 text-sm text-steel">
          Review orders placed by {currentUser?.name} and track their checkout details.
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="Your completed checkout orders will appear here."
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="panel overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-ink">{order.id}</h2>
                  <p className="mt-1 text-sm text-steel">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-teal-50 px-3 py-2 text-sm font-bold text-accent">
                    {order.status}
                  </span>
                  <span className="rounded-md bg-gray-100 px-3 py-2 text-sm font-bold text-ink">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[1fr_18rem]">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="grid gap-3 rounded-md border border-gray-100 p-3 sm:grid-cols-[5rem_1fr_auto] sm:items-center">
                      <ProductImage src={item.imageUrl} alt={item.name} className="h-20 w-full rounded-md object-contain sm:w-20" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-accent">{item.brand}</p>
                        <h3 className="mt-1 font-bold text-ink">{item.name}</h3>
                        <p className="mt-1 text-sm text-steel">Qty {item.quantity}</p>
                      </div>
                      <p className="font-bold text-ink">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>

                <aside className="rounded-md bg-gray-50 p-4">
                  <h3 className="font-bold text-ink">Delivery Details</h3>
                  <div className="mt-3 space-y-2 text-sm text-steel">
                    <p>{order.customer.name}</p>
                    <p>{order.customer.mobileNumber}</p>
                    <p>{order.customer.email}</p>
                    <p>{order.shippingAddress.addressLine1 || order.shippingAddress.address}</p>
                    {order.shippingAddress.addressLine2 ? <p>{order.shippingAddress.addressLine2}</p> : null}
                    {order.shippingAddress.landmark ? <p>Landmark: {order.shippingAddress.landmark}</p> : null}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country} -{' '}
                      {order.shippingAddress.pincode}
                    </p>
                  </div>
                </aside>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
