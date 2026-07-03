import dotenv from 'dotenv';
import Product from './models/Product';
import connectDB from './config/db';

dotenv.config();

const sampleProducts = [
  {
    name: 'Smart AR Contact Lenses',
    description: 'Next-generation augmented reality integrated directly into comfortable daily-wear contact lenses.',
    price: 499.99,
    imageUrl: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=800&auto=format&fit=crop',
    category: 'Electronics',
    stock: 15,
  },
  {
    name: 'Biometric Health Ring Pro',
    description: 'Track sleep, stress, and vital signs with 99% medical-grade accuracy in a sleek titanium ring.',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b254a4?q=80&w=800&auto=format&fit=crop',
    category: 'Accessories',
    stock: 40,
  },
  {
    name: 'Solar-Powered Self-Cleaning Jacket',
    description: 'Nanotech fabric that repels dirt and charges your devices while you walk in the sun.',
    price: 349.99,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    category: 'Clothing',
    stock: 25,
  },
  {
    name: '3D Printed Custom Fit Sneakers',
    description: 'Sneakers 3D printed to the exact micro-measurements of your feet for zero-gravity comfort.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
    category: 'Shoes',
    stock: 50,
  },
  {
    name: 'Holographic Desk Assistant',
    description: 'A 3D holographic projection of your AI assistant to help manage your workflow and schedule.',
    price: 599.99,
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    category: 'Electronics',
    stock: 10,
  },
  {
    name: 'Lab-Grown Leather Tote Bag',
    description: '100% cruelty-free, sustainable leather grown in a lab, featuring unmatched durability.',
    price: 189.99,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
    category: 'Accessories',
    stock: 35,
  },
  {
    name: 'Smart Fabric Workout Shirt',
    description: 'Monitors muscle fatigue and posture in real-time, sending haptic feedback to correct your form.',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
    category: 'Clothing',
    stock: 60,
  },
  {
    name: 'Personalized Nootropic Coffee Maker',
    description: 'Brews coffee infused with a custom blend of nootropics based on your daily biometric needs.',
    price: 399.99,
    imageUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=800&auto=format&fit=crop',
    category: 'Home',
    stock: 20,
  },
  {
    name: 'Autonomous Follow-Me Drone',
    description: 'Pocket-sized drone that autonomously follows you to capture cinematic 8K footage.',
    price: 799.99,
    imageUrl: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=800&auto=format&fit=crop',
    category: 'Electronics',
    stock: 12,
  },
  {
    name: 'Kinetic Energy Harvesting Shoes',
    description: 'Charge your smartphone simply by walking. Converts kinetic energy into electrical power.',
    price: 219.99,
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop',
    category: 'Shoes',
    stock: 30,
  },
  {
    name: 'Smart Home Hydroponic Garden',
    description: 'Grow your own organic herbs and vegetables indoors with zero effort using AI monitoring.',
    price: 249.99,
    imageUrl: 'https://images.unsplash.com/photo-1585320806055-66774e1d132a?q=80&w=800&auto=format&fit=crop',
    category: 'Home',
    stock: 45,
  },
  {
    name: 'AI Sleep Optimization Pillow',
    description: 'Actively adjusts its temperature and firmness throughout the night for optimal deep sleep.',
    price: 159.99,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop',
    category: 'Home',
    stock: 55,
  },
  {
    name: 'Quantum Dot Curved Monitor',
    description: 'Immersive 49-inch curved display with next-gen quantum dot technology for lifelike colors.',
    price: 1199.99,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop',
    category: 'Electronics',
    stock: 8,
  },
  {
    name: 'Color-Changing Smart Hoodie',
    description: 'Change the color and pattern of your hoodie instantly using a smartphone app.',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    category: 'Clothing',
    stock: 40,
  },
  {
    name: 'Neuro-Acoustic Headphones',
    description: 'Headphones that use neuro-acoustic frequencies to instantly induce states of deep focus or relaxation.',
    price: 349.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    category: 'Electronics',
    stock: 22,
  }
];

const importData = async () => {
  try {
    await connectDB();

    // await Product.deleteMany(); // Clear existing products

    await Product.insertMany(sampleProducts);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

importData();
