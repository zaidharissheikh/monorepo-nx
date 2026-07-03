import { useState, useEffect, useRef } from 'react';
import { ProductCard, Button, Skeleton } from '@ecommerce/ui';
import { ArrowRight, Star } from 'lucide-react';
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

  const categories = [
    { name: 'Electronics', desc: 'Next-gen devices', image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Clothing', desc: 'Elevated essentials', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Home', desc: 'Modern living spaces', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  useGSAP(() => {
    // Hero Animation
    gsap.fromTo('.hero-text',
      { y: 100, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 1.5, stagger: 0.3, ease: 'back.out(1.2)', delay: 0.2 }
    );

    // Editorial Section Animation
    gsap.fromTo('.editorial-content',
      { y: 120, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1, duration: 1.5, stagger: 0.2, ease: 'power4.out',
        scrollTrigger: {
          trigger: '.editorial-section',
          start: 'top 75%',
        }
      }
    );

    // Categories Animation
    gsap.fromTo('.category-card',
      { y: 100, opacity: 0, scale: 0.85 },
      {
        y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.2, ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.categories-section',
          start: 'top 80%',
        }
      }
    );

    // Products Animation
    gsap.fromTo('.product-item',
      { y: 80, opacity: 0, scale: 0.9 },
      {
        y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: '.products-section',
          start: 'top 80%',
        }
      }
    );
  }, { scope: mainRef });

  return (
    <div ref={mainRef} className="flex flex-col bg-[#f8fafc] overflow-x-hidden">
      {/* 1. HERO SECTION - Beauty In STEM inspired (Full height, bottom aligned text) */}
      <section className="relative h-screen w-full flex flex-col justify-end overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img
            src="https://plus.unsplash.com/premium_photo-1684785617500-fb22234eeedd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-70 scale-105"
          />
          {/* Subtle gradient so text pops */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div> */}
        </div>

        <div className="relative z-10 w-full px-6 lg:px-12 pb-20 md:pb-32 flex flex-col items-center text-center">
          <div className="overflow-hidden mb-6">
            <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-[1.1] max-w-5xl">
              Curated Essentials <br className="hidden md:block" /> for Your Lifestyle.
            </h1>
          </div>
          <div className="overflow-hidden mb-10">
            <p className="hero-text text-lg md:text-2xl text-gray-300 font-light max-w-2xl">
              Discover a premium collection of beautifully designed products to elevate your everyday routine.
            </p>
          </div>
          <div className="overflow-hidden hero-text">
            <Link to="/products">
              {/* FIX: Dark button with white text so it's fully visible against any background */}
              <button className="h-14 md:h-16 px-10 md:px-14 text-base md:text-lg font-bold bg-[#0f172a] text-white hover:bg-[#c084fc] border border-[#0f172a] hover:border-[#c084fc] rounded-full transition-all duration-300 shadow-xl flex items-center justify-center">
                Explore Collection <ArrowRight className="ml-3 w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL FEATURE SECTION - Magazine style text/image overlap */}
      <section className="editorial-section relative py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="editorial-content flex-1 text-left">
              <h2 className="text-sm font-bold tracking-[0.2em] text-[#c084fc] uppercase mb-4">The Philosophy</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight mb-8">
                Where innovation meets absolute elegance.
              </h3>
              <p className="text-xl text-gray-500 font-light leading-relaxed mb-8">
                We believe that every product should be a masterpiece of both form and function. By merging cutting-edge technology with timeless design, we create an ecosystem of essentials that elevate your daily routine.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 overflow-hidden"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" /></div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-300 overflow-hidden"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="User" /></div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold">+10k</div>
                </div>
                <div className="text-sm text-[#0f172a] font-medium">
                  Trusted by thousands worldwide.
                </div>
              </div>
            </div>
            <div className="editorial-content flex-1 w-full h-[500px] rounded-[2.5rem] overflow-hidden relative shadow-2xl">
              <img src="https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Innovation" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURATED CATEGORIES - Minimalist Cards with clear visibility */}
      <section className="categories-section py-24 md:py-32 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">Shop By Science</h2>
          <p className="text-xl text-gray-500 font-light">Explore our scientifically backed collections.</p>
        </div>

        {/* FIX: Changed cards to have clear separation, text below image instead of overlaying on white backgrounds */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((cat, idx) => (
            <Link to={`/products?category=${cat.name.toLowerCase()}`} key={cat.name} className="category-card group flex flex-col">
              <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-6 relative">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
              <div className="text-left px-2">
                <h3 className="text-2xl font-bold text-[#0f172a] mb-1">{cat.name}</h3>
                <p className="text-gray-500 mb-3">{cat.desc}</p>
                <span className="text-[#c084fc] font-bold text-sm tracking-widest uppercase group-hover:text-[#0f172a] transition-colors flex items-center">
                  Explore <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="products-section py-24 md:py-32 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">Trending Formulas</h2>
              <p className="text-xl text-gray-500 font-light">The most loved items this week.</p>
            </div>
            <Link to="/products" className="text-[#0f172a] font-bold tracking-widest uppercase text-sm border-b-2 border-[#0f172a] pb-1 hover:text-[#c084fc] hover:border-[#c084fc] transition-colors">
              View Entire Collection
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[#f8fafc] rounded-3xl overflow-hidden p-4">
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                  <div className="pt-6 space-y-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">
              No products found. Make sure the API is running.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {products.slice(0, 4).map(product => (
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

      {/* 5. FULL BLEED CTA SECTION */}
      <section className="relative py-32 bg-[#0f172a] text-center px-6">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Ready to upgrade your routine?
          </h2>
          <p className="text-xl text-gray-400 font-light mb-10">
            Join the community and get 15% off your first order.
          </p>
          <Link to="/login">
            <button className="h-16 px-12 text-lg font-bold bg-[#c084fc] text-white hover:bg-white hover:text-[#0f172a] rounded-full transition-colors duration-300 shadow-lg">
              Become a Member
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
