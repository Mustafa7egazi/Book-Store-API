const mongoose = require("mongoose");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database")
  } catch (error) {
    console.log("Failed to connect database", error);
  }
}


module.exports = {connectToDb};

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to database"))
//   .catch((error) => console.log("Failed to connect database", error));
