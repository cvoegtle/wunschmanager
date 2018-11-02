import { ifTrue } from "codelyzer/util/function";

export interface Wish {
  id: number;
  caption: string;
  description: string;
  link: string;
  donor: string;
  priority: number; // higher is better
  background: string;
  invisible: boolean;

  selected: boolean;
}

export function isAvailable(wish: Wish): boolean {
  return wish.donor == null && !wish.invisible;
}

export function containsSelectedWish(wishes: Wish[]) {
  if (wishes) {
    for (let index = 0; index < wishes.length; index++) {
      if (wishes[index].selected) {
        return true;
      }
    }
  }
  return false
}

export function removeWishSelection(wishes: Wish[]) {
  if (wishes) {
    for (let index = 0; index < wishes.length; index++) {
      wishes[index].selected = false;
    }
  }

}
