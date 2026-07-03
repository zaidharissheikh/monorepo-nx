import { useState, useEffect, useRef } from 'react';
import { Breadcrumb, Button, EmptyState, Modal, Input } from '@ecommerce/ui';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getCart = (): CartItem[] => {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  } catch { return []; }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getCart());
  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const navigate = useNavigate();
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  useGSAP(() => {
    if (cartItems.length > 0) {
      gsap.fromTo('.cart-item-anim', 
        { y: 100, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: 'back.out(1.2)' }
      );
      gsap.fromTo('.summary-anim', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.4 }
      );
    }
  }, { scope: containerRef });

  const breadcrumbs = [
    { label: 'Shop', href: '/products' },
    { label: 'Your Bag' }
  ];

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const removeItem = (id: string) => {
    // Animate out before removing
    gsap.to(`#cart-item-${id}`, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCartItems(items => items.filter(item => item.id !== id));
      }
    });
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <EmptyState 
          icon={<ShoppingBag className="w-16 h-16 text-[#c084fc]" />}
          title="Your bag is empty"
          description="Looks like you haven't added anything to your bag yet. Discover our premium collection."
          action={<Link to="/products"><Button className="bg-[#0f172a] text-white hover:bg-gray-800 rounded-full h-12 px-8 font-bold">Explore Collection</Button></Link>}
        />
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-10">
          <Breadcrumb items={breadcrumbs} />
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0f172a] mb-12 tracking-tighter">Your Bag</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              <div id={`cart-item-${item.id}`} key={item.id} className="cart-item-anim flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                <img src={item.image} alt={item.name} className="w-full sm:w-32 h-32 object-contain bg-[#f8fafc] rounded-2xl p-2" />
                <div className="flex-1 text-center sm:text-left w-full">
                  <Link to={`/product/${item.id}`} className="font-bold text-xl text-[#0f172a] hover:text-[#c084fc] transition-colors">
                    {item.name}
                  </Link>
                  <div className="text-gray-500 font-medium mt-2">${item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center border-2 border-gray-100 rounded-full bg-gray-50 h-12 w-32">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 text-gray-500 hover:text-[#0f172a] transition-colors text-lg">-</button>
                    <span className="flex-1 text-center font-bold text-[#0f172a]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 text-gray-500 hover:text-[#0f172a] transition-colors text-lg">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0 summary-anim">
            <div className="bg-[#0f172a] text-white p-10 rounded-[2.5rem] shadow-xl sticky top-32">
              <h3 className="text-2xl font-bold mb-8 tracking-tight">Order Summary</h3>
              
              <div className="space-y-4 text-gray-300 font-light mb-8">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((a, i) => a + i.quantity, 0)} items)</span>
                  <span className="font-medium text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-medium text-white">${shipping.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-6 mb-10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-lg text-gray-300 font-medium">Total</span>
                  <span className="text-4xl font-extrabold text-[#c084fc] tracking-tighter">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 text-right">Including VAT</p>
              </div>
              
              <Button size="lg" fullWidth style={{ color: '#0f172a' }} className="h-14 rounded-full bg-white hover:bg-gray-200 font-bold text-lg transition-transform hover:scale-105" onClick={() => setShowCheckout(true)}>
                Secure Checkout <ShieldCheck className="w-5 h-5 ml-2 text-[#c084fc]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal isOpen={showCheckout} onClose={() => setShowCheckout(false)} title="Shipping Address">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">Street Address</label>
            <Input value={address.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress({...address, address: e.target.value})} placeholder="123 Luxury Ave" className="h-12 rounded-xl focus:border-[#c084fc] focus:ring-[#c084fc] bg-gray-50" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">City</label>
              <Input value={address.city} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress({...address, city: e.target.value})} placeholder="Metropolis" className="h-12 rounded-xl focus:border-[#c084fc] focus:ring-[#c084fc] bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0f172a] mb-2">Postal Code</label>
              <Input value={address.postalCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress({...address, postalCode: e.target.value})} placeholder="10001" className="h-12 rounded-xl focus:border-[#c084fc] focus:ring-[#c084fc] bg-gray-50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0f172a] mb-2">Country</label>
            <Input value={address.country} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress({...address, country: e.target.value})} placeholder="Country" className="h-12 rounded-xl focus:border-[#c084fc] focus:ring-[#c084fc] bg-gray-50" />
          </div>
          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-[#0f172a]">Amount to Pay</span>
              <span className="text-2xl font-extrabold text-[#c084fc] tracking-tighter">${total.toFixed(2)}</span>
            </div>
            <Button size="lg" fullWidth onClick={handleCheckout} disabled={placing || !address.address || !address.city || !address.postalCode || !address.country} className="h-14 rounded-full bg-[#0f172a] text-white hover:bg-gray-800 font-bold text-lg transition-transform hover:scale-105">
              {placing ? 'Processing Securely...' : 'Proceed to Payment'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Cart;
