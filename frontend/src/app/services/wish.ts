import { WishIds } from "./wish-copy-task";

export interface Wish {
  id: number;
  caption: string;
  groupGift: boolean;
  estimatedPrice: number;
  suggestedParticipation: number;
  description: string;
  link: string;
  alternateLinks: string[];
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

class WishImpl implements Wish {
  constructor(wish: Wish) {
    this.id = wish.id;
    this.caption = wish.caption;
    this.groupGift = wish.groupGift;
    this.estimatedPrice = wish.estimatedPrice;
    this.suggestedParticipation = wish.suggestedParticipation;
    this.description = wish.description;
    this.link = wish.link;
    this.alternateLinks = wish.alternateLinks;
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
  alternateLinks: string[] = [];
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

export function copyWish(wish: Wish): Wish {
  if (wish != null) {
    let copy = new WishImpl(wish);
    removeEmptyLinks(copy);
    return copy;
  }
  return null;
}

export function copyDonationInformation(target: Wish, source: Wish) {
  target.groupGift = source.groupGift;
  target.estimatedPrice = source.estimatedPrice;
  target.suggestedParticipation = source.suggestedParticipation;
  target.donations = source.donations;
}

export function isAvailable(wish: Wish): boolean {
  return (wish.donations.length == 0 || isGroupGifOpenForParticipation(wish)) && !wish.invisible;
}

export function isGroupGifOpenForParticipation(wish: Wish): boolean {
  return wish.groupGift && (donationOpenParticipation(wish) > 0 || wish.estimatedPrice == null);
}

export function isReservedByUser(wish: Wish, user: string) {
  for (let index in wish.donations) {
    if (wish.donations[index].donor == user || wish.donations[index].proxyDonor == user) {
      return true;
    }
  }
  return false;
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

export function donationTotalParticipation(wish: Wish): number {
  let total:number = 0;
  for (let index in wish.donations) {
    if (wish.donations[index].amount) {
      total += wish.donations[index].amount;
    }
  }
  return total;
}

export function donationOpenParticipation(wish: Wish): number {
  let open: number = 0;

  if (wish.estimatedPrice) {
    open = wish.estimatedPrice - donationTotalParticipation(wish);
  }

  return open;
}

export function reduceToOneEmptyLink(wish: Wish) {
  removeEmptyLinks(wish);
  if (wish.link) {
    wish.alternateLinks.push("");
  }
}

export function removeEmptyLinks(wish: Wish) {
  wish.alternateLinks=wish.alternateLinks.filter(function(link, index, links) {
    return link != null && link.trim() != "";
  })

  if (wish.link == null || wish.link.trim() == "" && wish.alternateLinks.length > 0) {
    wish.link = wish.alternateLinks[0];
    wish.alternateLinks.shift();
  }
}
