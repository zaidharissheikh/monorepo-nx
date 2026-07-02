// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Users from '../pages/Users';
import Orders from '../pages/Orders';
import Login from '../pages/Login';
import { NotificationProvider } from '../context/NotificationContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const adminInfo = localStorage.getItem('adminInfo');
  if (!adminInfo) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </NotificationProvider>
  );
}

export default App;

