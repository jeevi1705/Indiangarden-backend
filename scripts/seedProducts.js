const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
  { name: '1000 Petals Rare Lotus', slug: 'lotus-1000-petals', image: '/images/products/lotus-1000-petals.jpg', price: 899, rating: 5, countInStock: 15, category: 'Aquatic Plants', brand: 'Rare', description: 'Rare thousand petals lotus.' },
  { name: 'Drop Blood Lotus (Code 31)', slug: 'drop-blood-lotus', image: '/images/products/drop-blood-lotus.jpg', price: 599, rating: 4, countInStock: 8, category: 'Aquatic Plants', brand: 'Rare', description: 'Deep red drop blood lotus.' },
  { name: 'Green Cloud Lotus', slug: 'green-cloud-lotus', image: '/images/products/akhila-lotus.jpg', price: 399, rating: 5, countInStock: 10, category: 'Aquatic Plants', brand: 'Rare', description: 'A stunning white cloud-like lotus.' },
  { name: 'Siam Lotus', slug: 'siam-lotus', image: '/images/products/siam lotus.jpeg', price: 449, rating: 4, countInStock: 12, category: 'Aquatic Plants', brand: 'Rare', description: 'Elegant lotus variety from Southeast Asia.' },
  { name: 'Monstera Deliciosa Indoor', slug: 'monstera-deliciosa', image: '/images/products/monstera-deliciosa.jpg', price: 1299, rating: 5, countInStock: 12, category: 'Indoor Plants', brand: 'Green', description: 'Classic indoor monstera plant.' },
  { name: 'Organic NPK Fertilizer', slug: 'npk-fertilizer', image: '/images/products/npk-fertilizer.jpg', price: 299, rating: 4, countInStock: 50, category: 'Fertilizers', brand: 'Organic', description: 'High quality NPK fertilizer.' },
  { name: 'Snake Plant', slug: 'snake-plant', image: '/images/products/snake-plant.jpg', price: 499, rating: 5, countInStock: 20, category: 'Indoor Plants', brand: 'Green', description: 'Air purifying snake plant.' },
  { name: 'Peace Lily', slug: 'peace-lily', image: '/images/products/peace lily.jpeg', price: 399, rating: 4, countInStock: 10, category: 'Outdoor Plants', brand: 'Green', description: 'Beautiful white peace lily.' },
  { name: 'Pothos', slug: 'pothos', image: '/images/products/pothos.jpeg', price: 299, rating: 4, countInStock: 15, category: 'Indoor Plants', brand: 'Green', description: 'Easy to grow pothos.' },
  { name: 'jew plant', slug: 'jew-plant', image: '/images/products/jew plant.jpeg', price: 199, rating: 4, countInStock: 25, category: 'Indoor Plants', brand: 'Green', description: 'Wandering jew plant.' },
  { name: 'Fiddle Leaf Fig', slug: 'fiddle-leaf-fig', image: '/images/products/fiddle.jpeg', price: 699, rating: 5, countInStock: 5, category: 'Outdoor Plants', brand: 'Green', description: 'Trendy fiddle leaf fig.' },
  { name: 'white kaakataan', slug: 'white-kaakataan', image: '/images/products/white kaakataan.jpeg', price: 1499, rating: 5, countInStock: 8, category: 'Outdoor Plants', brand: 'Rare', description: 'Special white variety.' },
  { name: 'Syngonium Starlight', slug: 'syngonium-starlight', image: '/images/products/pots plant1.jpeg', price: 499, rating: 5, countInStock: 8, category: 'Pots & Planters', brand: 'Green', description: 'Variegated syngonium.' },
  { name: 'Syngonium Wendlandii', slug: 'syngonium-wendlandii', image: '/images/products/pots plant2.jpeg', price: 699, rating: 5, countInStock: 15, category: 'Pots & Planters', brand: 'Green', description: 'Velvet leaf syngonium.' },
  { name: 'Premium Quality Indoor plastic Colour Pots ', slug: 'premium-pots', image: '/images/products/pots plant3.jpeg', price: 599, rating: 4, countInStock: 8, category: 'Pots & Planters', brand: 'Premium', description: 'Set of colorful plastic pots.' },
  { name: 'Mogra & Mysore Malli', slug: 'mogra-malli', image: '/images/products/pots plant4.jpeg', price: 299, rating: 5, countInStock: 12, category: 'Outdoor Plants', brand: 'Fragrant', description: 'Fragrant jasmine flowers.' },
  { name: 'Hibiscus Red & Hibiscus double', slug: 'hibiscus-set', image: '/images/products/pots plant5.jpeg', price: 299, rating: 4, countInStock: 50, category: 'Outdoor Plants', brand: 'Flower', description: 'Bright red hibiscus plants.' },
  { name: 'Garden Cutter', slug: 'garden-cutter', image: '/images/products/cut.jpeg', price: 249, rating: 5, countInStock: 20, category: 'Garden Tools', brand: 'Tools', description: 'Sharp garden cutters.' },
  { name: 'Grow Bags Set of 6', slug: 'grow-bags-set', image: '/images/products/growbag.jpeg', price: 449, rating: 4, countInStock: 50, category: 'Garden Tools', brand: 'Tools', description: 'Durable grow bags.' },
  { name: 'Garden Fork', slug: 'garden-fork', image: '/images/products/gardenfork.jpeg', price: 199, rating: 5, countInStock: 20, category: 'Garden Tools', brand: 'Tools', description: 'Handy garden fork.' },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://sjeevithajeevi005_db_user:lQOoPl72XOkJ0vlb@cluster0.47dbmtm.mongodb.net/flowers?appName=Cluster0');

    // Remove existing products to avoid duplicates during seeding
    // But maybe we should only delete the "Sample name" ones? 
    // Actually, seeding usually clears the collection or adds missing ones.
    // The user wants their products "back", so I'll add these.
    
    // I will DELETE "Sample name" products specifically first
    await Product.deleteMany({ name: 'Sample name' });
    
    for (const p of products) {
        const exists = await Product.findOne({ slug: p.slug });
        if (!exists) {
            await Product.create(p);
        }
    }

    console.log('Products seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
