import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge } from '@ecommerce/ui';
import { CreditCard, Smartphone, Shield, Lock, ChevronRight, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface OrderData {
  _id: string;
  orderItems: { name: string; qty: number; price: number; image: string }[];
  totalPrice: number;
  isPaid: boolean;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

type PaymentMethod = 'card' | 'wallet';

const MockPayment = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [walletForm, setWalletForm] = useState({
    phone: '',
    pin: '',
  });
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    if (!userInfo.token) {
      navigate('/login');
      return;
    }

    // Fetch order details
    fetch(`${API_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    })
      .then(res => res.json())
      .then((orders: OrderData[]) => {
        const found = orders.find((o: OrderData) => o._id === orderId);
        if (found) {
          if (found.isPaid) {
            navigate(`/payment-success/${orderId}`);
            return;
          }
          setOrder(found);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  // Format expiry as MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    setError('');

    // Basic validation
    if (paymentMethod === 'card') {
      const num = cardForm.number.replace(/\s/g, '');
      if (num.length < 16) { setError('Please enter a valid 16-digit card number'); return; }
      if (!cardForm.name.trim()) { setError('Please enter the cardholder name'); return; }
      if (cardForm.expiry.length < 5) { setError('Please enter a valid expiry date (MM/YY)'); return; }
      if (cardForm.cvv.length < 3) { setError('Please enter a valid CVV'); return; }
    } else {
      if (walletForm.phone.length < 10) { setError('Please enter a valid phone number'); return; }
      if (walletForm.pin.length < 4) { setError('Please enter your 4-digit PIN'); return; }
    }

    setProcessing(true);

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : 'Mobile Wallet',
        }),
      });

      if (res.ok) {
        navigate(`/payment-success/${orderId}`);
      } else {
        const data = await res.json();
        setError(data.message || 'Payment failed. Please try again.');
        setProcessing(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  // Processing overlay
  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
            <Lock className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Processing Payment</h2>
          <p className="text-blue-200 text-sm">Please wait while we securely process your payment...</p>
          <div className="flex items-center justify-center gap-2 mt-6 text-blue-300 text-xs">
            <Shield className="w-4 h-4" />
            <span>256-bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" />
            SECURE CHECKOUT
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Complete Your Payment</h1>
          <p className="text-gray-500 mt-2 text-sm">Order #{orderId?.slice(-8).toUpperCase()}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left: Payment Form */}
          <div className="flex-1">
            
            {/* Payment Method Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="grid grid-cols-2">
                <button
                  onClick={() => { setPaymentMethod('card'); setError(''); }}
                  className={`flex items-center justify-center gap-3 py-4 px-6 text-sm font-semibold transition-all duration-200 ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Credit / Debit Card
                </button>
                <button
                  onClick={() => { setPaymentMethod('wallet'); setError(''); }}
                  className={`flex items-center justify-center gap-3 py-4 px-6 text-sm font-semibold transition-all duration-200 ${
                    paymentMethod === 'wallet'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  Mobile Wallet
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Card Details
                </h3>
                
                {/* Card Preview */}
                <div className="relative h-48 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-8 bg-yellow-300/80 rounded-md"></div>
                      <div className="text-right text-xs opacity-80">
                        <div>SANDBOX</div>
                        <div className="font-bold text-sm mt-0.5">MOCK PAY</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xl tracking-[0.2em] font-mono mb-4">
                        {cardForm.number || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[10px] uppercase opacity-60 mb-0.5">Card Holder</div>
                          <div className="text-sm font-medium tracking-wide">
                            {cardForm.name || 'YOUR NAME'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] uppercase opacity-60 mb-0.5">Expires</div>
                          <div className="text-sm font-medium">
                            {cardForm.expiry || 'MM/YY'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="block w-full rounded-xl text-sm transition-all duration-200 pl-4 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white font-mono tracking-wider"
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardForm.name}
                    onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
                    placeholder="JOHN DOE"
                    className="block w-full rounded-xl text-sm transition-all duration-200 pl-4 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white uppercase tracking-wide"
                  />
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="block w-full rounded-xl text-sm transition-all duration-200 pl-4 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                    <input
                      type="password"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      placeholder="•••"
                      maxLength={4}
                      className="block w-full rounded-xl text-sm transition-all duration-200 pl-4 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span><strong>Sandbox Mode:</strong> No real payment will be processed. Enter any test data.</span>
                </div>
              </div>
            )}

            {/* Wallet Form */}
            {paymentMethod === 'wallet' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  Mobile Wallet
                </h3>

                {/* Wallet Preview */}
                <div className="relative h-40 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-2xl p-6 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <Smartphone className="w-8 h-8 opacity-80" />
                      <div className="text-right text-xs opacity-80">
                        <div>SANDBOX</div>
                        <div className="font-bold text-sm mt-0.5">MOCK WALLET</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-mono tracking-wider">
                        {walletForm.phone || '03XX XXXXXXX'}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={walletForm.phone}
                    onChange={(e) => setWalletForm({ ...walletForm, phone: e.target.value.replace(/[^0-9+]/g, '').slice(0, 13) })}
                    placeholder="03001234567"
                    className="block w-full rounded-xl text-sm transition-all duration-200 pl-4 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white font-mono tracking-wider"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Wallet PIN</label>
                  <input
                    type="password"
                    value={walletForm.pin}
                    onChange={(e) => setWalletForm({ ...walletForm, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    placeholder="••••"
                    maxLength={6}
                    className="block w-full rounded-xl text-sm transition-all duration-200 pl-4 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50 focus:bg-white font-mono tracking-widest text-center text-2xl"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span><strong>Sandbox Mode:</strong> No real payment will be processed. Enter any test data.</span>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <div className="mt-6">
              <Button size="lg" fullWidth className="h-14 text-base" onClick={handlePayment}>
                <Lock className="w-4 h-4 mr-2" />
                Pay ${order.totalPrice.toFixed(2)}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-6 mt-6 text-gray-400 text-xs">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>SSL Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                <span>PCI Compliant</span>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 shrink-0">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium">${(order.totalPrice - 15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-gray-900 font-medium">$15.00</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-blue-600">${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Shipping To</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>

              {/* Sandbox Notice */}
              <div className="mt-6 pt-4 border-t border-dashed border-gray-200 text-center">
                <Badge color="yellow">Sandbox Mode</Badge>
                <p className="text-xs text-gray-400 mt-2">This is a test payment — no money will be charged</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPayment;
