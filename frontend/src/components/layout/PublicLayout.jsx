import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { useSelector } from 'react-redux';

export function PublicLayout() {

  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <div className="md:flex">
        {isAuthenticated && <Sidebar role={role} />}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
