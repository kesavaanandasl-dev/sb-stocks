import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let memoryServer = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  try {
    let mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sb-stocks';
    
    // If USE_MEMORY_DB is explicitly set to true, use mongodb-memory-server for zero-setup execution
    if (process.env.USE_MEMORY_DB === 'true') {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      mongoURI = memoryServer.getUri();
      console.log('⚡ [DB] Using In-Memory MongoDB Server for fast zero-setup development');
    } else {
      // Try connecting to provided URI, fallback to in-memory if local MongoDB isn't running
      try {
        const conn = await mongoose.connect(mongoURI, {
          serverSelectionTimeoutMS: 3000
        });
        console.log(`✅ [DB] Connected to MongoDB: ${conn.connection.host}`);
        console.log(`===================================================================`);
        console.log(`📡 [DB] COPY THIS URI INTO MONGODB COMPASS TO VIEW ALL DATA:`);
        console.log(`👉  ${mongoURI}`);
        console.log(`===================================================================`);
        return conn;
      } catch (err) {
        console.warn('⚠️ [DB] Standard MongoDB connection failed. Falling back to In-Memory MongoDB Server...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        mongoURI = memoryServer.getUri();
        console.log(`📡 [DB] COMPASS CONNECTION URI: ${mongoURI}`);
      }
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ [DB] Connected to MongoDB: ${conn.connection.host}`);
    console.log(`===================================================================`);
    console.log(`📡 [DB] COPY THIS URI INTO MONGODB COMPASS TO VIEW ALL DATA:`);
    console.log(`👉  ${mongoURI}`);
    console.log(`===================================================================`);
    return conn;
  } catch (error) {
    console.error(`❌ [DB] Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
