import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navbar, Footer } from '@ecommerce/ui';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ProductsList from '../pages/ProductsList';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Profile from '../pages/Profile';
import MockPayment from '../pages/MockPayment';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFailed from '../pages/PaymentFailed';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationBell from '../components/NotificationBell';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userInfo'));

  useEffect(() => {
    const handleAuthChange = () => setIsLoggedIn(!!localStorage.getItem('userInfo'));
    window.addEventListener('auth-updated', handleAuthChange);
    return () => window.removeEventListener('auth-updated', handleAuthChange);
  }, []);

  return (
    <NotificationProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        <Navbar notificationSlot={isLoggedIn ? <NotificationBell /> : undefined} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment/:orderId" element={<MockPayment />} />
            <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </NotificationProvider>
  );
}

export default App;

