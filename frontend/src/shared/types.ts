import { AuthRoles, OrderStatus } from "@shared/enums";

export type AnyRecord<T = any> = Record<string, T>;

export interface Error {
  data: {
    message: string;
    status: number;
  };
}
export interface User {
  _id: string;
  role: AuthRoles;
  email: string;
  name: string;
}
export interface Meal {
  _id: string;
  name: string;
  user: string;
  maxFoodItemCount: number;
}
export interface FoodEntry {
  _id: string;
  name: string;
  calorie: number;
  date: string;
  meal: Pick<Meal, "_id" | "name"> | string;
}

export type ProductImage = {
  public_id: string;
  url: string;
};
export interface Product {
  category: string;
  children: string[];
  createdAt: string;
  description: string;
  saleDescription: string;
  images: ProductImage[];
  isSale: boolean;
  isSpecial: boolean;
  maxOrderQuantity: number;
  minOrderQuantity: number;
  color: string | null;
  price: number;
  specialPrice: number | null;
  productName: string;
  quantity: number;
  size: string | null;
  serialNo: string;
  placement: string;
  subCategory: string;
  updatedAt: string;
  vendorId: string;
  parent: {
    label: string;
    value: string;
  } | null;
  _id: string;
}
export interface CustomerId {
  _id: string;
  email: string;
  active: boolean;
}
export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  percentDiscount: number;
  phoneNumber: string;
  companyName: string;
  address: string;
  bnNumber: string;
  password?: string;
  customerId?: CustomerId;
}
export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  unit: number;
  images: string[];
}
export interface Buyer {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  mobile: string;
  address: string;
}
export interface Order {
  _id: string;
  customerId: CustomerId;
  vendorId: string;
  orderStatus: OrderStatus;
  createdAt: string;
  orderDetails: {
    items: OrderItem[];
    buyer: Buyer;
    seller: Pick<
      Customer,
      "_id" | "firstName" | "lastName" | "phoneNumber" | "companyName"
    >;
    percentDiscount: number;
  };
}
