import { useState, useEffect } from 'react';
import { Input, Badge, Button } from '@ecommerce/ui';
import { Search, Trash2 } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const API_URL = 'http://localhost:3000';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminInfo.token}`,
  };

  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_URL}/users`, { headers })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers,
    });
    fetchUsers();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search users..."
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
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1,2,3].map(i => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                </tr>
              ))
            ) : (() => {
              const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
              );
              return filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{user.name}</span>
                        <span className="text-gray-400 text-xs">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={user.role === 'admin' ? 'purple' : 'gray'}>{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(user._id)} className="text-gray-400 hover:text-red-600 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              );
            })()}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <span>Showing {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).length} of {users.length} users</span>
      </div>
    </div>
  );
};

export default Users;
