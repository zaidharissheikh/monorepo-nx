import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm, Button } from '@ecommerce/ui';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.auth-content', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
    gsap.from('.auth-image', {
      x: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      delay: 0.2
    });
  }, { scope: containerRef });

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
    <div ref={containerRef} className="min-h-[calc(100vh-80px)] flex bg-[#f8fafc]">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 auth-content relative z-10">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-[#0f172a] tracking-tight mb-2">
              {isLogin ? 'Welcome Back' : 'Join the Elite'}
            </h2>
            <p className="text-lg text-gray-500 font-light">
              {isLogin ? 'Sign in to access your curated collection.' : 'Create an account to elevate your lifestyle.'}
            </p>
          </div>

          <AuthForm
            type={isLogin ? 'login' : 'register'}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mb-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsLogin(!isLogin)}
              className="rounded-full px-8 text-[#0f172a] bg-white border-gray-200 hover:bg-gray-50"
            >
              {isLogin ? 'Create an account' : 'Sign in to your account'}
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Image Side */}
      <div className="hidden lg:flex flex-1 relative auth-image">
        {/* <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#f8fafc] z-10"></div> */}
        <img
          src="https://images.unsplash.com/photo-1486520299386-6d106b22014b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Premium Lifestyle"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-20 left-12 z-20 text-white max-w-md">
          <h3 className="text-4xl font-extrabold mb-4 drop-shadow-lg tracking-tight">Elegance in every detail.</h3>
          <p className="text-lg text-white/90 drop-shadow-md font-light">Join thousands of others who have elevated their daily routine with our premium selections.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
