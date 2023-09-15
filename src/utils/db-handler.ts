const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');


let mongo:any
export const getConnectionURI = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  return uri;
};

export const connect = async () => {
  const uri = mongo.getUri();
  await mongoose.connect(uri);
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};