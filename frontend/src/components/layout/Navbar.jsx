import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { logout, fetchProfile } from '../../store/slices/authSlice.js';
import { fetchProducts } from '../../store/slices/productSlice.js';
import { fetchCart } from '../../store/slices/cartSlice.js';
import { fetchOrders } from '../../store/slices/orderSlice.js';

const navItems = [
  { to: '/products', label: 'Products' },
  { to: '/cart', label: 'Cart' },
  { to: '/orders', label: 'Orders' },
  { to: '/profile', label: 'Profile' },
];

export function Navbar() {
  const dispatch = useDispatch();
  const { isAuthenticated, role, currentUser } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + Number(item.quantity || 0), 0),
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
      dispatch(fetchOrders());
      if (role === 'customer') {
        dispatch(fetchCart());
      }
    }
  }, [dispatch, isAuthenticated, role]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('You have been logged out successfully.');
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={isAuthenticated ? (role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'}
          className="flex items-center gap-2 text-lg font-bold text-ink"
        >
          <img
            src="https://www.apple.com/ac/globalfooter/8/en_US/assets/ac-footer/breadcrumbs/apple/icon_large.svg"
            alt="Apple Logo"
            className="w-8 h-8"
          />
          <span>iPhone Mobi Kart</span>
        </Link>
        {role !== 'admin' ? (
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-accent' : 'text-steel hover:text-ink'}`
                }
              >
                <span className="inline-flex items-center gap-2">
                  {item.label}
                  {item.to === '/cart' && cartCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </span>
              </NavLink>
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden max-w-36 truncate text-sm font-semibold text-steel sm:inline">
                {currentUser?.name}
              </span>
              <button className="btn-secondary" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
