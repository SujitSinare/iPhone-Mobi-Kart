import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthPageShell } from '../../components/layout/AuthPageShell.jsx';
import { clearAuthError, loginAdmin } from '../../store/slices/authSlice.js';

export function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, isAuthenticated, role } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && role === 'admin') {
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
      toast.success('Admin login successful! Welcome to the iPhone Mobi Kart admin console.');
    }
  }, [isAuthenticated, location.state, navigate, role]);

  const handleChange = (event) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginAdmin(formData));
  };

  return (
    <AuthPageShell
      eyebrow="Admin console"
      title="Manage inventory, stock, and orders from one focused workspace."
      subtitle="Use the configured administrator account to keep the iPhone Mobi Kart catalog accurate and ready for customers."
    >
      <div className="w-full rounded-lg border border-white/40 bg-white/95 p-6 shadow-soft backdrop-blur">
        <h1 className="text-2xl font-bold text-ink">Admin Login</h1>
        <p className="mt-2 text-sm text-steel">Use the configured admin credentials to manage the store.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="email"
            name="email"
            placeholder="Admin email"
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
      </div>
    </AuthPageShell>
  );
}
