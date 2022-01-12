export interface ISalesPerson {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface ISalesSummary {
  salesPersonName: string;
  monthlyAverage: number;
  total: number;
}

export interface ISales {
  _id: string;
  salesPersonId: string;
  productId: string;
  amount: number;
}

export interface IProduct {
  _id: string;
  name: string;
  msrp: number;
}
