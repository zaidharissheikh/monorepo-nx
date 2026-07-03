import { useState, useEffect, useRef, useMemo } from 'react';
import { ProductCard, Button, Skeleton } from '@ecommerce/ui';
import { ArrowRight, Zap, TrendingUp, Clock, Star, ChevronRight, Sparkles, Gift, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const heroSlides = [
    {
      id: 1,
      image: 'https://plus.unsplash.com/premium_photo-1684785617500-fb22234eeedd?q=80&w=1170&auto=format&fit=crop',
      title: 'Curated Essentials for Your Lifestyle.',
      subtitle: 'Thousands of products across every category. Find exactly what you need.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1170&auto=format&fit=crop',
      title: 'Next-Gen Tech is Here.',
      subtitle: 'Upgrade your life with the latest electronics and gadgets.',
    },
    {
      id: 3,
      image: 'https://www.apparelgroup.com/en/wp-content/uploads/2024/11/top-fall-fashion-finds-for-men-from-hackett-london-img-6.webp',
      title: 'Elevate Your Wardrobe.',
      subtitle: 'Discover premium apparel designed for modern living.',
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Derive category-grouped products for multiple sections
  const categoryGroups = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    products.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [products]);

  const categories = [
    { name: 'Electronics', icon: '💻', color: 'from-blue-500 to-indigo-600' },
    { name: 'Clothing', icon: '👕', color: 'from-pink-500 to-rose-600' },
    { name: 'Shoes', icon: '👟', color: 'from-amber-500 to-orange-600' },
    { name: 'Accessories', icon: '⌚', color: 'from-emerald-500 to-teal-600' },
    { name: 'Home', icon: '🏠', color: 'from-violet-500 to-purple-600' },
  ];

  const bannerDeals = [
    { title: 'Summer Sale', subtitle: 'Up to 60% off on electronics', cta: 'Shop Now', image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=686&auto=format&fit=crop', color: 'from-blue-600 to-indigo-700', category: 'electronics' },
    { title: 'New Arrivals', subtitle: 'Fresh styles just dropped', cta: 'Explore', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=735&auto=format&fit=crop', color: 'from-rose-600 to-pink-700', category: 'clothing' },
    { title: 'Home Essentials', subtitle: 'Transform your living space', cta: 'Browse', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=627&auto=format&fit=crop', color: 'from-emerald-600 to-teal-700', category: 'home' },
  ];

  useGSAP(() => {
    // Hero Animation
    gsap.fromTo('.hero-text',
      { y: 100, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1.5, stagger: 0.3, ease: 'back.out(1.2)', delay: 0.2 }
    );

    // Category pills
    gsap.fromTo('.cat-pill',
      { y: 40, opacity: 0, scale: 0.8 },
      {
        y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.categories-strip', start: 'top 90%' }
      }
    );

    // Banner cards
    gsap.fromTo('.deal-banner',
      { x: -80, opacity: 0, scale: 0.95 },
      {
        x: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.2, ease: 'power4.out',
        scrollTrigger: { trigger: '.deals-section', start: 'top 80%' }
      }
    );

    // Product rows
    document.querySelectorAll('.product-row').forEach(row => {
      gsap.fromTo(row.querySelectorAll('.product-item'),
        { y: 80, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.12, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: row, start: 'top 85%' }
        }
      );
    });

    // Trust bar
    gsap.fromTo('.trust-item',
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.trust-bar', start: 'top 90%' }
      }
    );

    // CTA section
    gsap.fromTo('.cta-content',
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%' }
      }
    );

  }, { scope: mainRef, dependencies: [loading] });

  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl overflow-hidden p-3 border border-gray-100">
      <Skeleton className="aspect-[4/5] w-full rounded-xl" />
      <div className="pt-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );

  return (
    <div ref={mainRef} className="flex flex-col bg-[#f1f3f6] overflow-x-hidden">

      {/* ═══════════ 1. HERO BANNER ═══════════ */}
      <section className="relative h-[70vh] min-h-[500px] w-full flex flex-col justify-end overflow-hidden bg-black">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover opacity-60 transition-transform duration-[6000ms] ease-out ${index === currentSlide ? 'scale-105' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
          </div>
        ))}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-16 md:pb-24">
          <div className="max-w-2xl">
            <div className="overflow-hidden mb-4">
              <h1 className="hero-text text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-white leading-[1.1] min-h-[120px] md:min-h-[160px] flex items-end">
                {heroSlides[currentSlide].title}
              </h1>
            </div>
            <div className="overflow-hidden mb-8">
              <p className="hero-text text-lg md:text-xl text-gray-300 font-light max-w-lg min-h-[60px]">
                {heroSlides[currentSlide].subtitle}
              </p>
            </div>
            <div className="overflow-hidden hero-text flex gap-4 flex-wrap">
              <Link to="/products">
                <button className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-base font-bold bg-white text-[#0f172a] hover:bg-[#c084fc] hover:text-white rounded-full transition-all duration-300 shadow-xl flex items-center">
                  Shop Now <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </Link>
              <Link to="/login">
                <button className="h-12 md:h-14 px-8 md:px-10 text-sm md:text-base font-bold bg-transparent text-white border-2 border-white/40 hover:border-white hover:bg-white/10 rounded-full transition-all duration-300 flex items-center">
                  Sign Up for Deals
                </button>
              </Link>
            </div>

            {/* Carousel Indicators */}
            <div className="flex gap-2 mt-12 hero-text">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/60'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. CATEGORY QUICK-NAV STRIP ═══════════ */}
      <section className="categories-strip bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name.toLowerCase()}`}
                className="cat-pill shrink-0 flex items-center gap-3 px-6 py-3 rounded-full border-2 border-gray-200 bg-white hover:border-[#0f172a] hover:shadow-md transition-all duration-300 group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-bold text-sm text-gray-700 group-hover:text-[#0f172a] whitespace-nowrap">{cat.name}</span>
              </Link>
            ))}
            <Link
              to="/products"
              className="cat-pill shrink-0 flex items-center gap-2 px-6 py-3 rounded-full bg-[#0f172a] text-white font-bold text-sm hover:bg-[#c084fc] transition-colors duration-300"
            >
              All Products <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ 3. PROMOTIONAL DEAL BANNERS ═══════════ */}
      <section className="deals-section py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bannerDeals.map((deal, idx) => (
              <Link
                key={idx}
                to={`/products?category=${deal.category}`}
                className={`deal-banner relative overflow-hidden rounded-2xl h-48 md:h-52 bg-gradient-to-br ${deal.color} group`}
              >
                <img src={deal.image} alt={deal.title} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" />
                <div className="relative z-10 p-6 md:p-8 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-1">{deal.title}</h3>
                    <p className="text-white/80 text-sm md:text-base font-light">{deal.subtitle}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-white font-bold text-sm bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit group-hover:bg-white/30 transition-colors">
                    {deal.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 4. TRENDING NOW ═══════════ */}
      <section className="products-section py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">Trending Now</h2>
                <p className="text-sm text-gray-500 font-light">Most popular picks this week</p>
              </div>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-1 text-[#0f172a] font-bold text-sm hover:text-[#c084fc] transition-colors">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="product-row grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.slice(0, 5).map(product => (
                <div key={product._id} className="product-item">
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
          )}
        </div>
      </section>

      {/* ═══════════ 5. TRUST / VALUE PROPS BAR ═══════════ */}
      <section className="trust-bar py-8 bg-[#f8fafc] border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: <ShieldCheck className="w-6 h-6" />, title: 'Secure Payment', desc: '100% protected' },
              { icon: <Gift className="w-6 h-6" />, title: 'Daily Deals', desc: 'New offers every day' },
              { icon: <Sparkles className="w-6 h-6" />, title: 'Premium Quality', desc: 'Curated products only' },
            ].map((item, i) => (
              <div key={i} className="trust-item flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-[#0f172a] text-white flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-[#0f172a] text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 6. PRODUCTS BY CATEGORY ═══════════ */}
      {Object.entries(categoryGroups).map(([categoryName, categoryProducts]) => (
        <section key={categoryName} className="py-8 md:py-12 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight capitalize">{categoryName}</h2>
                  <p className="text-sm text-gray-500 font-light">Explore top picks in {categoryName.toLowerCase()}</p>
                </div>
              </div>
              <Link to={`/products?category=${categoryName.toLowerCase()}`} className="hidden md:flex items-center gap-1 text-[#0f172a] font-bold text-sm hover:text-[#c084fc] transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="product-row grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categoryProducts.slice(0, 5).map(product => (
                <div key={product._id} className="product-item">
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

            {/* Mobile "View all" link */}
            <div className="md:hidden mt-6 text-center">
              <Link to={`/products?category=${categoryName.toLowerCase()}`} className="inline-flex items-center gap-1 text-[#0f172a] font-bold text-sm hover:text-[#c084fc] transition-colors">
                View all in {categoryName} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════ 7. RECENTLY VIEWED / ALL PRODUCTS ═══════════ */}
      {!loading && products.length > 5 && (
        <section className="py-8 md:py-12 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] tracking-tight">More to Explore</h2>
                  <p className="text-sm text-gray-500 font-light">Discover even more products</p>
                </div>
              </div>
              <Link to="/products" className="hidden md:flex items-center gap-1 text-[#0f172a] font-bold text-sm hover:text-[#c084fc] transition-colors">
                Browse all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="product-row grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.slice(5, 15).map(product => (
                <div key={product._id} className="product-item">
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
          </div>
        </section>
      )}

      {/* ═══════════ 8. CTA / SIGN UP BANNER ═══════════ */}
      <section className="cta-section relative py-20 md:py-28 bg-[#0f172a] text-center px-6">
        <div className="cta-content relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Don't miss out on deals
          </h2>
          <p className="text-lg text-gray-400 font-light mb-8">
            Create an account to get personalised recommendations and exclusive discounts.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/login">
              <button className="h-14 px-10 text-base font-bold bg-[#c084fc] text-white hover:bg-white hover:text-[#0f172a] rounded-full transition-colors duration-300 shadow-lg">
                Create Free Account
              </button>
            </Link>
            <Link to="/products">
              <button className="h-14 px-10 text-base font-bold bg-transparent text-white border-2 border-white/30 hover:border-white rounded-full transition-colors duration-300">
                Continue Browsing
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
