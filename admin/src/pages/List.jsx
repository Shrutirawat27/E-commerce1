import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { backendUrl, currency } from '../App'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({token}) => {

  const [list,setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products?isAdmin=true");
      console.log("API Response:", response.data); // Debugging
  
      if (response.data.products) {
        setList(response.data.products);
      } else {
        toast.error("No products found!");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (_id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/products/${_id}`, { headers: { Authorization: `Bearer ${token}`  } });
  
      if (response.status === 200) {
        toast.success(response.data.message);
  
        // ✅ Remove from local state instead of calling API again
        setList((prevList) => prevList.filter((item) => item._id !== _id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  
  

  useEffect(()=> {
    fetchList();
  },[]);

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>
  
        {/* ----- List Table Title ------ */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>
  
        {/* -------- Product List ------ */}
        {list.length > 0 ? (
          list.map((item) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={item._id}> 
              <img src={item.image1 || 'fallback-image-url'} alt={item.name} className="h-20 w-20 object-cover" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{item.price}</p>
              <p onClick={()=>removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-lg'>X</p>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500'>No products available.</p>
        )}
      </div>
    </>
  );  
}

export default List
