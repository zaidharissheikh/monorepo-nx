import { Link } from 'react-router-dom';
import { Button } from '@ecommerce/ui';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-28 h-28 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-14 h-14 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Payment Failed</h1>
        <p className="text-gray-500 mb-8">
          Something went wrong while processing your payment. Don't worry — no money has been charged.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start gap-4 text-left">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">What can you do?</h3>
              <ul className="text-sm text-gray-500 leading-relaxed space-y-1">
                <li>• Check your card/wallet details and try again</li>
                <li>• Use a different payment method</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/profile">
            <Button size="lg" className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              View My Orders
            </Button>
          </Link>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
