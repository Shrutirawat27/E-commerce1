// src/pages/shop/Orders.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOrders } from "../../redux/features/products/productsSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, currency } = useSelector((state) => state.products); // Access Redux state for orders and currency

  // Fetch orders data from MongoDB using fetch
  useEffect(() => {

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT token
        const response = await fetch("http://localhost:3000/api/orders", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        });
        
    
        const data = await response.json();
        console.log("Fetched Orders:", data);
        dispatch(setOrders(data));
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };
    
    
    fetchOrders();
  }, [dispatch]);

  // Debug Redux state
  useEffect(() => {
    console.log("Redux Orders State:", orders);
  }, [orders]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <h1>My Orders</h1>
      </div>
      <div>
        {
          // Check if there are any orders to display
          orders.length > 0 ? (
            orders.map((item, index) => (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex items-start gap-6 text-sm">
                  {/* Display product image safely */}
                  <img className="w-16 sm:w-20" 
                       src={item.products?.[0]?.productId?.image1 || "/default-image.png"} 
                       alt={item.products?.[0]?.name || "Product"} 
                  />

                  <div>
                    {/* Display product name */}
                    <p className="sm:text-base font-medium">{item.products?.[0]?.productId?.name}</p>
                    <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                      {/* Display product price */}
                      <p className="text-lg">{currency} {item.products?.[0]?.productId?.price}</p>
                      {/* Display product quantity */}
                      <p>Quantity: {item.products?.[0]?.quantity || 1}</p>
                    </div>
                    {/* Display order date safely */}
                    <p className="mt-2">
                      Date: <span className="text-gray-400">
                        {item.orderDate ? new Date(item.orderDate).toLocaleDateString() : "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-between">
                  <div className='flex items-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p className='text-sm md:text-base'>Ready to ship</p>
                  </div>
                  <button className='border px-4 py-2 text-sm font-medium rounded-sm '>Track Order</button>
                </div>
              </div>
            ))
          ) : (
            <p>No orders placed yet.</p> // Message if no orders exist
          )
        }
      </div>
    </div>
  );
};

export default Orders;
