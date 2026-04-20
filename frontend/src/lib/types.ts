export interface Category {
  _id: string;
  name: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  unit: string;
  packSize: string;
  price: number;
  stock: number;
  minQty: number;
  image: string;
  category: Category;
}

export interface User {
  _id: string;
  name: string;
  phone: string;
  role: "owner" | "retailer" | "worker";
  token?: string;
}