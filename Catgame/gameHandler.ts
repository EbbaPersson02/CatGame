import * as readline from "readline";
import { User } from "./Items/user";
import { Grid } from "./grid";
import { ItemHandler } from "./itemHandler";

export class GameHandler {
  rl: readline.Interface;
  seconds: number;
  board: Grid;
  points: number;
  startSymbol: string;
  itemHandler: ItemHandler;
  interval: NodeJS.Timer;
  userOnFire: boolean;

  constructor(height: number, width: number, symbol: string) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.seconds = 60;
    this.board = new Grid(height, width);
    this.points = 0;
    this.startSymbol = "🎄";
    let redBalls = 5;
    let greenBalls = 10;
    this.itemHandler = new ItemHandler(
      height,
      width,
      new User(height / 2, width / 2, symbol),
      redBalls,
      greenBalls
    );
    this.interval = this.startTimer();
    this.userOnFire = false;
  }

  startGame() {
    this.initGrid();
    this.onMove();
  }

  initGrid() {
    this.itemHandler.items.forEach((ball) => {
      this.board.grid[ball.yPos][ball.xPos] = ball.symbol;
    });
    this.board.grid[this.itemHandler.user.yPos][this.itemHandler.user.xPos] =
      this.startSymbol;
  }

  startTimer() {
    this.interval = setInterval(() => {
      this.seconds--;
      this.logUi();
      if (this.seconds < 1) {
        clearInterval(this.interval);
        console.log("Tiden är ute!");
        this.rl.close();
      }
    }, 1000);
    return this.interval;
  }

  onMove() {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.on("keypress", (chunk, key) => {
      this.board.grid[this.itemHandler.user.yPos][this.itemHandler.user.xPos] =
        "  ";

      if (key.name === "right") {
        this.itemHandler.user.xPos = this.getNewPosition(
          this.itemHandler.user.xPos + 1,
          this.board.width
        );
      } else if (key.name === "left") {
        this.itemHandler.user.xPos = this.getNewPosition(
          this.itemHandler.user.xPos - 1,
          this.board.width
        );
      } else if (key.name === "up") {
        this.itemHandler.user.yPos = this.getNewPosition(
          this.itemHandler.user.yPos - 1,
          this.board.height
        );
      } else if (key.name === "down") {
        this.itemHandler.user.yPos = this.getNewPosition(
          this.itemHandler.user.yPos + 1,
          this.board.height
        );
      }

      let itemData = this.itemHandler.getItemDataFromPos(
        this.itemHandler.user.yPos,
        this.itemHandler.user.xPos
      );

      this.seconds += itemData.time;
      this.points += itemData.points;
      this.userOnFire = itemData.isOnFire;

      if (itemData.item != undefined) {
        this.board.grid[itemData.item?.yPos][itemData.item?.xPos] =
          itemData.item?.symbol;
      }

      this.board.grid[this.itemHandler.user.yPos][this.itemHandler.user.xPos] =
        this.itemHandler.user.symbol;

      this.logUi();
      this.terminateGame();
      this.checkVictory();
    });
  }

  getNewPosition(position: number, edge: number): number {
    if (position === edge) {
      return 0;
    } else if (position === -1) {
      return edge - 1;
    } else return position;
  }

  logUi() {
    console.clear();
    console.log("Tid kvar: " + this.seconds);
    console.log("Poäng: " + this.points);
    console.log(this.printGrid());
  }

  printGrid(): string {
    let plats: string = "";
    for (let y = 0; y < this.board.height; y++) {
      for (let x = 0; x < this.board.width; x++) {
        plats += this.board.grid[y][x];
      }
      plats += "\r\n";
    }
    return plats;
  }

  terminateGame() {
    if (this.userOnFire) {
      clearInterval(this.interval);
      console.log("GAME OVER!!!");
      this.rl.close();
    }
  }

  checkVictory() {
    if (this.itemHandler.checkVictory() == true) {
      clearInterval(this.interval);
      console.log("DU VANN!!!");
      this.rl.close();
    }
  }
}

new GameHandler(20, 40, "😼").startGame();
