const  Transaction  = require("../models/transactionModel.js");
const User = require("../models/userModel.js");

 const deposit = async (req, res) => {
  // app.post('/deposit', async(req, res)=>{
  const { user, depositAmount, depositMode } = req.body;
  try {
    const userData = await User.findById(user);
    if (!userData) {
      res.status(500).json({ message: "error occured" });
    }
    const transaction = new Transaction({
      user: user,
      type: "Deposit",
      paymentMode: depositMode,
      amount: depositAmount,
      time: new Date(),
    });

    await transaction.save();

    userData.balance = parseInt(userData.balance) + parseInt(depositAmount);
    await userData.save();

    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: "error occured" });
  }
  // });
};

 const withdraw = async (req, res) => {
  // app.post("/withdraw", async (req, res) => {
    const { user, withdrawAmount, withdrawMode } = req.body;
    try {
      const userData = await User.findById(user);
      if (!userData) {
        res.status(500).json({ message: "error occured" });
      }
      if (userData.balance < withdrawAmount) {
        res.status(500).json({ message: "error occured" });
      }
      const transaction = new Transaction({
        user: user,
        type: "Withdraw",
        paymentMode: withdrawMode,
        amount: withdrawAmount,
        time: new Date(),
      });

      await transaction.save();

      userData.balance = parseInt(userData.balance) - parseInt(withdrawAmount);
      await userData.save();

      res.json(userData);
    } catch (err) {
      res.status(500).json({ message: "error occured" });
    }
  // });
};

 const transactions = async (req, res) => {
  // app.get('/transactions', async(req, res)=>{
  try {
    const transactions = await Transaction.find();

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "error occured" });
  }
  // })
};

 const getTransactionById = async (req, res) => {
  // app.get('/transactions/:id', async(req, res)=>{
  try {
    const transactions = await Transaction.find({ user: req.params.id });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "error occured" });
  }
  // })
};


module.exports = {
  getTransactionById,
  deposit,
  withdraw,
  transactions
}