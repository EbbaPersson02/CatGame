import { Item } from "./item";

export class Disease extends Item {
  time: number;

  constructor(yPos: number, xPos: number) {
    super(yPos, xPos, "🦠");
    this.time = -5;
  }
}
