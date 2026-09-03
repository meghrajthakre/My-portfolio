import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to backend/.env");
  }

  const connection = await mongoose.connect(mongoUri, {
    dbName: "portfolioData",
  });
  console.log(
    `MongoDB connected: ${connection.connection.host}/${connection.connection.name}`,
  );
};
