import { useState, useEffect } from 'react';
import { Input, Badge, Button } from '@ecommerce/ui';
import { Search, Eye } from 'lucide-react';

interface Order {
  _id: string;
  user: { name: string; email: string } | null;
  orderItems: any[];
  totalPrice: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const statusColors: Record<string, 'gray' | 'yellow' | 'blue' | 'green' | 'red'> = {
  Pending: 'gray',
  Processing: 'yellow',
  Shipped: 'blue',
  Delivered: 'green',
  Cancelled: 'red',
};

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminInfo.token}`,
  };

  const fetchOrders = () => {
    setLoading(true);
    fetch(`${API_URL}/orders`, { headers })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search orders..."
            icon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-semibold">Order ID</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Payment</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3].map(i => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-14 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                </tr>
              ))
            ) : (() => {
              const term = searchTerm.toLowerCase();
              const filtered = orders.filter(order =>
                order._id.toLowerCase().includes(term) ||
                (order.user?.name || '').toLowerCase().includes(term) ||
                (order.user?.email || '').toLowerCase().includes(term) ||
                order.status.toLowerCase().includes(term)
              );
              return filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No orders found</td></tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-gray-900 font-mono text-xs">
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">{order.user?.name || 'Deleted User'}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">${order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <Badge color={order.isPaid ? 'green' : 'red'}>{order.isPaid ? 'Paid' : 'Unpaid'}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={statusColors[order.status] || 'gray'}>{order.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {statusOptions.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              );
            })()}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <span>Showing {orders.filter(o => { const t = searchTerm.toLowerCase(); return o._id.toLowerCase().includes(t) || (o.user?.name || '').toLowerCase().includes(t) || (o.user?.email || '').toLowerCase().includes(t) || o.status.toLowerCase().includes(t); }).length} of {orders.length} orders</span>
      </div>
    </div>
  );
};

export default Orders;
