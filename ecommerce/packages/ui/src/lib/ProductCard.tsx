import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

const ProductCard = ({ id, name, price, imageUrl, category }: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item: any) => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, quantity: 1, image: imageUrl });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <Link to={`/product/${id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          {category}
        </span>
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xl font-extrabold text-gray-900">
            ${price.toFixed(2)}
          </span>
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center p-3 rounded-xl bg-gray-900 text-white hover:bg-primary transition-colors duration-200 active:scale-95"
            aria-label="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
