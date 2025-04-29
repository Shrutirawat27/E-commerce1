export const getBaseUrl = () => {
    // Check if we're in development or production
    const isDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
    
    // Return the appropriate backend URL based on environment
    if (isDevelopment) {
        // For local development, use explicitly port 3000
        return "http://localhost:3000";
    } else {
        // For production, use the same origin as the frontend
        return window.location.origin;
    }
}