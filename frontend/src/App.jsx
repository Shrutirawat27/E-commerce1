import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'
import Footer from './components/Footer';
import AdminLogin from '@admin/components/AdminLogin'; 

function App() {
  return (
    <>
    <Navbar/>
      <Outlet/>
      <Footer/>
      
      
    </>
  )
}

export default App
