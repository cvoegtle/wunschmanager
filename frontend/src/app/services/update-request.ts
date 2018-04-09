import { Wish } from "./wish";

export interface UpdateRequest {
  listId: number;
  wish: Wish;
}
