import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
        console.log("Admin orders:", response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${backendUrl}/api/orders/${orderId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update local state to reflect the change
      setOrders(orders.map(order => 
        order._id === orderId ? {...order, status: newStatus} : order
      ));
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status: " + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Customer Orders</h1>
      
      {orders.length === 0 ? (
        <p className="text-center py-8">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Products</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{order._id.substring(0, 8)}...</td>
                  <td className="py-3 px-4">
                    {order.deliveryInfo ? (
                      <div>
                        <p>{order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</p>
                        <p className="text-xs text-gray-500">{order.deliveryInfo.email}</p>
                      </div>
                    ) : (
                      <p>{order.userId?.name || "Unknown"}</p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {order.products.map((product, idx) => (
                      <div key={idx} className="mb-1">
                        <p>
                          {product.productId?.name || "Product"} x {product.quantity}
                        </p>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4">{currency}{order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4">{formatDate(order.orderDate)}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      order.status === 'Delivered' ? 'bg-green-200 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-200 text-blue-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select 
                      className="border rounded px-2 py-1 text-sm"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
