import { Outlet } from 'react-router-dom';
import { Sidebar } from '@ecommerce/ui';
import NotificationBell from '../components/NotificationBell';

export const AdminLayout = () => {
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <span className="text-sm text-gray-500">
              Welcome, <span className="font-medium text-gray-700">{adminInfo.name || 'Admin'}</span>
            </span>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

