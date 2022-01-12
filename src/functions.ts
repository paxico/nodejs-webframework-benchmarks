import assert from 'assert';
import { MongoClient } from 'mongodb';
import { ISalesPerson, ISalesSummary } from './interfaces';


assert(process.env.MONGODB_URI, 'missing env var MONGODB_URI');

const { MONGODB_URI } = process.env;

const db = new MongoClient(MONGODB_URI)
  .connect()
  .then((conn) => {
    return conn.db('sales')
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

const getSalesPersonByFirstName = async (firstName: string): Promise<ISalesPerson | null> => {
  const collection = (await db).collection('salespeople');

  const personDoc = await collection.findOne({ firstName });
  if (personDoc) {
    return { _id: personDoc._id.toHexString(), firstName: personDoc.firstName, lastName: personDoc.lastName };
  }

  return null;
}

const getSalesSummary = async (firstName: string): Promise<ISalesSummary | null> => {
  const salesPerson = await getSalesPersonByFirstName(firstName);
  
}