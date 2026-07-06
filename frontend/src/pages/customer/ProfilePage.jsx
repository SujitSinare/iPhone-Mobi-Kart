import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, updateCustomerProfile } from '../../store/slices/authSlice.js';

export function ProfilePage() {
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.lastName || currentUser?.name?.split(' ').slice(1).join(' ') || '',
    mobileNumber: currentUser?.mobileNumber || '',
    email: currentUser?.email || '',
    dateOfBirth: currentUser?.dateOfBirth || '',
    password: '',
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      firstName: currentUser?.firstName || currentUser?.name?.split(' ')[0] || '',
      lastName: currentUser?.lastName || currentUser?.name?.split(' ').slice(1).join(' ') || '',
      mobileNumber: currentUser?.mobileNumber || '',
      email: currentUser?.email || '',
      dateOfBirth: currentUser?.dateOfBirth || '',
    }));
  }, [currentUser]);

  const handleChange = (event) => {
    setSuccessMessage('');
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateCustomerProfile(formData));
    setSuccessMessage('Profile updated successfully.');
    setFormData((current) => ({ ...current, password: '' }));
  };

  return (
    <section className="page-shell space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Profile</h1>
        <p className="mt-1 text-sm text-steel">Manage your account details and keep checkout information current.</p>
      </div>
      <form className="panel grid gap-4 p-5 sm:grid-cols-2" onSubmit={handleSubmit}>
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
          placeholder="New password"
          minLength="6"
          value={formData.password}
          onChange={handleChange}
        />
        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 sm:col-span-2">
            {error}
          </p>
        ) : null}
        {successMessage && !error ? (
          <p className="rounded-md bg-teal-50 px-3 py-2 text-sm font-medium text-accent sm:col-span-2">
            {successMessage}
          </p>
        ) : null}
        <button className="btn-primary sm:col-span-2" type="submit">
          Save Profile
        </button>
      </form>
    </section>
  );
}
