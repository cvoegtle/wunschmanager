import { WishIds } from "./wish-copy-task";

export interface Wish {
  id: number;
  caption: string;
  groupGift: boolean;
  estimatedPrice: number;
  suggestedParticipation: number;
  description: string;
  link: string;
  donor: string;
  proxyDonor: string
  createTimestamp: number;
  priority: number; // higher is better
  background: string;
  invisible: boolean;

  selected: boolean;
  highlighted: boolean;

  donations: Donation[];
}

export interface Donation {
  donor: string;
  proxyDonor: string;
  organiser: boolean;
  amount: number
}

export class DonationImpl implements Donation{
  donor: string;
  proxyDonor: string;
  organiser: boolean;
  amount: number
}

export class WishImpl implements Wish {
  constructor(wish: Wish) {
    this.id = wish.id;
    this.caption = wish.caption;
    this.groupGift = wish.groupGift;
    this.estimatedPrice = wish.estimatedPrice;
    this.suggestedParticipation = wish.estimatedPrice;
    this.description = wish.description;
    this.link = wish.link;
    this.createTimestamp = wish.createTimestamp;
    this.priority = wish.priority;
    this.background = wish.background;
    this.invisible = wish.invisible
  }

  id: number;
  caption: string;
  groupGift: boolean;
  estimatedPrice: number;
  suggestedParticipation: number;
  description: string;
  link: string;
  donor: string;
  proxyDonor: string
  createTimestamp: number;
  priority: number; // higher is better
  background: string;
  invisible: boolean;

  selected: boolean;
  highlighted: boolean;

  donations: Donation[] = [];
}

export function isAvailable(wish: Wish): boolean {
  return wish.donations.length == 0 && !wish.invisible;
}

export function containsSelectedWish(wishes: Wish[]) {
  if (wishes) {
    for (let wish of wishes) {
      if (wish.selected) {
        return true;
      }
    }
  }
  return false
}

export function removeWishSelection(wishes: Wish[]) {
  if (wishes) {
    for (let wish of wishes) {
      wish.selected = false;
    }
  }
}

export function adjustPriority2Order(wishes: Wish[]) {
  let currentPriority = wishes.length;
  for (let wish of wishes) {
    wish.priority = currentPriority--;
  }
}

export function highlightByIndex(wishes: Wish[], index: number): void {
  for (let i = 0; i < wishes.length; i++) {
    wishes[i].highlighted = i == index;
  }
}

export function highlightNewIds(wishes: Wish[], oldIds: number[]): void {
  for (let i = 0; i < wishes.length; i++) {
    wishes[i].highlighted = !oldIds.includes(wishes[i].id);
  }
}

export function extractIds(wishes: Wish[]): number[] {
  let ids: number[] = [];
  for (let i = 0; i < wishes.length; i++) {
    ids.push(wishes[i].id);
  }
  return ids;
}

export function clearHighlight(wishes: Wish[]) {
  for (let i = 0; i < wishes.length; i++) {
    wishes[i].highlighted = false;
  }
}

export function countSelection(wishes: Wish[]): number {
  let count = 0;
  if (wishes) {
    for (let wish of wishes) {
      if (wish.selected) {
        count++;
      }
    }
  }
  return count;
}
