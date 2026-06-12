import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
];

const customerLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart' },
  { to: '/checkout', label: 'Checkout' },
  { to: '/orders', label: 'Orders' },
  { to: '/profile', label: 'Profile' },
];

export function Sidebar({ role = 'customer' }) {
  const links = role === 'admin' ? adminLinks : customerLinks;
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + Number(item.quantity || 0), 0),
  );

  return (
    <aside className="border-b border-gray-200 bg-white md:min-h-[calc(100vh-4rem)] md:w-64 md:border-b-0 md:border-r">
      <div className="flex gap-2 overflow-x-auto px-4 py-3 md:flex-col md:gap-1 md:p-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold ${
                isActive ? 'bg-teal-50 text-accent' : 'text-steel hover:bg-gray-50 hover:text-ink'
              }`
            }
          >
            <span className="inline-flex items-center gap-2">
              {link.label}
              {link.to === '/cart' && cartCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
