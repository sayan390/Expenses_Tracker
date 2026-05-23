import mongoose from "mongoose";

import dns from 'dns';

dns.setServers(["1.1.1.1","8.8.8.8"]);

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://nandisayan32_db_user:icE5L62Jh46nUTe6@cluster0.6n64san.mongodb.net/Expenses")
    .then(() => console.log("DB CONNECTED..."));
}