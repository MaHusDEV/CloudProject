import { MongoClient, Collection } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing in .env");
}

export const client = new MongoClient(process.env.MONGO_URI);

export async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Connection failed:", err);
    }
}
//bikes collection (products)
export function getProjectCollection(): Collection {
    const db = client.db("project");
    return db.collection("products");
}
// bikeTypes collection 
export function getBikeTypesCollection(): Collection {
    const db = client.db("project");
    return db.collection("bikeTypes");
}
//User collection 
export function getUsersCollection(): Collection{
    const db = client.db("project");
    return db.collection("users");
}
export async function createDefaultUsers() {
  const usersCollection = getUsersCollection();

  const admin = await usersCollection.findOne({ username: "admin" });
  const user = await usersCollection.findOne({ username: "user" });

  if (!admin) {
    await usersCollection.insertOne({
      username: "admin",
      password: await bcrypt.hash("admin", 10),
      role: "ADMIN",
    });
    console.log("Default ADMIN created");
  }

  if (!user) {
    await usersCollection.insertOne({
      username: "user",
      password: await bcrypt.hash("user", 10),
      role: "USER",
    });
    console.log("Default USER created");
  }
}
export{};