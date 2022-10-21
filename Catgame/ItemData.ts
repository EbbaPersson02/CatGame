import { Item } from "./Items/item";

export class ItemData {
  points: number;
  time: number;
  isOnFire: boolean;
  item: Item | undefined;

  constructor(
    points: number,
    time: number,
    isFire: boolean,
    item: Item | undefined = undefined
  ) {
    this.points = points;
    this.time = time;
    this.isOnFire = isFire;
    this.item = item;
  }
}
