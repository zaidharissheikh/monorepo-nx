import { useState, useEffect } from 'react';
import { Breadcrumb, Button, Skeleton } from '@ecommerce/ui';
import { ShoppingCart, Star, Heart, Check, ShieldCheck, Truck } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  stock: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.imageUrl,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-5 w-64 mb-8" />
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full" />
            <div className="p-12 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-gray-500">Product not found.</div>;
  }

  const breadcrumbs = [
    { label: 'Shop', href: '/products' },
    { label: product.category, href: `/products?category=${product.category.toLowerCase()}` },
    { label: product.name }
  ];

  const inStock = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={breadcrumbs} />

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Image */}
          <div className="p-8 lg:border-r border-gray-100 flex flex-col items-center justify-center bg-gray-50/50">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full max-w-md h-auto object-contain drop-shadow-xl rounded-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Product Info */}
          <div className="p-8 lg:p-12">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-gray-600 text-sm ml-2 font-medium">4.0</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-full">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            <div className="text-3xl font-bold text-gray-900 mb-6">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  <Check className="w-4 h-4" />
                </div>
                {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                  <Truck className="w-4 h-4" />
                </div>
                Free express delivery worldwide
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                2-Year comprehensive warranty
              </div>
            </div>

            <hr className="border-gray-100 mb-8" />

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-12 w-32">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-gray-600 hover:text-primary transition-colors">-</button>
                <span className="flex-1 text-center font-semibold text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-gray-600 hover:text-primary transition-colors">+</button>
              </div>
              <Button
                size="lg"
                className="flex-1 h-12"
                onClick={handleAddToCart}
                disabled={!inStock}
              >
                {isAdded ? (
                  <><Check className="w-5 h-5 mr-2" /> Added to Cart</>
                ) : (
                  <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
