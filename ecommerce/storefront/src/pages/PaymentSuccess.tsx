import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@ecommerce/ui';
import { CheckCircle, Package, ArrowRight, PartyPopper } from 'lucide-react';

const PaymentSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50/30 flex items-center justify-center px-4">
      
      {/* Success Card */}
      <div className="max-w-md w-full text-center">
        
        {/* Animated Check Icon */}
        <div className="relative mb-8 inline-block">
          <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mx-auto relative">
            <CheckCircle className="w-14 h-14 text-green-500" style={{ animation: 'scaleIn 0.5s ease-out' }} />
            <div className="absolute inset-0 rounded-full border-4 border-green-200" style={{ animation: 'ping 1s ease-out' }}></div>
          </div>
          {showConfetti && (
            <PartyPopper className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2" style={{ animation: 'bounce 0.6s ease-out' }} />
          )}
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-500 mb-2">Your order has been confirmed and paid.</p>
        
        {orderId && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-mono text-gray-600 mb-8">
            Order ID: <span className="font-bold text-gray-900">#{orderId.slice(-8).toUpperCase()}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start gap-4 text-left">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">What's next?</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your order is now being processed. You can track its status from your profile page under Order History.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/profile">
            <Button size="lg" className="w-full sm:w-auto">
              View My Orders <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes bounce {
          0% { transform: scale(0) rotate(-15deg); }
          50% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(-5deg); }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
