import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState.jsx';

export function CustomerDashboardPage() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const cartItems = useSelector((state) => state.cart.items);
  const orders = useSelector((state) =>
    state.orders.items.filter((order) => order.userId === state.auth.currentUser?.id),
  );
  const latestOrder = orders[0];

  return (
    <section className="page-shell space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Customer Dashboard</h1>
        <p className="mt-1 text-sm text-steel">Welcome back, {currentUser?.name}. Keep shopping or review your latest order.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="panel p-5">
          <p className="text-sm font-semibold text-steel">Cart Items</p>
          <p className="mt-2 text-3xl font-black text-ink">{cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm font-semibold text-steel">Orders</p>
          <p className="mt-2 text-3xl font-black text-ink">{orders.length}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm font-semibold text-steel">Latest Status</p>
          <p className="mt-2 text-3xl font-black text-ink">{latestOrder?.status || 'None'}</p>
        </div>
      </div>
      {latestOrder ? (
        <div className="panel p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">Latest Order</h2>
              <p className="mt-1 text-sm text-steel">
                {latestOrder.items.length} item groups, total ₹{latestOrder.total.toLocaleString('en-IN')}
              </p>
            </div>
            <Link to="/orders" className="btn-secondary">
              View Orders
            </Link>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No orders yet"
          message="Complete checkout and your latest order will appear here."
          action={<Link to="/products" className="btn-primary">Browse Products</Link>}
        />
      )}
    </section>
  );
}
