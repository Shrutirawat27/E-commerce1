import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log('Backend URL:', backendUrl);
export const currency = '$'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const navigate = useNavigate();  // Hook for navigation after logout

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/login');  // Use navigate from react-router-dom to redirect
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      {token === "" ? (
        <Login setToken={setToken} />  // Show login page if no token
      ) : (
        <>
          {/* Pass setToken to Navbar and Sidebar */}
          <Navbar setToken={setToken} handleLogout={handleLogout} />
          <hr />
          <div className="flex w-full">
            <Sidebar handleLogout={handleLogout} />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<Navigate to="/list" />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/login" element={<Login setToken={setToken} />} />  {/* Ensure the login route is here */}
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;