export default class GameOverlay {

  constructor(ctx, title, subtitle) {
    this.ctx = ctx;
    this.scale = this.ctx.scale2048;
    this.title = title;
    this.subtitle = subtitle;

    this.render();
  }

  render(refresh) {
    if (!this.ctx) throw new Error(`Please pass the canvas context for GameOverlay ${JSON.stringify({ message: this.message })}`);

    if (refresh) {
      this.ctx.clearRect(10 * this.scale, 80 * this.scale, 430 * this.scale, 430 * this.scale);
    }

    if (this.title) {
      this.ctx.globalAlpha = 0.1;
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(10 * this.scale, 80 * this.scale, 430 * this.scale, 430 * this.scale);

      this.ctx.textAlign = "center";
      this.ctx.globalAlpha = 0.6;
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(60 * this.scale, 180 * this.scale, 330 * this.scale, 230 * this.scale);
      this.ctx.fillStyle = '#f00';
      this.ctx.globalAlpha = 1;
      this.ctx.font = '24px Arial';
      this.ctx.fillText(this.title, 225 * this.scale, 275 * this.scale);
      if (this.subtitle) {
        this.ctx.font = '18px Arial';
        this.ctx.fillText(this.subtitle, 225 * this.scale, 305 * this.scale);
      }
    }
  }

  setTitle(title, subtitle) {
    this.title = title;
    this.subtitle = subtitle;

    this.render();
  }
  clear() {
    this.title = null;
    this.render(true);
  }
}