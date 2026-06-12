import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
