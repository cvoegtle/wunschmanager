import { Wish } from "../services/wish";

export function splitIntoColumns(wishes: Wish[]) {
  let columnCount = calculateNumberOfColumns();
  let wishLists = [];
  for (let column = 0; column < columnCount; column++) {
    wishLists.push(sliceColumn(wishes, columnCount, column));
  }
  return wishLists;
}

function sliceColumn(wishes: Wish[], columns: number, selectedIndex: number): Wish[] {
  if (!wishes) return [];

  let filteredWishes = [];
  for (let index = 0; index < wishes.length; index++) {
    if ((index % columns) == selectedIndex) {
      filteredWishes.push(wishes[index]);
    }
  }
  return filteredWishes;
}

function calculateNumberOfColumns(): number {
  let columns = Math.trunc(window.innerWidth / 500);
  return Math.max(columns, 1);
}

