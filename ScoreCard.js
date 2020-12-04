import { styleMap } from './TileStyle.js';

export default class ScoreCard {

  constructor(ctx, score, best) {
    this.ctx = ctx;
    this.scale = this.ctx.scale2048;

    this.score = score;
    this.best = best;
    this.scoreX = 230 * this.scale;
    this.bestX = 340 * this.scale;

    this.render();
  }

  render(refreshScore = true, refreshBest = true) {
    if (!this.ctx) throw new Error(`Please pass the canvas context for Score Card ${JSON.stringify({ total: this.total })}`);
    const y = 10 * this.scale;
    const w = 100 * this.scale;
    const h = 50 * this.scale;

    if (refreshScore && this.score >= 0) {
      this.ctx.clearRect(this.scoreX, y, w, h);

      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(this.scoreX, y, w, h);
      this.ctx.font = `${Math.floor(14 * this.scale)}px Arial`;
      this.ctx.fillStyle = '#000';
      this.ctx.textAlign = "center";
      this.ctx.fillText('Score', this.scoreX + (48 * this.scale), 30 * this.scale);
      this.ctx.font = `${Math.floor(24 * this.scale)}px Arial`;
      this.ctx.fillText(this.score, this.scoreX + (48 * this.scale), 55 * this.scale);
    }
    if (refreshBest && this.best >= 0) {
      this.ctx.clearRect(this.bestX, y, w, h);

      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(this.bestX, y, w, h);
      this.ctx.font = `${Math.floor(14 * this.scale)}px Arial`;
      this.ctx.fillStyle = '#000';
      this.ctx.textAlign = "center";
      this.ctx.fillText('Best', this.bestX + (48 * this.scale), 30 * this.scale);
      this.ctx.font = `${Math.floor(24 * this.scale)}px Arial`;
      this.ctx.fillText(this.best, this.bestX + (48 * this.scale), 55 * this.scale);
    }
  }

  setScoreAndBest(score, best) {
    let refreshScore = false;
    let refreshBest = false;

    if (score && score !== this.score) {
      this.score = score;
      refreshScore = true;
    }
    if (best && best !== this.best) {
      this.best = best;
      refreshBest = true;
    }

    this.render(refreshScore, refreshBest);
  }
}