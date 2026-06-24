import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthPageShell } from '../../components/layout/AuthPageShell.jsx';
import { clearAuthError, loginCustomer } from '../../store/slices/authSlice.js';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, isAuthenticated, role } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && role === 'customer') {
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
      toast.success('Login successful! Welcome back to iPhone Mobi Kart.');
    }
  }, [isAuthenticated, location.state, navigate, role]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginCustomer(formData));
  };

  return (
    <AuthPageShell
      eyebrow="Customer access"
      title="Shop iPhones with a cart that remembers every choice."
      subtitle="Login to checkout, manage orders, and keep your iPhone Mobi Kart profile ready for faster purchases."
    >
      <div className="w-full rounded-lg border border-white/40 bg-white/95 p-6 shadow-soft backdrop-blur">
        <h1 className="text-2xl font-bold text-ink">Customer Login</h1>
        <p className="mt-2 text-sm text-steel">Login with your registered iPhone Mobi Kart account.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
          <button className="btn-primary w-full" type="submit">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-steel">
          New customer? <Link className="font-semibold text-accent" to="/register">Create account</Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
