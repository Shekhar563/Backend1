import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv'

dotenv.config({
        path: './.env'
})


connectDB()
  .then(() => {
    app.listen(process.env.PORT , () => {
      console.log(`🚀 Server is running on port: ${process.env.PORT || 8084}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB connection failed!", err);
  });