import { ISalesPerson, IProduct, ISales } from '../interfaces';
import assert from 'assert';
import { MongoClient } from 'mongodb';


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


const generateSalesPeople = async () => {
  const collection = (await db).collection('salespeople');

  const items = [
    { firstName: 'Bob', lastName: 'Bobby' },
    { firstName: 'Sally', lastName: 'Smith' },
    { firstName: 'Carlos', lastName: 'Santana' }
  ]

  const results = await Promise.all(items.map((i) => collection.insertOne(i)));

  return results.map((doc, index) => {
    return { _id: doc.insertedId.toHexString(), ...items[index] } as ISalesPerson
  });
}

const generateProducts = async () => {
  const collection = (await db).collection('products');

  const items = [
    { name: 'GSX 10000', msrp: 2000 },
    { name: 'PS5', msrp: 500 },
    { name: 'XBOX5000', msrp: 800 }
  ]

  const results = await Promise.all(items.map((i) => collection.insertOne(i)));

  return results.map((doc, index) => {
    return { _id: doc.insertedId.toHexString(), ...items[index] } as IProduct;
  });
}

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const generateSales = async (products: IProduct[], people: ISalesPerson[], count: number) => {
  const collection = (await db).collection('sales');

  let promises = [];

  for (let i = 0; i < count; i++) {
    const person = people[random(0, people.length - 1)];
    const product = products[random(0, products.length - 1)];
    promises.push([collection.insertOne({ salesPersonId: person._id, productId: product._id, amount: random(product.msrp, product.msrp + 200) })]);

    if (promises.length >= 100) {
      await Promise.all(promises);
      promises = [];
    }
  }
};


(async () => {
  const people = await generateSalesPeople();
  const products = await generateProducts();
  
  await generateSales(products, people, 1000);
})();