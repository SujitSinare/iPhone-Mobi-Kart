import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthPageShell } from '../../components/layout/AuthPageShell.jsx';
import { clearAuthError, registerCustomer } from '../../store/slices/authSlice.js';

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isAuthenticated, role, status } = useSelector((state) => state.auth);
  const [validationError, setValidationError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'customer') {
        navigate('/dashboard', { replace: true });
        if (status === 'succeeded') {
          toast.success('Registration successful! Welcome to iPhone Mobi Kart.');
        }
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, navigate, role, status]);

  const handleChange = (event) => {
    setValidationError('');
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const mobileNumber = formData.mobileNumber.trim();
    const email = formData.email.trim();
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);

    if (firstName.length < 2) {
      setValidationError('First name must be at least 2 characters.');
      return;
    }

    if (lastName.length < 2) {
      setValidationError('Last name must be at least 2 characters.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setValidationError('Enter a valid 10-digit mobile number.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Enter a valid email address.');
      return;
    }

    if (!formData.dateOfBirth || birthDate >= today) {
      setValidationError('Enter a valid date of birth.');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Password and confirm password must match.');
      return;
    }

    dispatch(
      registerCustomer({
        firstName,
        lastName,
        mobileNumber,
        email,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
      }),
    );
  };

  return (
    <AuthPageShell
      eyebrow="Create account"
      title="Set up your iPhone Mobi Kart profile for faster checkout."
      subtitle="Register once, keep your cart moving, and return anytime to manage orders and profile details."
    >
      <div className="w-full rounded-lg border border-white/40 bg-white/95 p-6 shadow-soft backdrop-blur">
        <h1 className="text-2xl font-bold text-ink">Customer Registration</h1>
        <p className="mt-2 text-sm text-steel">Create a customer account to browse, save cart items, and checkout.</p>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input
            className="input-field"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            minLength="10"
            maxLength="10"
            required
          />
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
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
          <input
            className="input-field sm:col-span-2"
            type="password"
            name="password"
            placeholder="Password"
            minLength="6"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            className="input-field sm:col-span-2"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            minLength="6"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {validationError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 sm:col-span-2">
              {validationError}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 sm:col-span-2">
              {error}
            </p>
          ) : null}
          <button className="btn-primary sm:col-span-2" type="submit">
            Register
          </button>
        </form>
      </div>
    </AuthPageShell>
  );
}
