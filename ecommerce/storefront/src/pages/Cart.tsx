import { useState, useEffect } from 'react';
import { Breadcrumb, Button, EmptyState, Modal, Input } from '@ecommerce/ui';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper to read/write cart from localStorage
const getCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch { return []; }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items));
  // Dispatch a storage event so Navbar can react
  window.dispatchEvent(new Event('cart-updated'));
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getCart());
  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const navigate = useNavigate();

  // Sync to localStorage on every change
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const breadcrumbs = [
    { label: 'Shop', href: '/products' },
    { label: 'Shopping Cart' }
  ];

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15.00 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.token) {
      navigate('/login');
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems.map(item => ({
            product: item.id,
            name: item.name,
            qty: item.quantity,
            price: item.price,
            image: item.image,
          })),
          shippingAddress: address,
          totalPrice: total,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        // Clear cart and redirect to mock payment page
        setCartItems([]);
        saveCart([]);
        setShowCheckout(false);
        navigate(`/payment/${order._id}`);
      }
    } catch (err) {
      console.error(err);
    }
    setPlacing(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <EmptyState 
          icon={<ShoppingBag className="w-12 h-12 text-primary" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          action={<Link to="/products"><Button>Continue Shopping</Button></Link>}
        />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex-1">
                  <Link to={`/product/${item.id}`} className="font-semibold text-lg text-gray-900 hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <div className="text-primary font-bold mt-1">${item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-10 w-28 shrink-0">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 text-gray-600 hover:text-primary">-</button>
                  <span className="flex-1 text-center font-medium text-sm text-gray-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 text-gray-600 hover:text-primary">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping estimate</span>
                  <span className="font-medium text-gray-900">${shipping.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-primary">${total.toFixed(2)}</span>
              </div>
              <Button size="lg" fullWidth className="h-12" onClick={() => setShowCheckout(true)}>
                Checkout <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal isOpen={showCheckout} onClose={() => setShowCheckout(false)} title="Shipping Address">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input value={address.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress({...address, address: e.target.value})} placeholder="123 Main St" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <Input value={address.city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress({...address, city: e.target.value})} placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <Input value={address.postalCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress({...address, postalCode: e.target.value})} placeholder="12345" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <Input value={address.country} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress({...address, country: e.target.value})} placeholder="Country" />
          </div>
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="flex justify-between mb-4 text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
            <Button size="lg" fullWidth onClick={handleCheckout} disabled={placing || !address.address || !address.city || !address.postalCode || !address.country}>
              {placing ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Cart;
