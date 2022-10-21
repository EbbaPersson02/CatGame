import { Item } from "./item";

export class Fire extends Item {
  constructor(yPos: number, xPos: number, point: number) {
    super(yPos, xPos, "🔥");
  }
}
