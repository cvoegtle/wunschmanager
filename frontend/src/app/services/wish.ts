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
