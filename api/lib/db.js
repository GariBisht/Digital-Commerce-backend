const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let url = "mongodb://localhost:27017/test"; //for local use cluster for live 
    //let url ="mongodb+srv://garima25081999:ms1t00Gzm2agz5jb@cluster0.alx14.mongodb.net/testside"
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
