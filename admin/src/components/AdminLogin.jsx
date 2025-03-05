import React, { useState } from 'react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Invalid credentials');
            }

            setMessage({ type: 'success', text: 'Login successful!' });
            // You can also store the token here in localStorage or as a state
            localStorage.setItem('admin_token', data.token);
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: error.message || 'An error occurred. Please try again later.' });
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Admin Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Admin Email"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Admin Password"
            />
            <button type="submit">Login</button>
            {message && <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</p>}
        </form>
    );
};

export default AdminLogin;
