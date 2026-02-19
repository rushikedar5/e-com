# 🛒 E-Commerce Full Stack Application
LINK - e-com-rk.vercel.app

A production-ready E-Commerce web application built with modern backend and frontend architecture principles.

This project demonstrates:

- JWT Authentication
- Role-based Authorization
- Cart Management
- Atomic Checkout with Transaction
- Concurrency-safe Stock Handling
- Full Frontend ↔ Backend Integration

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- Prisma ORM
- MySQL
- JWT Authentication
- Role-based Authorization (CUSTOMER / ADMIN)

### Frontend
- React (Vite)
- Axios (with interceptor)
- React Router
- Role-based UI Rendering

---

## 📦 Features Implemented

### 🔐 Authentication
- Register
- Login
- JWT-based authentication
- Role-based access control

---

### 📦 Product Management
- Admin-only Product CRUD
- Public Product Listing
- Stock management

---

### 🛒 Cart Module
- Add to Cart
- Update Cart Quantity
- Remove Item from Cart
- View Cart with subtotal & total calculation
- Price snapshot stored (`priceAtAdd`)
- Ownership validation
- Composite unique constraint (`userId + productId`)

---

### 💳 Checkout System (Production-Level)

- Atomic Prisma Transaction
- Concurrency-safe stock deduction
- Conditional stock update (`stock >= quantity`)
- Order + OrderItems creation
- Cart cleanup
- All-or-nothing rollback
- Prevents overselling

---

## 🧠 Architectural Highlights

### ✔ Clean MVC Structure

src/
controllers/
routes/
middlewares/
config/


### ✔ Secure Middleware
- JWT verification
- Role enforcement
- Ownership checks

### ✔ Concurrency-Safe Inventory Handling

Stock is updated using atomic conditional decrement:

WHERE stock >= quantity


Prevents race conditions and overselling.

### ✔ Transaction-Based Checkout

All checkout operations occur inside:

prisma.$transaction()


Ensures data consistency.

---

## 🔑 Environment Variables

Create a `.env` file:

DATABASE_URL=mysql://user:password@host:port/dbname

SECRET_KEY=your_jwt_secret


---

## 🛠 Installation & Setup

### 1️⃣ Clone the repository

git clone [https://github.com/your-username/ecom-fullstack.git](https://github.com/rushikedar5/e-com.git)


---

### 2️⃣ Backend Setup

cd backend
npm install
npx prisma migrate dev
npm start


---

### 3️⃣ Frontend Setup

cd frontend
npm install
npm run dev


---

## 🌍 Deployment

### Backend
Deploy on:
- Render
- Railway
- Any Node-compatible hosting

Run production migrations:

npx prisma migrate deploy


---

### Frontend
Deploy on:
- Vercel

Set environment variable:

VITE_API_URL=https://your-backend-url/api/v1


---

## 🧪 API Endpoints

### Auth
- POST `/api/v1/register`
- POST `/api/v1/login`

### Products
- GET `/api/v1/products`
- POST `/api/v1/products` (ADMIN)
- PUT `/api/v1/products/:id` (ADMIN)
- DELETE `/api/v1/products/:id` (ADMIN)

### Cart
- POST `/api/v1/cart`
- GET `/api/v1/cart`
- PUT `/api/v1/cart/:id`
- DELETE `/api/v1/cart/:id`

### Orders
- POST `/api/v1/checkout`

---

## 📚 What This Project Demonstrates

- Backend system design thinking
- Database constraint usage
- Secure API design
- Transaction management
- Concurrency control
- Production-grade validation
- Full-stack integration

---

## 🎯 Future Improvements

- Order history endpoint
- Order status management
- Cancel order with stock restore
- Payment integration
- Admin dashboard analytics
- Pagination & filtering
- Dockerization

---

## 👨‍💻 Author

Built as a production-level learning project to master:

- Backend architecture
- Transactions
- Inventory systems
- Secure API design
