import { useState, useEffect, useRef } from 'react';
import { Badge, Button } from '@ecommerce/ui';
import { User, Package, Settings, LogOut, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
  isPaid: boolean;
  paidAt?: string;
  paymentMethod?: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const statusColor = (status: string): 'gray' | 'yellow' | 'blue' | 'green' | 'red' => {
  const map: Record<string, 'gray' | 'yellow' | 'blue' | 'green' | 'red'> = {
    Pending: 'gray',
    Processing: 'yellow',
    Shipped: 'blue',
    Delivered: 'green',
    Cancelled: 'red',
  };
  return map[status] || 'gray';
};

const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userInfo.token) return;
    fetch(`${API_URL}/orders/myorders`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useGSAP(() => {
    if (userInfo.name) {
      gsap.fromTo('.profile-sidebar', 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.2)' }
      );
      gsap.fromTo('.profile-content', 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.2)', delay: 0.2 }
      );
    }
  }, { scope: containerRef });

  if (!userInfo.name) {
    return <div className="py-32 text-center text-gray-400 text-xl font-light">Please log in to view your profile.</div>;
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 lg:px-8 py-16 bg-[#f8fafc] min-h-[calc(100vh-80px)]">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Profile Sidebar */}
        <aside className="profile-sidebar w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-32">
            <div className="p-8 text-left border-b border-gray-100 bg-[#0f172a] text-white">
              <h2 className="text-2xl font-extrabold mb-1 tracking-tight">{userInfo.name}</h2>
              <p className="text-sm text-gray-400 font-light mb-4">{userInfo.email}</p>
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-xs font-bold tracking-widest uppercase">
                Premium Member
              </div>
            </div>
            <div className="p-6 space-y-2">
              <button className="w-full flex items-center gap-4 px-6 py-4 text-base font-bold text-[#c084fc] bg-purple-50/50 rounded-2xl transition-colors">
                <User className="w-5 h-5" /> Account Details
              </button>
              <button className="w-full flex items-center gap-4 px-6 py-4 text-base font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#0f172a] rounded-2xl transition-colors">
                <Settings className="w-5 h-5" /> Settings
              </button>
              <button 
                onClick={() => { localStorage.removeItem('userInfo'); window.dispatchEvent(new Event('auth-updated')); window.location.href = '/login'; }}
                className="w-full flex items-center gap-4 px-6 py-4 text-base font-semibold text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Profile Content */}
        <div className="profile-content flex-1">
          <div className="bg-white p-10 lg:p-14 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-8">
              <Package className="w-8 h-8 text-[#c084fc]" />
              <h3 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Order History</h3>
            </div>
            
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-6 w-full">
                  {[1, 2].map(i => (
                    <div key={i} className="p-8 border border-gray-100 rounded-3xl bg-gray-50 animate-pulse">
                      <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 w-64 bg-gray-200 rounded mb-6"></div>
                      <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Package className="w-16 h-16 mx-auto mb-6 opacity-30" />
                  <p className="text-2xl font-bold text-[#0f172a] mb-2">No orders yet</p>
                  <p className="text-base font-light">Your premium purchases will appear here.</p>
                </div>
              ) : (
                orders.map(order => {
                  const itemCount = order.orderItems.reduce((sum, item) => sum + item.qty, 0);
                  return (
                    <div key={order._id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 border border-gray-100 rounded-[2rem] hover:border-gray-300 hover:shadow-md transition-all bg-white">
                      <div className="mb-6 sm:mb-0">
                        <div className="flex items-center gap-3 flex-wrap mb-3">
                          <span className="font-extrabold text-lg text-[#0f172a]">#{order._id.slice(-8).toUpperCase()}</span>
                          <Badge color={statusColor(order.status)}>{order.status}</Badge>
                          {order.isPaid ? (
                            <Badge color="green">Paid</Badge>
                          ) : (
                            <Badge color="red">Unpaid</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          <span className="mx-2">•</span>
                          {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                          {order.paymentMethod && <><span className="mx-2">•</span>{order.paymentMethod}</>}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-2xl font-bold text-[#0f172a] tracking-tight">${order.totalPrice.toFixed(2)}</span>
                        {!order.isPaid && (
                          <Link to={`/payment/${order._id}`}>
                            <Button className="h-12 px-6 rounded-full bg-[#0f172a] text-white hover:bg-gray-800 font-bold">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pay Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
