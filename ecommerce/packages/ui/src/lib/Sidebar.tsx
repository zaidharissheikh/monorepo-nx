import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Users, ShoppingCart, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Users', href: '/users', icon: Users },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="flex items-center justify-center h-20 border-b border-gray-100 px-4">
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-gray-900">
          ADMIN<span className="text-primary">PANEL</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-primary' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <item.icon 
                className={`flex-shrink-0 w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} 
              />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="space-y-1">
          <Link to="/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors duration-200">
            <Settings className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400" />
            Settings
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem('adminInfo');
              localStorage.removeItem('userInfo');
              window.location.reload();
            }}
            className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut className="flex-shrink-0 w-5 h-5 mr-3 text-gray-400 group-hover:text-red-600" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
