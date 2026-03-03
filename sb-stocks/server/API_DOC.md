# Stock App API Documentation

**Base URL:** `http://localhost:5000/api/`

---

## Stocks

### Get All Stocks
- **Method:** GET
- **Endpoint:** `/stocks`
- **Response:**
```json
{
  "success": true,
  "stocks": [
    {
      "symbol": "AAPL",
      "price": 264.18,
      "open": 272.81,
      "high": 272.81,
      "low": 262.89,
      "previousClose": 272.95,
      "change": -8.77,
      "changePercent": "-3.2130",
      "volume": 72366505,
      "latestTradingDay": "2026-02-27"
    },
    // ...other stocks
  ]
}
```

---

## Trade

### Sell Stock
- **Method:** POST
- **Endpoint:** `/trade/sell`
- **Body:**
```json
{
  "symbol": "AMZN",
  "quantity": 1,
  "price": 20
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Successfully sold 1 shares of AMZN",
  "transaction": {
    "userId": "69a453dd66511f6fac17b15b",
    "symbol": "AMZN",
    "quantity": 1,
    "price": 20,
    "type": "SELL",
    "total": 20,
    "_id": "69a4584566511f6fac17b171",
    "createdAt": "2026-03-01T15:16:21.066Z",
    "updatedAt": "2026-03-01T15:16:21.066Z",
    "__v": 0
  },
  "newBalance": 100000
}
```

### Trade History
- **Method:** GET
- **Endpoint:** `/trade/history`
- **Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "_id": "69a4584566511f6fac17b171",
      "userId": "69a453dd66511f6fac17b15b",
      "symbol": "AMZN",
      "quantity": 1,
      "price": 20,
      "type": "SELL",
      "total": 20,
      "createdAt": "2026-03-01T15:16:21.066Z",
      "updatedAt": "2026-03-01T15:16:21.066Z",
      "__v": 0
    },
    // ...other transactions
  ]
}
```

---

## Watchlist

### Add to Watchlist
- **Method:** POST
- **Endpoint:** `/watchlist`
- **Body:**
```json
{
  "symbol": "GOOGL"
}
```
- **Response:**
```json
{
  "success": true,
  "watchlistItem": {
    "userId": "69a453dd66511f6fac17b15b",
    "symbol": "GOOGL",
    "_id": "69a4598c66511f6fac17b187",
    "createdAt": "2026-03-01T15:21:48.417Z",
    "updatedAt": "2026-03-01T15:21:48.417Z",
    "__v": 0
  }
}
```

### Get Watchlist
- **Method:** GET
- **Endpoint:** `/watchlist`
- **Response:**
```json
{
  "success": true,
  "watchlist": [
    {
      "_id": "69a4598c66511f6fac17b187",
      "userId": "69a453dd66511f6fac17b15b",
      "symbol": "GOOGL",
      "createdAt": "2026-03-01T15:21:48.417Z",
      "updatedAt": "2026-03-01T15:21:48.417Z",
      "__v": 0
    },
    // ...other items
  ]
}
```

### Remove from Watchlist
- **Method:** DELETE
- **Endpoint:** `/watchlist/:symbol`
- **Response:**
```json
{
  "success": true,
  "message": "GOOGL removed from watchlist"
}
```

---

## Admin

### Get All Users
- **Method:** GET
- **Endpoint:** `/admin/users`
- **Response:**
```json
{
  "success": true,
  "users": [
    {
      "_id": "69a453dd66511f6fac17b15b",
      "name": "prince",
      "email": "prince@gmail.com",
      "role": "admin",
      "balance": 100000,
      "createdAt": "2026-03-01T14:57:33.711Z",
      "updatedAt": "2026-03-01T15:16:20.989Z",
      "__v": 0
    }
  ],
  "stats": {
    "userCount": 1,
    "transactionCount": 2
  }
}
```

### Get All Stocks (Admin)
- **Method:** GET
- **Endpoint:** `/admin/stocks`
- **Response:**
```json
{
  "success": true,
  "stocks": [
    "AAPL",
    "GOOGL",
    "MSFT",
    "AMZN",
    "TSLA",
    "META",
    "NVDA",
    "NFLX",
    "AMD",
    "INTC"
  ]
}
```

### Add Stock
- **Method:** POST
- **Endpoint:** `/admin/add-stock`
- **Body:**
```json
{
  "symbol": "HUL"
}
```
- **Response:**
```json
{
  "success": true,
  "stocks": [
    // ...updated stocks list
  ]
}
```

### Delete Stock
- **Method:** DELETE
- **Endpoint:** `/admin/delete-stock/:symbol`
- **Response:**
```json
{
  "success": true,
  "message": "GOOGL removed",
  "stocks": [
    // ...updated stocks list
  ]
}
```

### Update User Balance
- **Method:** PUT
- **Endpoint:** `/admin/users/:userId/balance`
- **Body:**
```json
{
  "balance": 20000
}
```
- **Response:**
```json
{
  "success": true,
  "user": {
    "_id": "69a453dd66511f6fac17b15b",
    "name": "prince",
    "email": "prince@gmail.com",
    "role": "admin",
    "balance": 20000,
    "createdAt": "2026-03-01T14:57:33.711Z",
    "updatedAt": "2026-03-01T15:32:22.836Z",
    "__v": 0
  }
}
```

---

## Notes
- All endpoints require authentication unless otherwise specified.
- Replace `:symbol` and `:userId` with actual values.
- Dates and IDs are for example purposes.