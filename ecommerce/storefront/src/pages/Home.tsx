import { useState, useEffect } from 'react';
import { ProductCard, Button, Skeleton } from '@ecommerce/ui';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const API_URL = 'http://localhost:3000';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600' },
    { name: 'Clothing', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e08?auto=format&fit=crop&q=80&w=600' },
    { name: 'Home', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" alt="Hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-48">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-2xl">
            Discover Your Next <span className="text-primary">Favorite Thing.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
            Shop the latest trends in electronics, fashion, and home goods with our curated collection of premium products.
          </p>
          <div className="flex gap-4">
            <Link to="/products">
              <Button size="lg" className="h-14 px-8 text-lg font-bold">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-500">On all orders over $100</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-500">100% secure checkout</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">30-Day Returns</h3>
              <p className="text-gray-500">No questions asked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-10">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(cat => (
              <Link to={`/products?category=${cat.name.toLowerCase()}`} key={cat.name} className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer">
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                  <span className="text-white/80 font-medium group-hover:text-primary transition-colors flex items-center">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products — from DB */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Trending Now</h2>
              <p className="text-gray-500">Our most popular products this week.</p>
            </div>
            <Link to="/products" className="hidden sm:flex text-primary font-bold hover:text-blue-700 items-center transition-colors">
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
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
            <div className="text-center py-20 text-gray-500">
              No products found. Make sure the API is running and the database is seeded.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map(product => (
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
          )}

          <Link to="/products" className="sm:hidden mt-8 flex justify-center w-full">
            <Button variant="secondary" fullWidth>View All Products</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
