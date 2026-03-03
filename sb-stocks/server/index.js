const express = require("express");
const bodyParser = require("body-parser");
const connectToDB  = require("./config/db.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoute.js");
const transactionRoutes = require("./routes/transactionRoute.js");
const orderRoutes = require("./routes/orderRoute.js");
const stockRoutes = require("./routes/stockRoute.js");
require("dotenv").config();


const app = express();
connectToDB()
app.use(cookieParser())

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use([userRoutes, transactionRoutes, orderRoutes, stockRoutes])

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` SB Stocks Server running on port ${PORT}`);
});
