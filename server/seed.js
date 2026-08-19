const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/admin';

const productSchema = new mongoose.Schema({
  pid: { type: Number, required: true, unique: true },
  pname: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: String, required: true }
}, { versionKey: false });

const Product = mongoose.model('Product', productSchema, 'products');

const initialProducts = [
  { pid: 101, pname: 'Mobile', price: 45123, brand: 'Samsung' },
  { pid: 102, pname: 'Laptop', price: 95123, brand: 'HP' },
  { pid: 103, pname: 'TV', price: 85123, brand: 'Sony' }
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB admin database...');
    
    // Insert only products that do not already exist; never clear user data.
    const result = await Product.bulkWrite(initialProducts.map((product) => ({
      updateOne: {
        filter: { pid: product.pid },
        update: { $setOnInsert: product },
        upsert: true
      }
    })));
    console.log(`Seed complete. Inserted ${result.upsertedCount} missing initial product(s).`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedDB();
