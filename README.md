# Stock-app
Team Member - 
Leader - Pranjal Patel
Member - Prayag Sahu
Member - Prince Sahu
Member - Pravesh Tiwari


# 📈 SB Stocks — Paper Trading Platform

A **full-stack MERN paper trading simulator** where users can practice stock trading with **$100,000 in virtual money** using real-time US stock market data.

---

## 🚀 Features

- 🔐 **Authentication** — JWT-based register/login with bcrypt password hashing
- 💰 **Virtual Trading** — Buy/sell stocks with $100,000 virtual capital
- 📊 **Real Market Data** — Alpha Vantage API integration (with mock data fallback)
- 💼 **Portfolio Tracking** — Live P&L, average price, and position value
- ⭐ **Watchlist** — Track your favorite stocks
- 📜 **Trade History** — Complete transaction log
- 🌙 **Dark/Light Mode** — Full theme toggle
- 🛡️ **Admin Panel** — Manage users, balances, and tracked stocks
- 📱 **Responsive** — Works on mobile, tablet, and desktop

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Redux Toolkit, Tailwind CSS, Chart.js |
| Backend | Node.js, Express.js, JWT, bcryptjs |
| Database | MongoDB (Mongoose) |
| Stock Data | Alpha Vantage REST API |
| State | Redux Toolkit with async thunks |
| Routing | React Router DOM v6 |
| Notifications | React Toastify |

---

## 📁 Project Structure

```
sb-stocks/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # StockCard, TradeModal, StockChart, Spinner
│   │   │   └── layout/        # Navbar, Layout
│   │   ├── pages/             # Landing, Login, Register, Dashboard...
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/        # authSlice, stockSlice, tradeSlice...
│   │   ├── services/          # Axios API config
│   │   └── utils/             # Helpers (currency, date formatting)
│   └── package.json
│
└── server/                    # Express Backend
    ├── config/                # MongoDB connection
    ├── controllers/           # authController, stockController, tradeController...
    ├── middleware/            # JWT auth, admin middleware
    ├── models/                # User, Transaction, Portfolio, Watchlist
    ├── routes/                # Route definitions
    └── server.js
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free)
- Alpha Vantage API key (free at [alphavantage.co](https://www.alphavantage.co/support/#api-key))

---

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/sb-stocks.git
cd sb-stocks

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

---

### 2. Configure Environment Variables

**Server (`/server/.env`):**

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sb-stocks
JWT_SECRET=your_very_secret_key_minimum_32_chars
JWT_EXPIRE=7d
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client (`/client/.env`):**

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Run Development Servers

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

App runs at: `http://localhost:5173`

---

### 4. Create Admin User

After registering, open MongoDB Atlas and update the user's role field:

```js
// In MongoDB Atlas Data Explorer or Compass:
db.users.updateOne(
  { email: "admin@sbstocks.com" },
  { $set: { role: "admin" } }
)
```

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + get JWT |
| GET | `/api/auth/profile` | Get current user profile |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | Get list of stocks with quotes |
| GET | `/api/stocks/:symbol` | Get stock detail + historical OHLC |

### Trading
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trade/buy` | Buy stock |
| POST | `/api/trade/sell` | Sell stock |
| GET | `/api/trade/history` | Get trade history |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get user portfolio holdings |

### Watchlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get user watchlist |
| POST | `/api/watchlist` | Add symbol to watchlist |
| DELETE | `/api/watchlist/:symbol` | Remove from watchlist |

### Admin (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/stocks` | Get tracked stock list |
| POST | `/api/admin/add-stock` | Add stock to list |
| DELETE | `/api/admin/delete-stock/:symbol` | Remove stock |
| PUT | `/api/admin/users/:id/balance` | Update user balance |

---

## ☁️ Deployment

### Backend → Render

1. Push to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** to `server`
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. Add environment variables in Render dashboard

### Frontend → Vercel

1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `client`
3. **Framework**: Vite
4. Add environment variable:
   - `VITE_API_URL` = `https://your-render-backend.onrender.com/api`
5. Deploy

---

## 🔑 Alpha Vantage API Notes

- Free tier: **25 API calls/day**, **5 calls/minute**
- App automatically falls back to **realistic mock data** when rate limits are hit (shown as "DEMO" badge)
- For production, consider Alpha Vantage premium or an alternative API (Polygon.io, Finnhub)

---

## 🔒 Security Features

- ✅ bcrypt password hashing (salt rounds: 10)
- ✅ JWT authentication with expiry
- ✅ Role-based access control (user/admin)
- ✅ Input validation with express-validator
- ✅ CORS configuration
- ✅ Balance and quantity protection (no negatives)
- ✅ Server-side API key (never exposed to client)

---

## 📦 Database Models

### User
```
name, email, password (hashed), role, balance, createdAt
```

### Transaction
```
userId, symbol, quantity, price, type (BUY/SELL), total, createdAt
```

### Portfolio
```
userId, symbol, quantity, avgPrice
Compound index: (userId + symbol) = unique per user
```

### Watchlist
```
userId, symbol
Compound index: (userId + symbol) = unique per user
```

---

## 📄 License

MIT License — Free to use for educational and personal projects.

---

**Built with ❤️ for aspiring traders.**
