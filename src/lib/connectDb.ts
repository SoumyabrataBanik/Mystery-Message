import mongoose, { ConnectionStates } from "mongoose";

type ConnectionObject = {
    isConnected?: ConnectionStates;
};

const connection: ConnectionObject = {};

async function connectDb(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        connection.isConnected = db.connections[0].readyState;

        console.log("Database connected successfully");
    } catch (error) {
        console.log("Could not connect to database", error);
        process.exit(1);
    }
}

export default connectDb;
