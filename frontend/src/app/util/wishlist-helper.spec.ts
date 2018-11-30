import {splitIntoColumnsVertically} from './wishlist-helper';

describe('splitIntoColumnsVertically', () => {
  it('Split empty list', () => {
    let wishes = [];
    let wishLists = splitIntoColumnsVertically(wishes);
    expect(wishLists).toBe([]);
  });
});
