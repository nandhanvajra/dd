const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 7000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/admin';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:4200';

// Middleware
app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Mongoose Schema & Model for products collection in admin database
const productSchema = new mongoose.Schema({
  pid: { type: Number, required: true, unique: true, min: 1 },
  pname: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  brand: { type: String, required: true, trim: true }
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema, 'products');

// Initial seed data specified in requirements
const initialProducts = [
  { pid: 101, pname: 'Mobile', price: 45123, brand: 'Samsung' },
  { pid: 102, pname: 'Laptop', price: 95123, brand: 'HP' },
  { pid: 103, pname: 'TV', price: 85123, brand: 'Sony' }
];

async function seedInitialProducts() {
  // Upserts mean the three initial products exist without adding duplicates on restart.
  await Product.bulkWrite(initialProducts.map((product) => ({
    updateOne: {
      filter: { pid: product.pid },
      update: { $setOnInsert: product },
      upsert: true
    }
  })));
}

function isDatabaseReady(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database is unavailable. Please try again shortly.' });
  }
  return next();
}

/**
 * 1. POST http://localhost:7000/addproduct
 * Adds a new product to the database
 */
app.post('/addproduct', isDatabaseReady, async (req, res) => {
  try {
    const { pid, pname, price, brand } = req.body;
    const numericPid = Number(pid);
    const numericPrice = Number(price);
    if (
      !Number.isInteger(numericPid) || numericPid < 1 ||
      !Number.isFinite(numericPrice) || numericPrice < 0 ||
      typeof pname !== 'string' || !pname.trim() ||
      typeof brand !== 'string' || !brand.trim()
    ) {
      return res.status(400).json({ error: 'All fields (pid, pname, price, brand) are required.' });
    }

    const newProduct = new Product({
      pid: numericPid,
      pname: pname.trim(),
      price: numericPrice,
      brand: brand.trim()
    });

    const savedProduct = await newProduct.save();
    console.log('Added new product:', savedProduct);
    return res.status(201).json({ message: 'Product added successfully', product: savedProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    if (error?.code === 11000) {
      return res.status(409).json({ error: 'A product with this PID already exists.' });
    }
    return res.status(500).json({ error: 'Failed to add product to database.' });
  }
});

/**
 * 2. GET http://localhost:7000/getallproducts
 * Fetches all existing products from products collection
 */
app.get('/getallproducts', isDatabaseReady, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ pid: 1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    await Product.init();
    await seedInitialProducts();
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server because MongoDB connection or seeding failed:', error.message);
    process.exit(1);
  }
}

startServer();
