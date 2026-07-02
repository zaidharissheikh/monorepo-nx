import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@ecommerce/ui';

const AdminLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
          setIsLoading(false);
          return;
        }
        localStorage.setItem('adminInfo', JSON.stringify(result));
        window.dispatchEvent(new Event('auth-updated'));
        navigate('/');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ADMIN<span className="text-primary">PANEL</span>
          </h2>
        </div>
        <AuthForm 
          type="login" 
          onSubmit={handleLogin} 
          isLoading={isLoading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default AdminLogin;
