import { useState, useEffect, useRef } from 'react';
import { Breadcrumb, ProductCard, Pagination, Input, Skeleton } from '@ecommerce/ui';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProductsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  
  const containerRef = useRef<HTMLDivElement>(null);

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

  useGSAP(() => {
    if (!loading) {
      gsap.fromTo('.product-card-anim', 
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, ease: 'back.out(1.2)' }
      );
    }
  }, { dependencies: [loading, currentPage], scope: containerRef });

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'Collection' }
  ];

  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      {/* Header Area */}
      <div className="bg-[#f8fafc] py-16 px-6 lg:px-12 border-b border-gray-100">
        <div className="max-w-[1680px] mx-auto">
          <div className="mb-8">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-[#0f172a] tracking-tighter mb-4">The Collection</h1>
              <p className="text-gray-500 font-light text-xl max-w-2xl">
                Explore our full range of scientifically engineered products designed for ultimate performance and elegance.
              </p>
            </div>
            <div className="w-full md:w-80">
              <Input
                placeholder="Search the collection..."
                icon={<Search className="w-5 h-5 text-gray-400" />}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="rounded-full border-gray-300 focus:border-[#c084fc] focus:ring-[#c084fc] bg-white h-14 px-6 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 lg:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Filters Sidebar - Minimalist List */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-32">
              <h3 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-8">Categories</h3>
              <div className="space-y-4">
                {['All', 'Electronics', 'Clothing', 'Shoes', 'Accessories', 'Home'].map(cat => {
                  const isActive = cat === 'All' 
                    ? !searchParams.get('category')
                    : searchParams.get('category')?.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat.toLowerCase() })}
                      className={`block w-full text-left text-lg font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-[#0f172a] ml-2 border-l-2 border-[#0f172a] pl-4'
                          : 'text-gray-400 hover:text-[#0f172a] hover:ml-2'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-[#f8fafc] rounded-2xl overflow-hidden p-4">
                    <Skeleton className="aspect-[4/5] w-full rounded-xl" />
                    <div className="pt-6 space-y-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-32 text-gray-400 text-xl font-light">
                No pieces match your current selection.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                  {paginatedProducts.map((product) => (
                    <div key={product._id} className="product-card-anim">
                      <ProductCard
                        id={product._id}
                        name={product.name}
                        price={product.price}
                        imageUrl={product.imageUrl}
                        category={product.category}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-24 pt-12 border-t border-gray-100 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
