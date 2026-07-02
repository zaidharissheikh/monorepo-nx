import { useState, useEffect } from 'react';
import { Badge, Button } from '@ecommerce/ui';
import { User, Package, Settings, LogOut, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  if (!userInfo.name) {
    return <div className="p-20 text-center text-gray-500">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <aside className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 text-center border-b border-gray-100 bg-gray-50/50">
              <div className="w-24 h-24 mx-auto bg-blue-100 text-primary flex items-center justify-center rounded-full text-4xl font-bold mb-4 shadow-inner">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{userInfo.name}</h2>
              <p className="text-sm text-gray-500">{userInfo.email}</p>
              <div className="mt-2">
                <Badge color="blue">Customer</Badge>
              </div>
            </div>
            <div className="p-4 space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-primary bg-blue-50 rounded-xl transition-colors">
                <User className="w-5 h-5" /> Account Details
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-xl transition-colors">
                <Settings className="w-5 h-5" /> Settings
              </button>
              <button 
                onClick={() => { localStorage.removeItem('userInfo'); window.dispatchEvent(new Event('auth-updated')); window.location.href = '/login'; }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Profile Content */}
        <div className="flex-1 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" /> Order History
            </h3>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="space-y-4 w-full">
                    {[1, 2].map(i => (
                      <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 animate-pulse">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-5 w-24 bg-gray-200 rounded"></div>
                          <div className="h-5 w-16 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-4 w-48 bg-gray-100 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No orders yet</p>
                  <p className="text-sm mt-1">Your order history will appear here.</p>
                </div>
              ) : (
                orders.map(order => {
                  const itemCount = order.orderItems.reduce((sum, item) => sum + item.qty, 0);
                  return (
                    <div key={order._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors bg-gray-50/50">
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
                          <Badge color={statusColor(order.status)}>{order.status}</Badge>
                          {order.isPaid ? (
                            <Badge color="green">Paid</Badge>
                          ) : (
                            <Badge color="red">Unpaid</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Ordered on {new Date(order.createdAt).toLocaleDateString()} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          {order.paymentMethod && <span> • {order.paymentMethod}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900">${order.totalPrice.toFixed(2)}</span>
                        {!order.isPaid && (
                          <Link to={`/payment/${order._id}`}>
                            <Button size="sm">
                              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
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
