const Order = require('./orders.model');

// Fetch all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')  
      .populate({
        path: 'products.productId',
        select: 'name image1 price'  // Ensure image1 is included
      })
      .lean();  // Convert to plain JSON for better response handling

    console.log("Orders from DB:", orders);

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Place a new order
const createOrder = async (req, res) => {
  console.log("Incoming Order Data:", req.body);  // Log request data
  
  try {
    const { userId, products, totalAmount } = req.body;

    if (!userId || !products || products.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({ userId, products, totalAmount });
    await newOrder.save();

    console.log("Order Successfully Saved:", newOrder);  // Log saved order

    const populatedOrder = await Order.findById(newOrder._id)
      .populate('userId', 'name email')
      .populate({
        path: 'products.productId',
        select: 'name image1 price'
      });

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};


module.exports = { getOrders, createOrder };
