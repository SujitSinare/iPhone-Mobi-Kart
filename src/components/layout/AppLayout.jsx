import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';

export function AppLayout({ role = 'customer' }) {
  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <div className="md:flex">
        <Sidebar role={role} />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
