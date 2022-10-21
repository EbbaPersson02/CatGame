import { Item } from "./item";

export class Ball extends Item {
  points: number;

  constructor(yPos: number, xPos: number, point: number, symbol: string) {
    super(yPos, xPos, symbol);
    this.points = point;
  }
}

export class RedBall extends Ball {
  constructor(yPos: number, xPos: number) {
    super(yPos, xPos, 1, "🔴");
  }
}

export class GreenBall extends Ball {
  constructor(yPos: number, xPos: number) {
    super(yPos, xPos, 2, "🟢");
  }
}
