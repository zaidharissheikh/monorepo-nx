import { useState, useEffect } from 'react';
import { Button, Input, Badge, Modal } from '@ecommerce/ui';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

const API_URL = 'http://localhost:3000';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '', category: '', stock: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminInfo.token}`,
  };

  const fetchProducts = () => {
    setLoading(true);
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({ name: '', description: '', price: '', imageUrl: '', category: '', stock: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl,
      category: product.category,
      stock: String(product.stock),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const body = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      imageUrl: form.imageUrl,
      category: form.category,
      stock: Number(form.stock),
    };

    if (editingProduct) {
      await fetch(`${API_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
    }

    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers,
    });
    fetchProducts();
  };

  const getStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'red' as const };
    if (stock <= 10) return { label: 'Low Stock', color: 'yellow' as const };
    return { label: 'In Stock', color: 'green' as const };
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search products..."
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="shrink-0" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold">Product Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto"></div></td>
                  </tr>
                ))
              ) : (() => {
                const filtered = products.filter(product =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  product.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
                return filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No products found</td></tr>
                ) : (
                  filtered.map((product) => {
                    const status = getStatus(product.stock);
                    return (
                      <tr key={product._id} className="bg-white border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4">{product.category}</td>
                        <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                        <td className="px-6 py-4">{product.stock}</td>
                        <td className="px-6 py-4">
                          <Badge color={status.color}>{status.label}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => openEditModal(product)} className="text-gray-400 hover:text-primary transition-colors p-2">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="text-gray-400 hover:text-red-600 transition-colors p-2 ml-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                );
              })()}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Showing {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())).length} of {products.length} products</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <Input value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              rows={3}
              placeholder="Product description"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <Input type="number" value={form.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <Input type="number" value={form.stock} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, stock: e.target.value })} placeholder="0" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <Input value={form.category} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Electronics" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <Input value={form.imageUrl} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingProduct ? 'Save Changes' : 'Create Product'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Products;
