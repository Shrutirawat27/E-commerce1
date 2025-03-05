import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = () => {
  const [image1, setImage1] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [category, setCategory] = useState("Accessories");
  const [color, setColor] = useState("Black");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      console.error("No token found, user might not be authenticated.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("oldPrice", oldPrice);
      formData.append("category", category);
      formData.append("color", color);
      formData.append("image1", image1);

      // Send data using Axios with Authorization header
      const response = await axios.post(
        `${backendUrl}/api/products/create-product`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
          withCredentials: true,
        }
      );
      if (response.data && response.data._id) {
        toast.success("Product added successfully!")
        setName('')
        setDescription('')
        setImage1(null)
        setPrice('')
        setOldPrice('')
      } else {
        toast.error(response.data.message || "Something went wrong")
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className='mb-2'>Upload Image</p>
        <div className='flex gap-2'>
          <label htmlFor='image1'>
            <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt='' />
            <input onChange={(e) => setImage1(e.target.files[0])} type='file' id='image1' hidden />
          </label>
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type='text' placeholder='Type here' required />
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' placeholder='Write content here' required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div>
          <p className='mb-2'>Product Category</p>
          <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
            <option value="Accessories">Accessories</option>
            <option value="Dress">Dress</option>
            <option value="Footwear">Footwear</option>
            <option value="Cosmetics">Cosmetics</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type='Number' placeholder='25' />
        </div>

        <div>
          <p className='mb-2'>Product Old Price</p>
          <input onChange={(e) => setOldPrice(e.target.value)} value={oldPrice} className='w-full px-3 py-2 sm:w-[120px]' type='Number' placeholder='25' />
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2'>Product Color</p>
        <select onChange={(e) => setColor(e.target.value)} className='w-full max-w-[500px] px-3 py-2'>
          <option value="Black">Black</option>
          <option value="Blue">Blue</option>
          <option value="Green">Green</option>
          <option value="Red">Red</option>
          <option value="Beige">Beige</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
        </select>
      </div>

      <button type='Submit' className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>
    </form>
  );
};

export default Add;