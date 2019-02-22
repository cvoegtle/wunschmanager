export interface Wish {
  id: number;
  caption: string;
  description: string;
  link: string;
  donor: string;
  createTimestamp: number;
  priority: number; // higher is better
  background: string;
  invisible: boolean;

  selected: boolean;
  highlighted: boolean;
}

export function isAvailable(wish: Wish): boolean {
  return wish.donor == null && !wish.invisible;
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

export function highlight(wishes: Wish[], index: number): void {
  for (let i = 0; i < wishes.length; i++) {
    wishes[i].highlighted = i == index;
  }
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
