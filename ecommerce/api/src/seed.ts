import dotenv from 'dotenv';
import Product from './models/Product';
import connectDB from './config/db';

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality over-ear wireless headphones with noise cancellation.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    category: 'Electronics',
    stock: 25,
  },
  {
    name: 'Classic White Sneakers',
    description: 'Comfortable everyday sneakers for men and women.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop',
    category: 'Shoes',
    stock: 50,
  },
  {
    name: 'Cotton Blend T-Shirt',
    description: 'Premium quality basics. Soft, breathable cotton.',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
    category: 'Clothing',
    stock: 100,
  },
  {
    name: 'Smart Watch Series X',
    description: 'Track your fitness, heart rate, and receive notifications.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
    category: 'Electronics',
    stock: 15,
  },
  {
    name: 'Minimalist Leather Backpack',
    description: 'Perfect for daily commute and travel. Fits up to 15" laptop.',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    category: 'Accessories',
    stock: 30,
  },
  {
    name: 'Ceramic Coffee Mug',
    description: 'Handcrafted ceramic mug, perfect for your morning brew.',
    price: 18.50,
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop',
    category: 'Home',
    stock: 60,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight and breathable shoes designed for long runs.',
    price: 119.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    category: 'Shoes',
    stock: 40,
  },
  {
    name: 'Polarized Sunglasses',
    description: 'Classic design with modern UV protection.',
    price: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
    category: 'Accessories',
    stock: 20,
  }
];

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany(); // Clear existing products

    await Product.insertMany(sampleProducts);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
