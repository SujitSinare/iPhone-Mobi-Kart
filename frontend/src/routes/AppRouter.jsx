import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout.jsx';
import { PublicLayout } from '../components/layout/PublicLayout.jsx';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage.jsx';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage.jsx';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage.jsx';
import { CartPage } from '../pages/customer/CartPage.jsx';
import { CheckoutPage } from '../pages/customer/CheckoutPage.jsx';
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage.jsx';
import { OrdersPage } from '../pages/customer/OrdersPage.jsx';
import { ProductDetailsPage } from '../pages/customer/ProductDetailsPage.jsx';
import { ProductsPage } from '../pages/customer/ProductsPage.jsx';
import { ProfilePage } from '../pages/customer/ProfilePage.jsx';
import { HomePage } from '../pages/public/HomePage.jsx';
import { LoginPage } from '../pages/public/LoginPage.jsx';
import { NotFoundPage } from '../pages/public/NotFoundPage.jsx';
import { RegisterPage } from '../pages/public/RegisterPage.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/admin/login', element: <AdminLoginPage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:id', element: <ProductDetailsPage /> },
      { path: '/cart', element: <CartPage /> }
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['customer']} />,
    children: [
      {
        element: <AppLayout role="customer" />,
        children: [
          { path: '/dashboard', element: <CustomerDashboardPage /> },
          { path: '/checkout', element: <CheckoutPage /> },
          { path: '/orders', element: <OrdersPage /> },
          { path: '/profile', element: <ProfilePage /> }
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        element: <AppLayout role="admin" />,
        children: [
          { path: '/admin/dashboard', element: <AdminDashboardPage /> },
          { path: '/admin/products', element: <AdminProductsPage /> }
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
