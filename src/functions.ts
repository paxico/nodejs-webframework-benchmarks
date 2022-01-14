import assert from 'assert';
import { MongoClient, WithId, Document } from 'mongodb';
import { ISales, ISalesPerson, ISalesSummary } from './interfaces';


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

export const getSalesPersonByFirstName = async (firstName: string): Promise<ISalesPerson | null> => {
  const collection = (await db).collection('salespeople');

  const personDoc = await collection.findOne({ firstName });
  if (personDoc) {
    return { _id: personDoc._id.toHexString(), firstName: personDoc.firstName, lastName: personDoc.lastName };
  }

  return null;
}

export const getSalesByPersonId = async (id: string): Promise<ISales[]> => {
  const collection = (await db).collection('sales');

  const cursor = collection.find({ salesPersonId: id });

  return new Promise<ISales[]>((resolve, reject) => {
    const results: ISales[] = [];

    cursor
      .stream()
      .on('data', (chunk: WithId<Document>) => {
        results.push({
          _id: chunk._id.toHexString(),
          salesPersonId: id,
          productId: chunk.productId,
          amount: chunk.amount
        })
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (e) => {
        reject(e);
      });
  });
}

export const getSalesSummary = async (firstName: string): Promise<ISalesSummary | null> => {
  const salesPerson = await getSalesPersonByFirstName(firstName);

  if (!salesPerson) {
    return null;
  }

  const salesPersonName = `${salesPerson.firstName} ${salesPerson.lastName}`;

  const sales = await getSalesByPersonId(salesPerson._id);

  let total = 0;
  for (const sale of sales) {
    total += sale.amount;
  }

  const average = total / sales.length;

  return { salesPersonName, average, total };
}