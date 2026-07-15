import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ProductImage } from '../../components/common/ProductImage.jsx';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <section className="page-shell h-[calc(100vh-65px)] grid gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-6">
        <p className="text-sm font-bold uppercase tracking-wide text-accent">Apple phones, organized simply</p>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-ink sm:text-5xl">
            iPhone Mobi Kart
          </h1>
          <p className="max-w-2xl text-base leading-7 text-steel">
            A focused e-commerce workspace for browsing iPhones, managing carts, checking out,
            and running product inventory.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
          <Link to="/admin/login" className="btn-secondary">
            Admin Login
          </Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-soft">
        <ProductImage
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1100&q=80"
          alt="iPhone product display"
          className="h-full min-h-80 w-full object-cover"
        />
      </div>
    </section>
  );
}
