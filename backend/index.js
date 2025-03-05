require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('./config/cloudinary');

const app = express();
const port = process.env.PORT || 3000;

const Product = require('./src/products/products.model');

// Middleware setup
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Search route for products
app.get('/api/products/search', async (req, res) => {
  const { searchQuery } = req.query;

  if (!searchQuery || !searchQuery.trim()) {
    return res.json([]); // ✅ Returns an empty array instead of an error
  }

  try {
    const products = await Product.find({
      name: { $regex: searchQuery, $options: 'i' },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong while searching.' });
  }
});


// Routes
const authRoutes = require('./src/users/user.route');
const productRoutes = require("./src/products/products.route");
const reviewRoutes = require("./src/reviews/reviews.router");
const adminRoutes = require('./src/middleware/admin.routes');
const orderRoutes = require('./src/orders/orders.route');

app.use('/api/user', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// MongoDB connection
async function main() {
  if (!process.env.DB_URL) {
    console.error("Error: DB_URL is not defined in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.DB_URL);
  console.log("MongoDB is successfully connected.");
}

main().catch(err => console.error("MongoDB Connection Error:", err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
