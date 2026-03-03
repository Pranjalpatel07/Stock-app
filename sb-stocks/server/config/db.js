// const mongoose = require("mongoose");

// const connectToDB = () => {
//   mongoose
//     .connect("mongodb+srv://prince7z:zibrish@testing.kmrpfyw.mongodb.net/StockApp", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => {
//       console.log("Connected to MONGO DB");
//     })
//     .catch((e) => console.log(`Error in db connection ${e}`));
// };

// module.exports = connectToDB;

const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error in DB connection: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectToDB;