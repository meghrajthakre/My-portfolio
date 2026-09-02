import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      const serverUrl = `http://localhost:${port}`;

      console.log(`
╭──────────────────────────────────────────╮
│  🚀 MT Portfolio API is up and running!  │
├──────────────────────────────────────────┤
│  🌐 ${serverUrl.padEnd(36)} │
│  ✅ Database connected successfully      │
╰──────────────────────────────────────────╯
      `);
    });
  } catch (error) {
    console.error(`\n❌ Unable to start the server\n   ${error.message}\n`);
    process.exit(1);
  }
};

startServer();
