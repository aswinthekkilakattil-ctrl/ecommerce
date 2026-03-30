# Ecommerce Website

A full functional ecommerce website built with Next.js, featuring user authentication, product catalog, shopping cart, and cash on delivery checkout.

## Features

- User signup and login
- Product catalog with 12 dummy products
- Add to cart functionality
- Checkout with cash on delivery
- MongoDB database integration

## Technologies Used

- Next.js 16
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- JWT for authentication

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `POST /api/checkout` - Place order

## Security Note

This application includes intentional security vulnerabilities for demonstration purposes in a vulnerability detection and correction system. Do not use in production.

## Deploy on Vercel

Deploy to Vercel by connecting your repository.
