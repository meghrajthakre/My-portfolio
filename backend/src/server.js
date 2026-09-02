import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
