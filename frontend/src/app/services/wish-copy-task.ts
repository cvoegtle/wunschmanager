import { Wish } from "./wish";

export class WishIds {
  sourceListId: number;
  wishIds: number[];
}

export class WishCopyTask {
  destinationListId: number;
  wishes: WishIds[];
}

export function singularOrPluralWish(count: number): String {
  return count == 1 ? "Ein Wunsch" : `${count} Wünsche`;
}

export function extractWishIds(sourceListId: number, wishes: Wish[]): WishIds {
  let wishIds = new WishIds();
  wishIds.sourceListId = sourceListId;
  wishIds.wishIds = [];

  for (let index = 0; index < wishes.length; index++) {
    let wish = wishes[index];
    if (wish.selected) {
      wishIds.wishIds.push(wish.id);
    }
  }
  return wishIds;
}
