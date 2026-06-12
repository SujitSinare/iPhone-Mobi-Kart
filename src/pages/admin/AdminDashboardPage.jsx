import { useSelector } from 'react-redux';

export function AdminDashboardPage() {
  const products = useSelector((state) => state.products.items);
  const orders = useSelector((state) => state.orders.items);

  return (
    <section className="page-shell space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-steel">Inventory and order controls are prepared for later phases.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="panel p-5">
          <p className="text-sm font-semibold text-steel">Products</p>
          <p className="mt-2 text-3xl font-black text-ink">{products.length}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm font-semibold text-steel">Orders</p>
          <p className="mt-2 text-3xl font-black text-ink">{orders.length}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm font-semibold text-steel">Low Stock</p>
          <p className="mt-2 text-3xl font-black text-ink">
            {products.filter((product) => product.stock <= 5).length}
          </p>
        </div>
      </div>
      <div className="panel overflow-hidden">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-ink">Customer Orders</h2>
        </div>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-steel">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-semibold text-ink">{order.id}</td>
                    <td className="px-4 py-3 text-steel">{order.customer.name}</td>
                    <td className="px-4 py-3 text-steel">
                      {order.items.reduce((total, item) => total + item.quantity, 0)}
                    </td>
                    <td className="px-4 py-3 text-steel">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-steel">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-6 text-sm text-steel">No customer orders have been placed yet.</p>
        )}
      </div>
    </section>
  );
}
