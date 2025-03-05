import React from 'react';
import { assets } from '../assets/assets';

const Navbar = ({ handleLogout, setToken }) => {
  const onLogoutClick = () => {
    handleLogout();
    setToken(''); // Reset token state
  };

  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <img className='w-[max(10%, 80px)]' src={assets.logo} alt="" />
      <button onClick={onLogoutClick} className="mt-4 py-2 px-4 bg-red-500 text-white rounded-md">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
