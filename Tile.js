import { styleMap } from './TileStyle.js';

export default class Tile {

  constructor(ctx, number, row, col, x = 0, y = 0, w = 100, h = 100) {
    this.ctx = ctx;
    this.number = number;
    this.scale = this.ctx.scale2048;

    this.x = x * this.scale;
    this.y = y * this.scale;
    this.w = w * this.scale;
    this.h = h * this.scale;

    this.row = row;
    this.col = col;

    this.render();
  }

  render() {
    let tileStyle = styleMap.find((tmpTileStyle) => tmpTileStyle.number === this.number);

    if (!tileStyle) {
      tileStyle = styleMap.find((tmpTileStyle) => tmpTileStyle.number === 'NOTHING');
    }

    if (!this.ctx) throw new Error(`Please pass the canvas context for Tile ${JSON.stringify({ x: this.x, y: this.y, w: this.w, h: this.h })}`);
    this.ctx.clearRect(this.x, this.y, this.w, this.h);
    this.ctx.fillStyle = tileStyle.backGroundColor;
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
    this.ctx.rect(this.x, this.y, this.w, this.h);

    if (this.number) {
      this.ctx.font = `${Math.floor(tileStyle.fontSize * this.scale)}px Arial`; // '36px Arial',
      this.ctx.fillStyle = tileStyle.fontColor;
      this.ctx.textAlign = "center";
      this.ctx.fillText(this.number, this.x + (tileStyle.xOffset * this.scale), this.y + (tileStyle.yOffset * this.scale));
    }
  }

  setNumber(num) {
    this.number = num;
    this.render();
  }

  toString() {
    return this.number;
    // return JSON.stringify({ num: this.number, row: this.row, col: this.col, });
  }

}