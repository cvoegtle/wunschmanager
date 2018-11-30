import { Wish } from "../services/wish";

export function sort(wishes: Wish[]) {
  wishes.sort(function (a: Wish, b: Wish): number {
    if (a.priority == b.priority) {
      return a.createTimestamp - b.createTimestamp
    } else {
      return b.priority - a.priority;
    }
  })
}

export function splitIntoColumns(wishes: Wish[]) {
  let columnCount = calculateNumberOfColumns();
  let wishLists = [];
  for (let column = 0; column < columnCount; column++) {
    wishLists.push(sliceColumnVertically(wishes, columnCount, column));
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

function sliceColumnVertically(wishes: Wish[], columns: number, selectedIndex: number): Wish[] {
  if (!wishes) return [];

  let indices = calculateIndices(wishes.length, columns, selectedIndex);
  let filteredWishes = [];
  for (let index = indices.start; index < indices.end; index++) {
    filteredWishes.push(wishes[index]);
  }
  return filteredWishes;
}

class Indices {
  start: number;
  end: number
}

function calculateIndices(length: number, columns: number, selectedIndex: number): Indices {
  let columnWidth = Math.round(length / columns + 0.49);
  return {
    start: Math.min(selectedIndex*columnWidth, length),
    end: Math.min(selectedIndex*columnWidth+columnWidth, length)
  }
}

function calculateNumberOfColumns(): number {
  let columns = Math.trunc(window.innerWidth / 500);
  return Math.max(columns, 1);
}

