import { useState, useEffect } from 'react';
import { Breadcrumb, ProductCard, Pagination, Input, Button, Skeleton } from '@ecommerce/ui';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const API_URL = 'http://localhost:3000';

const ProductsList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const url = new URL(`${API_URL}/products`);
    if (category) url.searchParams.set('category', category);
    if (searchTerm) url.searchParams.set('keyword', searchTerm);

    setLoading(true);
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
        setCurrentPage(1);
      })
      .catch(() => setLoading(false));
  }, [searchParams, searchTerm]);

  const breadcrumbs = [
    { label: 'Shop', href: '/products' },
    { label: 'All Products' }
  ];

  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={breadcrumbs} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold text-lg">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              Categories
            </div>

            <div className="space-y-1">
              {['All', 'Electronics', 'Clothing', 'Shoes', 'Accessories', 'Home'].map(cat => {
                const isActive = cat === 'All' 
                  ? !searchParams.get('category')
                  : searchParams.get('category')?.toLowerCase() === cat.toLowerCase();
                return (
                  <a
                    key={cat}
                    href={cat === 'All' ? '/products' : `/products?category=${cat.toLowerCase()}`}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`}
                  >
                    {cat}
                  </a>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search products..."
                icon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No products found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    category={product.category}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
