import { Wish } from "./wish";

export interface WishOrder {
  id: number;
  priority: number; // higher is better
}

export function convertToWishOrder(wishes: Wish[]): WishOrder[] {
  let orders = [];
  for (let wish of wishes) {
    orders.push ({
      id:  wish.id,
      priority: wish.priority
    });
  }
  return orders;
}

