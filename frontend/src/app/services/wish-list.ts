
export interface WishList {
  id: number;
  owner: string;
  event: string;
  description: string;
  managed: boolean;
  background: string;
}

export class WishListImpl implements WishList {
  background: string;
  description: string;
  event: string;
  id: number;
  managed: boolean;
  owner: string;

  public copy(source: WishList) {
    this.background = source.background;
    this.description = source.description;
    this.event = source.event;
    this.managed = source.managed;
  }
}
