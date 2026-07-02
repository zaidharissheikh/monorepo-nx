import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm, Button } from '@ecommerce/ui';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(result));
        window.dispatchEvent(new Event('auth-updated'));
        navigate('/');
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm 
        type={isLogin ? 'login' : 'register'} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        error={error} 
      />
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsLogin(!isLogin)} 
          className="mt-2"
        >
          {isLogin ? 'Create an account' : 'Sign in to your account'}
        </Button>
      </div>
    </div>
  );
};

export default Login;
