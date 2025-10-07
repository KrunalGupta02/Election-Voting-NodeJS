import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      //? No longer necessary in Mongoose 6.x and later
      useNewUrlParser: true, // Use new MongoDB connection string parser
      useUnifiedTopology: true, // Use new server discovery and monitoring engine
    });

    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectToMongoDB;
