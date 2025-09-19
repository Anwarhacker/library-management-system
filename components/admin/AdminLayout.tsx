import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, NavLink } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <div>
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">
                View Public Site
              </Link>
              <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                  Logout
              </button>
            </div>
        </div>
        <nav className="flex items-center gap-2 md:gap-4 mb-6">
            <NavLink to="/admin" end className={navLinkClasses}>Dashboard</NavLink>
            <NavLink to="/admin/add" className={navLinkClasses}>Add Book</NavLink>
        </nav>
        <Outlet />
    </div>
  );
};

export default AdminLayout;