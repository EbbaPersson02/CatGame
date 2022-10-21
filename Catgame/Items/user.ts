import { Item } from "./item";

export class User extends Item {
  constructor(yPos: number, xPos: number, symbol: string) {
    super(yPos, xPos, symbol);
  }
}
