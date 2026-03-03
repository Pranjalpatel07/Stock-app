// const Order = require("../models/orderSchema.js");
// const Stock = require("../models/stockSchema.js");
// const User = require("../models/userModel.js");

// const buyStock = async (req, res) => {
//   const { user, symbol, name, stockType, stockExchange, price, count, totalPrice } = req.body;
//   try {
//     const stock = await Stock.findOne({ user: user, symbol }); // FIX: was { _id: user, symbol }
//     const userData = await User.findById(user);

//     if (!userData) return res.status(404).json({ message: "User not found" });

//     if (parseInt(userData.balance) >= parseInt(totalPrice)) {
//       if (stock) {
//         stock.price =
//           (parseInt(stock.price) * parseInt(stock.count) + parseInt(price) * parseInt(count)) /
//           (parseInt(stock.count) + parseInt(count));
//         stock.count = parseInt(stock.count) + parseInt(count);
//         stock.totalPrice = parseInt(stock.totalPrice) + parseInt(totalPrice);
//         await stock.save();
//       } else {
//         const newStock = new Stock({
//           user,
//           symbol,
//           name,
//           price,
//           count,
//           totalPrice,
//           stockExchange,
//         });
//         await newStock.save();
//       }
//       userData.balance = parseInt(userData.balance) - parseInt(totalPrice);
//       await userData.save();

//       const newOrder = new Order({
//         user,
//         symbol,
//         name,
//         stockType,
//         price,
//         count,
//         totalPrice,
//         orderType: "Buy",
//         orderStatus: "Completed",
//       });
//       await newOrder.save();
//       res.status(201).json({ message: "success" });
//     } else {
//       res.status(400).json({ message: "Insufficient balance" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "error occured" });
//   }
// };

// const sellStock = async (req, res) => {
//   const { user, symbol, name, stockType, price, count, totalPrice } = req.body;
//   try {
//     const stock = await Stock.findOne({ user: user, symbol });
//     const userData = await User.findById(user);

//     if (!userData) return res.status(404).json({ message: "User not found" });

//     if (stock) {
//       if (parseInt(stock.count) > parseInt(count)) {
//         stock.count = parseInt(stock.count) - parseInt(count);
//         stock.totalPrice = parseInt(stock.totalPrice) - parseInt(totalPrice);
//         await stock.save();
//       } else if (parseInt(stock.count) === parseInt(count)) {
//         await Stock.deleteOne({ user: user, symbol });
//       } else {
//         return res.status(400).json({ message: "Cannot sell more than you own" });
//       }
//       userData.balance = parseInt(userData.balance) + parseInt(totalPrice); // FIX: was missing when count === count
//       await userData.save();
//     } else {
//       return res.status(404).json({ message: "No stocks found" });
//     }

//     const newOrder = new Order({
//       user,
//       symbol,
//       name,
//       stockType,
//       price,
//       count,
//       totalPrice,
//       orderType: "Sell",
//       orderStatus: "Completed",
//     });
//     await newOrder.save();
//     res.status(201).json({ message: "success" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "error occured" });
//   }
// };

// const fetchStocks = async (req, res) => {
//   try {
//     const stocks = await Stock.find();
//     res.json(stocks);
//   } catch (err) {
//     res.status(500).json({ message: "error occured" });
//   }
// };

// module.exports = {
//   buyStock,
//   sellStock,
//   fetchStocks,
// };


const Order = require("../models/orderSchema.js");
const Stock = require("../models/stockSchema.js");
const User = require("../models/userModel.js");

const buyStock = async (req, res) => {
  const { user, symbol, name, stockType, stockExchange, price, count, totalPrice } = req.body;
  try {
    const stock = await Stock.findOne({ user: user, symbol }); // FIX: was { _id: user, symbol }
    const userData = await User.findById(user);

    if (!userData) return res.status(404).json({ message: "User not found" });

    if (parseInt(userData.balance) >= parseInt(totalPrice)) {
      if (stock) {
        stock.price =
          (parseInt(stock.price) * parseInt(stock.count) + parseInt(price) * parseInt(count)) /
          (parseInt(stock.count) + parseInt(count));
        stock.count = parseInt(stock.count) + parseInt(count);
        stock.totalPrice = parseInt(stock.totalPrice) + parseInt(totalPrice);
        await stock.save();
      } else {
        const newStock = new Stock({
          user,
          symbol,
          name,
          price,
          count,
          totalPrice,
          stockExchange,
        });
        await newStock.save();
      }
      userData.balance = parseInt(userData.balance) - parseInt(totalPrice);
      await userData.save();

      const newOrder = new Order({
        user,
        symbol,
        name,
        stockType,
        price,
        count,
        totalPrice,
        orderType: "Buy",
        orderStatus: "Completed",
      });
      await newOrder.save();
      res.status(201).json({ message: "success" });
    } else {
      res.status(400).json({ message: "Insufficient balance" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error occured" });
  }
};

const sellStock = async (req, res) => {
  const { user, symbol, name, stockType, price, count, totalPrice } = req.body;
  try {
    const stock = await Stock.findOne({ user: user, symbol });
    const userData = await User.findById(user);

    if (!userData) return res.status(404).json({ message: "User not found" });

    if (stock) {
      if (parseInt(stock.count) > parseInt(count)) {
        stock.count = parseInt(stock.count) - parseInt(count);
        stock.totalPrice = parseInt(stock.totalPrice) - parseInt(totalPrice);
        await stock.save();
      } else if (parseInt(stock.count) === parseInt(count)) {
        await Stock.deleteOne({ user: user, symbol });
      } else {
        return res.status(400).json({ message: "Cannot sell more than you own" });
      }
      userData.balance = parseInt(userData.balance) + parseInt(totalPrice); // FIX: was missing when count === count
      await userData.save();
    } else {
      return res.status(404).json({ message: "No stocks found" });
    }

    const newOrder = new Order({
      user,
      symbol,
      name,
      stockType,
      price,
      count,
      totalPrice,
      orderType: "Sell",
      orderStatus: "Completed",
    });
    await newOrder.save();
    res.status(201).json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error occured" });
  }
};

const fetchStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: "error occured" });
  }
};

module.exports = {
  buyStock,
  sellStock,
  fetchStocks,
};
