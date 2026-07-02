import express, { Request, Response } from 'express';
import Product from '../models/Product';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// @desc    Fetch all products
// @route   GET /products
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword as string, $options: 'i' } }
      : {};
    const category = req.query.category
      ? { category: { $regex: req.query.category as string, $options: 'i' } }
      : {};

    const products = await Product.find({ ...keyword, ...category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products' });
  }
});

// @desc    Fetch single product
// @route   GET /products/:id
// @access  Public
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching product' });
  }
});

// @desc    Create a product
// @route   POST /products
// @access  Private/Admin
router.post('/', protect, admin, async (req: Request, res: Response) => {
  try {
    const { name, description, price, imageUrl, category, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating product' });
  }
});

// @desc    Update a product
// @route   PUT /products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, imageUrl, category, stock } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    product.category = category || product.category;
    product.stock = stock ?? product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating product' });
  }
});

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting product' });
  }
});

export default router;
