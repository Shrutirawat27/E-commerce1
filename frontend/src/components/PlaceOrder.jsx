import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stripe_logo from '../assets/stripe_logo.png';
import razorpay_logo from '../assets/razorpay_logo.png';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const navigate = useNavigate(); // Using useNavigate for routing

  const handlePlaceOrder = () => {
    // Navigate to the Orders page
    navigate('/Orders');
    console.log('Navigated to /Orders');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-6 pt-5 sm:pt-14 min-h-[80vh] px-4">
      {/* Delivery Information Section */}
      <div className="flex flex-col gap-6 w-full sm:w-[50%]">
        <div className="text-xl sm:text-2xl my-3">
          <h1>Delivery Information</h1>
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email Address"
        />
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone Number"
        />
      </div>

      {/* Order Summary Section */}
      <div className="flex flex-col gap-6 w-full sm:w-[45%] mt-20 sm:0">
        <div className="order-summary bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="summary-item flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Selected Items:</span>
            <span className="font-medium">$0</span>
          </div>
          <div className="summary-item flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total Price:</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="summary-item flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Tax (5%):</span>
            <span className="font-medium">$0.00</span>
          </div>
          <div className="summary-item flex justify-between items-center border-t-2 pt-3 mt-3">
            <span className="text-sm text-gray-600">Grand Total:</span>
            <span className="font-medium text-xl">$0.00</span>
          </div>
        </div>

        <div className="mt-12">
          <h1>Payment Method</h1>
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod('stripe')}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'stripe' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h-5 mx-4" src={stripe_logo} alt="stripe" />
            </div>
            <div
              onClick={() => setMethod('razorpay')}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'razorpay' ? 'bg-green-400' : ''
                }`}
              ></p>
              <img className="h-5 mx-4" src={razorpay_logo} alt="razorpay" />
            </div>
            <div
              onClick={() => setMethod('cod')}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === 'cod' ? 'bg-green-400' : ''
                }`}
              ></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                Cash On Delivery
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              onClick={handlePlaceOrder}
              className="bg-black text-white px-16 py-3 text-sm"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
