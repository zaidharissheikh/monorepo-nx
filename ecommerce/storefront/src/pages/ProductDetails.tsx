import { useState, useEffect, useRef } from 'react';
import { Breadcrumb, Button, Skeleton } from '@ecommerce/ui';
import { ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  stock: number;
  ingredients?: string;
  howToUse?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('description');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useGSAP(() => {
    if (!loading && product) {
      gsap.fromTo('.prod-image',
        { x: -100, opacity: 0, scale: 0.8 },
        { x: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power4.out' }
      );
      gsap.fromTo('.prod-info > *',
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'back.out(1.2)', delay: 0.3 }
      );
    }
  }, { dependencies: [loading, product], scope: containerRef });

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

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  if (loading) {
    return (
      <div className="max-w-[1680px] mx-auto px-6 lg:px-12 py-16">
        <Skeleton className="h-5 w-64 mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-6 pt-10">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-32 text-[#0f172a] text-2xl font-light">Product not found.</div>;
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: product.category, href: `/products?category=${product.category.toLowerCase()}` },
    { label: product.name }
  ];

  const inStock = product.stock > 0;

  return (
    <div ref={containerRef} className="bg-white min-h-screen">
      <div className="max-w-[1680px] mx-auto px-6 lg:px-12 py-12">
        <div className="mb-8">
          <Breadcrumb items={breadcrumbs} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Image - Editorial style (large, no borders) */}
          <div className="lg:col-span-7 prod-image">
            <div className="bg-white border border-gray-100 w-full h-full min-h-[500px] flex items-center justify-center rounded-2xl overflow-hidden p-12">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Product Info - Minimalist */}
          <div className="lg:col-span-5 prod-info pt-4 lg:pt-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-4 tracking-tighter leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-8">
              <div className="flex text-[#0f172a]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-gray-500 text-sm font-medium border-b border-gray-300 ml-2 pb-0.5 cursor-pointer hover:text-[#0f172a] hover:border-[#0f172a] transition-colors">
                Read Reviews
              </span>
            </div>

            <div className="text-2xl font-semibold text-[#0f172a] mb-10 tracking-tight">
              ${product.price.toFixed(2)}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-full h-14 w-32">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 text-gray-500 hover:text-[#0f172a] transition-colors">-</button>
                  <span className="flex-1 text-center font-bold text-[#0f172a]">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-5 text-gray-500 hover:text-[#0f172a] transition-colors">+</button>
                </div>
                <div className="flex-1">
                  <Button
                    size="lg"
                    className={`w-full h-14 rounded-full text-base font-bold tracking-widest uppercase transition-all ${isAdded
                        ? 'bg-green-600 text-white hover:bg-green-700 border-none'
                        : 'bg-[#0f172a] text-white hover:bg-[#c084fc] hover:border-[#c084fc] border border-[#0f172a]'
                      }`}
                    onClick={handleAddToCart}
                    disabled={!inStock}
                  >
                    {isAdded ? 'Added to Bag' : 'Add to Bag'}
                  </Button>
                </div>
              </div>

              {!inStock && <p className="text-red-500 text-sm mt-2 font-medium">Currently out of stock.</p>}
              <p className="text-sm text-gray-500 flex items-center justify-center lg:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                Ships worldwide. Free shipping over $100.
              </p>
            </div>

            {/* Accordions */}
            <div className="border-t border-gray-200">
              {/* Description */}
              <div className="border-b border-gray-200">
                <button
                  className="w-full py-6 flex justify-between items-center text-left text-lg font-bold text-[#0f172a] tracking-tight"
                  onClick={() => toggleAccordion('description')}
                >
                  The Science
                  {activeAccordion === 'description' ? <Minus className="w-5 h-5 text-gray-400" /> : <Plus className="w-5 h-5 text-gray-400" />}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === 'description' ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                  <p className="text-gray-600 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
