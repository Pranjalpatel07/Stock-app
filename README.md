
# SB Stocks — Trading Platform

**SB Stocks** is a **full-stack MERN trading platform** that allows users to simulate stock market trading using **$100,000 virtual capital** with real-time market data.

The platform helps beginners practice trading strategies **without risking real money**, while providing tools similar to professional trading dashboards.

---

# Team Members

| Role        | Name               |
| ----------- | ------------------ |
| Team Leader | **Pranjal Patel**  |
| Developer   | **Prayag Sahu**    |
| Developer   | **Prince Sahu**    |
| Developer   | **Pravesh Tiwari** |

---

# Project Overview

SB Stocks replicates the experience of a real stock brokerage platform where users can:

* Create an account
* Track stock prices
* Buy or sell stocks
* Monitor their portfolio
* View trade history
* Maintain watchlists
* Analyze charts

The platform uses **real stock market data APIs** combined with a **virtual trading engine**.

---

# Key Features

### Authentication & Security

* Secure **JWT based authentication**
* **bcrypt password hashing**
* Protected API routes
* Role-based access (**User / Admin**)

### Paper Trading Engine

* Each user starts with **$100,000 virtual capital**
* Buy and sell stocks
* Automatic balance updates
* Average price calculation
* Profit / Loss tracking

###  Portfolio Management

* Real-time portfolio value
* Holdings overview
* Position value calculation
* Performance tracking

###  Watchlist

* Track multiple tickers
* Quick market access

###  Trade History

* Complete transaction log
* Buy / Sell record
* Time and price tracking

###  Charts & Analytics

* Interactive stock charts
* Historical price data
* Performance visualization

###  UI Features

* Responsive design
* Mobile compatible interface

###  Admin Panel

Admin users can:

* Manage platform users
* Adjust user balances
* Manage stock listings
* Monitor trading activity

---

#  System Architecture

```
Frontend (React + Vite)
        │
        │ REST API
        ▼
Backend (Node.js + Express)
        │
        │ Mongoose ODM
        ▼
Database (MongoDB Atlas)
        │
        ▼
Stock Data API (Alpha Vantage)
```

---

#  Tech Stack

## Frontend

* React 18
* Vite
* Tailwind CSS
* Redux Toolkit
* React Router DOM
* Chart.js
* React Toastify

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs
* Express Validator

## Database

* MongoDB Atlas
* Mongoose ODM

## External APIs

* Alpha Vantage API (Stock Market Data)

---

#  Project Structure

```

sb_stock
│
├── client
│
│   ├── node_modules
│
│   ├── public
│
│   ├── src
│   │
│   │   ├── assets
│   │   │   ├── about1.jpg
│   │   │   ├── about2.jpg
│   │   │   └── home-hero-img.png
│   │
│   │   ├── components
│   │   │   ├── axiosInstance.js
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Register.jsx
│   │
│   │   ├── context
│   │   │   └── GeneralContext.jsx
│   │
│   │   ├── pages
│   │   │   ├── Admin.jsx
│   │   │   ├── AdminStockChart.jsx
│   │   │   ├── AllOrders.jsx
│   │   │   ├── AllTransactions.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── StockChart.jsx
│   │   │   └── Users.jsx
│   │
│   │   ├── RouteProtectors
│   │   │   ├── AuthProtector.jsx
│   │   │   └── LoginProtector.jsx
│   │
│   │   ├── styles
│   │   │   ├── Admin.css
│   │   │   ├── AdminStockChart.css
│   │   │   ├── AllOrders.css
│   │   │   ├── AllTransactions.css
│   │   │   ├── History.css
│   │   │   ├── Home.css
│   │   │   ├── Landing.css
│   │   │   ├── Navbar.css
│   │   │   ├── Portfolio.css
│   │   │   ├── Profile.css
│   │   │   ├── StockChart.css
│   │   │   └── Users.css
│   │
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│
│   ├── .env
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
│
│
├── server
│
│   ├── .dist
│
│   ├── config
│   │   └── db.js
│
│   ├── controllers
│   │   ├── userController.js
│   │   ├── stockController.js
│   │   └── transactionController.js
│
│   ├── middlewares
│   │   └── authMiddleware.js
│
│   ├── models
│   │   ├── userModel.js
│   │   ├── stocksSchema.js
│   │   ├── ordersSchema.js
│   │   └── transactionModel.js
│
│   ├── node_modules
│
│   ├── routes
│   │   ├── userRoute.js
│   │   ├── stockRoute.js
│   │   └── transactionRoute.js
│
│   ├── .env
│   ├── API_DOC.md
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   └── Schemas.js
│
└── README.md

```

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Pranjalpatel07/Stock-app.git
cd Stock-app
```

---

## 2️⃣ Install Dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd ../client
npm install
```

---

# 🔑 Environment Variables

## Backend `.env`

```
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_key

JWT_EXPIRE=7d

ALPHA_VANTAGE_API_KEY=your_api_key

CLIENT_URL=http://localhost:5173
```

---

## Frontend `.env`

```
VITE_API_URL=http://localhost:5000
```

---

# ▶️ Run Development Server

### Start Backend

```
cd server
npm run dev
```

### Start Frontend

```
cd client
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login user    |
| GET    | `/api/auth/profile`  | Get profile   |

---

## Stocks

| Method | Endpoint              |
| ------ | --------------------- |
| GET    | `/api/stocks`         |
| GET    | `/api/stocks/:symbol` |

---

## Trading

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/trade/buy`     |
| POST   | `/api/trade/sell`    |
| GET    | `/api/trade/history` |

---

## Portfolio

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | `/api/portfolio` |

---

## Watchlist

| Method | Endpoint                 |
| ------ | ------------------------ |
| GET    | `/api/watchlist`         |
| POST   | `/api/watchlist`         |
| DELETE | `/api/watchlist/:symbol` |

---

## Admin

| Method | Endpoint                          |
| ------ | --------------------------------- |
| GET    | `/api/admin/users`                |
| POST   | `/api/admin/add-stock`            |
| DELETE | `/api/admin/delete-stock/:symbol` |
| PUT    | `/api/admin/users/:id/balance`    |

---

# 🗄 Database Schema

### User

```
name
email
password
role
balance
createdAt
```

---

### Portfolio

```
userId
symbol
quantity
avgPrice
```

---

### Transaction

```
userId
symbol
type
price
quantity
total
createdAt
```

---

### Watchlist

```
userId
symbol
```

---

#  Deployment

## Backend Deployment

Recommended platform:

* Railway


Build command

```
npm install
```

Start command

```
npm start
```

---

## Frontend Deployment

Recommended:

* Vercel

Environment variable:

```
VITE_API_URL=https://your-backend-url/api
```

---
