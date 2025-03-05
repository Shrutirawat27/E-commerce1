import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '/src/App.css';
import { useDispatch, useSelector } from 'react-redux';
import CartModal from '../pages/shop/CartModal';
import avatarImg from '../assets/avatar.png';
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';

const Navbar = () => {
    const products = useSelector((state) => state.cart.products);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();

    // Dropdown state
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref for dropdown container

    const handleDropDownToggle = () => {
        setIsDropDownOpen((prev) => !prev);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropDownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Admin dropdown menus
    const adminDropDownMenus = [
        { label: "Dashboard", path: "/dashboard/admin" },
        { label: "Manage Items", path: "/dashboard/manage-products" },
        { label: "All Orders", path: "/dashboard/manage-orders" },
        { label: "Add New Post", path: "/dashboard/add-new-post" },
    ];

    // User dropdown menus
    const userDropDownMenus = [
        { label: "My Profile", path: "/dashboard/profile" },
        { label: "Orders", path: "/dashboard/order" },
    ];

    const dropdownMenus = user?.role === 'admin' ? [...adminDropDownMenus] : [...userDropDownMenus];

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <header className="fixed-nav-bar w-nav">
            <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <div className="nav__logo">
                    <Link to="/">
                        <img src="/Logo.png" alt="Logo" className="h-10" />
                    </Link>
                </div>

                {/* Navigation Links */}
                <ul className="nav__links">
                    <li className="link"><Link to="/">HOME</Link></li>
                    <li className="link"><Link to="/shop">SHOP</Link></li>
                    <li className="link"><Link to="/about">ABOUT</Link></li>
                    <li className="link"><Link to="/contact">CONTACT</Link></li>
                </ul>

                {/* Icons Section */}
                <div className="nav__icons flex items-center space-x-4">
                    {/* Search Icon */}
                    <span>
                        <Link to="/search">
                            <img src="/search-b.png" alt="Search" className="h-7 icon hover:text-primary" />
                        </Link>
                    </span>

                    {/* Shopping Cart */}
                    <span className="relative">
                        <button onClick={() => setIsCartOpen(!isCartOpen)} className="hover:text-primary">
                            <img src="/shopping-bag.png" alt="Shopping Cart" className="h-8 icon" />
                            <sup className="absolute top-0 right-0 text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center transform translate-x-1/2 -translate-y-1/2">
                                {products.length}
                            </sup>
                        </button>
                    </span>

                    {/* User Profile & Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        {user ? (
                            <>
                                <img
                                    onClick={handleDropDownToggle}
                                    src={user?.profileImage || avatarImg}
                                    alt="User Profile"
                                    className="w-9 h-9 rounded-full cursor-pointer"
                                />

{isDropDownOpen && (
    <div className="absolute right-0 mt-3 p-4 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
        <ul className="font-medium space-y-4 p-2">
            {dropdownMenus.map((menu, index) => (
                <li key={index}>
                    <Link
                        onClick={() => setIsDropDownOpen(false)}
                        className="dropdown-items"
                        to={menu.path}
                    >
                        {menu.label}
                    </Link>
                </li>
            ))}
            <li>
                <button onClick={handleLogout} className="dropdown-items w-full text-left">
                    Logout
                </button>
            </li>
        </ul>
    </div>
)}

                            </>
                        ) : (
                            <Link to="/login">
                                <img src="/profile.png" alt="Profile" className="h-8 icon hover:text-primary" />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Shopping Cart Modal */}
            {isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
        </header>
    );
};

export default Navbar;
