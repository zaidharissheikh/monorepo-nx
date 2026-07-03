import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';

interface NavbarProps {
  notificationSlot?: ReactNode;
}

const Navbar = ({ notificationSlot }: NavbarProps) => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    } catch { setCartCount(0); }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    return () => window.removeEventListener('cart-updated', updateCartCount);
  }, [location]);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-tighter text-gray-900">
              STORE<span className="text-primary">FRONT</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link to="/" className="text-base font-medium text-gray-600 hover:text-primary transition-colors duration-200">
              Home
            </Link>
            <Link to="/products" className="text-base font-medium text-gray-600 hover:text-primary transition-colors duration-200">
              Products
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">

            {/* Auth State */}
            {localStorage.getItem('userInfo') ? (
              <Link to="/profile" className="flex items-center space-x-2 cursor-pointer group">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                  {JSON.parse(localStorage.getItem('userInfo') || '{}').name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {JSON.parse(localStorage.getItem('userInfo') || '{}').name}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="text-sm font-medium text-primary hover:text-blue-700 transition-colors">
                Login
              </Link>
            )}

            {/* Notification Slot */}
            {notificationSlot}

            <Link to="/cart" className="text-gray-500 hover:text-primary transition-colors duration-200 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            {/* Mobile menu button */}
            <button className="md:hidden text-gray-500 hover:text-primary transition-colors duration-200">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

