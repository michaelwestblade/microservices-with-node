import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => string[];
}

const JWT_KEY = process.env.JWT_KEY || "";

global.signin = () => {
  // Build a JWT payload. { id, email }
  const payload = { id: "1234567890", email: "test@test.com" };

  // Create the JWT
  const token = jwt.sign(payload, JWT_KEY);

  // Build session Object {}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJson = JSON.stringify(session);

  // Take JSON and encode as base64
  const base64 = Buffer.from(sessionJson).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};

let mongo: MongoMemoryServer;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
