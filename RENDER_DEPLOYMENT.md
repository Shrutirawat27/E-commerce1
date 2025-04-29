# Deploying E-commerce App to Render

This guide covers the steps needed to deploy your e-commerce application to Render.

## Prerequisites

1. Create a [Render account](https://render.com)
2. Connect your GitHub repository
3. Setup a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database

## Required Environment Variables

For your application to work correctly, you need to set these environment variables in Render:

```
# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# Authentication
JWT_SECRET_KEY=your_jwt_secret_key_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=10000
NODE_ENV=production
```

## Deployment Steps

### 1. Setup MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster (free tier works fine)
3. Create a database user with password
4. Whitelist IP address 0.0.0.0/0 (or specific Render IPs for better security)
5. Get your connection string and use it for `DB_URL` environment variable

### 2. Setup Cloudinary (for Image Uploads)

1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Use these values for the Cloudinary environment variables

### 3. Deploy to Render

#### Using render.yaml (Easiest Method)

1. Render will auto-detect the `render.yaml` file in your repository
2. Create a new "Blueprint" in your Render dashboard
3. Connect your repository
4. Render will automatically create both backend and frontend services
5. Configure the environment variables in the Render dashboard
6. Your app will be deployed automatically

#### Manual Setup

If you prefer to set up services manually:

**Backend Service:**
1. Create a new Web Service in Render
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Set all environment variables
6. Deploy

**Frontend Service:**
1. Create a new Static Site in Render
2. Connect your repository
3. Set build command: `cd frontend && npm install && npm run build`
4. Set publish directory: `frontend/dist`
5. Set environment variable `VITE_BACKEND_URL` to your backend service URL
6. Deploy

## Troubleshooting

### CORS Issues
If you encounter CORS errors, check that your backend CORS configuration includes your Render domain.

### Database Connection Issues
- Verify your MongoDB Atlas connection string
- Ensure IP whitelist includes Render's IPs or 0.0.0.0/0

### Image Upload Problems
- Check your Cloudinary credentials
- Verify your backend has the correct environment variables

### Frontend Not Connecting to Backend
- Verify that `VITE_BACKEND_URL` is set correctly 
- Make sure the URL doesn't have a trailing slash

## Render Free Tier Limitations

Be aware that Render's free tier:
- Spins down after 15 minutes of inactivity
- Has limited bandwidth and compute hours
- First request after inactivity may be slow

For production use, consider upgrading to a paid plan. 