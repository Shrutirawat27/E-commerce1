import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../redux/features/auth/authApi';

const Register = () => {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');   
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const navigate = useNavigate();

    // Handle Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Basic input validation
        if (!username || !email || !password) {
            setMessage("All fields are required.");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            return;
        }

        const data = { username, email, password };

        try {
            const response = await registerUser(data).unwrap();
            console.log('Registration successful:', response);

            alert("Registration successful!");
            navigate("/login"); // Redirect to login page after success
        } catch (error) {
            console.error("Registration error:", error);
            
            // More detailed error handling
            if (error.status === 400) {
                setMessage("Email already in use or invalid details.");
            } 
             else {
                setMessage(error.data?.message || "Registration failed. Please try again.");
            }
        }
    };

    return (
        <section className="h-screen flex items-center justify-center">
            <div className="max-w-sm border shadow bg-white mx-auto p-8">
                <h2 className="text-2xl font-semibold pt-5 text-center">Register</h2>
                <form 
                    onSubmit={handleRegister}
                    className="space-y-5 max-w-sm mx-auto pt-8"
                >
                    <input 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text" 
                        name="username" 
                        id="username" 
                        placeholder="Username" 
                        required
                        className="w-full bg-gray-100 focus:outline-none px-5 py-3"
                    />

                    <input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="Email Address" 
                        required
                        className="w-full bg-gray-100 focus:outline-none px-5 py-3"
                    />

                    <input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="Password (min 6 characters)" 
                        required
                        className="w-full bg-gray-100 focus:outline-none px-5 py-3"
                    />

                    {message && <p className="text-red-500">{message}</p>}

                    <button 
                        type="submit"
                        className="w-full mt-5 bg-primary text-white hover:bg-indigo-500 font-medium py-3 rounded-md"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="my-5 italic text-sm text-justify">
                    Already have an Account? 
                    <Link to="/login" className="text-red-500 hover:text-red-700 px-1"> Login </Link>
                </p>
            </div>
        </section>
    );
};

export default Register;
