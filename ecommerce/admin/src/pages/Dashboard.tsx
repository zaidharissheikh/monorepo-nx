import { useState, useEffect } from 'react';
import { Users, DollarSign, Package, ShoppingCart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    fetch(`${API_URL}/admin/stats`, {
      headers: {
        Authorization: `Bearer ${adminInfo.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign },
    { title: 'Orders', value: String(stats.totalOrders), icon: ShoppingCart },
    { title: 'Active Users', value: String(stats.totalUsers), icon: Users },
    { title: 'Products', value: String(stats.totalProducts), icon: Package },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-gray-200"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : stats.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400">No recent activity</p>
            ) : (
              stats.recentOrders.map((order: any, i: number) => (
                <div key={order._id || i} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary ring-4 ring-blue-50"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New order ${order.totalPrice?.toFixed(2)} from {order.user?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} — {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
