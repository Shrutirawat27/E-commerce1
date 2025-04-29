// Auth utilities for token management

/**
 * Refresh the access token using the refresh token
 * @returns {Promise<string|null>} The new access token or null if refresh failed
 */
export const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.error('No refresh token available');
            return null;
        }

        const response = await fetch('http://localhost:3000/api/admin/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        
        // Store the new tokens
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        console.log('Token refreshed successfully');
        return data.token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        // Clear tokens on refresh failure - user needs to login again
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return null;
    }
};

/**
 * Get the current access token, refreshing it if needed
 * @returns {Promise<string|null>} The access token or null if not available
 */
export const getAccessToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
        // Check if token is expired
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000; // Convert to milliseconds
        
        // If token is about to expire (less than 5 minutes left), refresh it
        if (expiry - Date.now() < 5 * 60 * 1000) {
            console.log('Token is about to expire, refreshing...');
            return await refreshAccessToken();
        }
        
        return token;
    } catch (error) {
        console.error('Error parsing token:', error);
        return token; // Return the original token if parsing fails
    }
};

/**
 * Check if the user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export const isAuthenticated = async () => {
    const token = await getAccessToken();
    return !!token;
}; 