import { Ball, GreenBall, RedBall } from "./Items/ball";
import { Gift } from "./Items/gift";
import { Disease } from "./Items/disease";
import { User } from "./Items/user";
import { Item } from "./Items/item";
import { ItemData } from "./ItemData";
import { Fire } from "./Items/fire";

export class ItemHandler {
  items: Array<Item>;
  private gameHeight: number;
  private gameWidth: number;
  user: User;

  constructor(
    gameHeight: number,
    gameWidth: number,
    user: User,
    redBallCount: number,
    greenBallCount: number
  ) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.user = user;
    this.items = [];
    this.items = this.initBalls(redBallCount, greenBallCount);
  }

  private initBalls(redBallCount: number, greenBallCount: number) {
    for (let index = 0; index < redBallCount; index++) {
      let validPos = this.getValidRandomPosition(
        this.gameHeight,
        this.gameWidth
      );
      this.items.push(new RedBall(validPos[0], validPos[1]));
    }

    for (let index = 0; index < greenBallCount; index++) {
      let validPos = this.getValidRandomPosition(
        this.gameHeight,
        this.gameWidth
      );
      this.items.push(new GreenBall(validPos[0], validPos[1]));
    }
    return this.items;
  }

  private getValidRandomPosition(
    gameHeight: number,
    gameWidth: number
  ): [number, number] {
    let yPos = Math.floor(Math.random() * gameHeight);
    let xPos = Math.floor(Math.random() * gameWidth);

    if (yPos == this.user.yPos && xPos == this.user.xPos) {
      this.getValidRandomPosition(gameHeight, gameWidth);
    }

    this.items.forEach((item) => {
      if (yPos === item.yPos && xPos === item.xPos) {
        this.getValidRandomPosition(gameHeight, gameWidth);
      }
    });
    return [yPos, xPos];
  }

  getItemDataFromPos(yPos: number, xPos: number): ItemData {
    let points = 0;
    let time = 0;
    let isOnFire = false;
    let randomizeItem: Item | undefined = undefined;

    for (let index = 0; index < this.items.length; index++) {
      let currentItem = this.items[index];
      let itemYPos = currentItem.yPos;
      let itemXPos = currentItem.xPos;

      if (itemYPos == yPos && itemXPos == xPos) {
        let item = this.items[index];
        if (item instanceof Ball) {
          points = item.points;
          this.items.splice(index, 1);
          randomizeItem = this.randomizeItem();
          if (randomizeItem != undefined) {
            this.items.push(randomizeItem);
          }
        }
        if (item instanceof Disease) {
          time = item.time;
          this.items.splice(index, 1);
        }
        if (item instanceof Gift) {
          time = item.time;
          this.items.splice(index, 1);
        }
        if (item instanceof Fire) {
          isOnFire = true;
        }
      }
    }
    return new ItemData(points, time, isOnFire, randomizeItem);
  }

  randomizeItem(): Item | undefined {
    if (Math.random() < 0.8) {
      let position = this.getValidRandomPosition(
        this.gameHeight,
        this.gameWidth
      );

      if (Math.random() < 0.5) {
        if (Math.random() < 0.5) {
          return new RedBall(position[0], position[1]);
        } else {
          return new GreenBall(position[0], position[1]);
        }
      } else {
        if (Math.random() < 0.8) {
          if (Math.random() < 0.5) {
            return new Gift(position[0], position[1]);
          } else {
            return new Disease(position[0], position[1]);
          }
        } else {
          return new Fire(position[0], position[1], 3);
        }
      }
    } else return undefined;
  }

  checkVictory() {
    for (let index = 0; index < this.items.length; index++) {
      let item = this.items[index];
      if (item instanceof Ball) {
        return false;
      }
    }
    return true;
  }
}
