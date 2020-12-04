import Tile from './Tile.js';
import ScoreCard from './ScoreCard.js';
import GameOverlay from './GameOverlay.js'

class Game {

  constructor(ctx) {
    this.ctx = ctx;
    this.scale = this.ctx.scale2048;

    this.start();

    window.addEventListener('keydown', (evt) => {
      switch (evt.keyCode) {
        case 13:
          // Enter
          console.log('I am ENter', this.status);
          if (this.status === 'GAMEOVER' || this.status === 'WINNER') {
            this.gameOverlay.clear(); // clear titles etc
            this.start();
            console.log('Game should restart');
          }

          break;
        case 37:
          // LEFT
          this.mergeTile(false, true);
          break;
        case 38:
          // UP
          this.mergeTile(true, true);
          break;
        case 39:
          // RIGHT
          this.mergeTile(false, false);
          break;
        case 40:
          // DOWN
          this.mergeTile(true, false);
          break;

        default:
          break;
      }
    });
  }

  mergeTile(vertical, start) {
    if (this.status !== 'PLAYING') { return 0 }
    let newMatrix;
    let turnPoint = 0;

    newMatrix = this.tileMatrix.map(
      (tileRow, rowIndex) => tileRow.map(
        (tile, colIndex) => (
          vertical ?
            { ...this.tileMatrix[colIndex][rowIndex] } :
            { ...this.tileMatrix[rowIndex][colIndex] }
        )
      )
    );

    newMatrix.forEach(row => {
      row.sort((a, b) => start ? (b.number && 1) - (a.number && 1) : (a.number && 1) - (b.number && 1));
    });
    let goAhead = true;

    newMatrix.forEach((list, r) => {
      list.forEach((el, c) => {
        if (start) {
          const first = c;
          const second = c + 1;
          if (
            first < list.length &&
            second < list.length &&
            list[first].number > 0 &&
            list[second].number > 0 &&
            list[first].number === list[second].number) {
            const doubleNumber = 2 * list[first].number;

            if (doubleNumber > this.maxNumber) {
              this.maxNumber = doubleNumber;
              if (this.maxNumber === 2048) {
                this.status = 'WINNER';
                goAhead = false;
                this.gameOverlay.setTitle('You won !!!', 'Hit enter to restart.');
              }
            }

            list[first].number = doubleNumber;
            list[second].number = 0;

            turnPoint += doubleNumber;
          }
        } else {
          const last = list.length - c - 1;
          const secondLast = list.length - c - 2;
          if (
            secondLast >= 0 &&
            last >= 0 &&
            list[last].number > 0 &&
            list[secondLast].number > 0 &&
            list[last].number === list[secondLast].number) {
            const doubleNumber = 2 * list[last].number;

            if (doubleNumber > this.maxNumber) {
              this.maxNumber = doubleNumber;
              if (this.maxNumber === 2048) {
                this.status = 'WINNER';
                this.gameOverlay.setTitle('You won !!!', 'Hit enter to restart.');
                goAhead = false;
                window.dispatchEvent(new CustomEvent('2048-status-changed', {
                  detail: {
                    status: this.status,
                    score: {
                      current: this.totalPoints,
                    },
                  }
                }));
              }
            }

            list[last].number = doubleNumber;
            list[secondLast].number = 0;

            turnPoint += doubleNumber;
          }
        }
      })
    });

    if (goAhead) {
      newMatrix.forEach(row => {
        row.sort((a, b) => start ? (b.number && 1) - (a.number && 1) : (a.number && 1) - (b.number && 1));
      });

      newMatrix.forEach((list, r) => {
        list.forEach((el, c) => {
          (vertical ? this.tileMatrix[c][r] : this.tileMatrix[r][c]).setNumber(el.number);
        })
      });

      this.totalPoints += turnPoint;
      if (this.bestScore < this.totalPoints) {
        this.bestScore = this.totalPoints;

        localStorage.setItem('BEST_OF_2048', this.bestScore)
      }
      this.scoreCard.setScoreAndBest(this.totalPoints, this.bestScore);
      this.spawnNumber();
    }
  }

  getAxisValue(index) {
    return (index * 110 + 10);
  }

  spawnNumber() {
    const blankMatrix = this.tileMatrix.map(row => row.filter(tile => tile.number === 0)).filter(row => row.length > 0);

    if (!blankMatrix.length) {
      this.status = 'GAMEOVER';
      this.gameOverlay.setTitle('Game Over !!!', 'Hit enter to restart.');

      window.dispatchEvent(new CustomEvent('2048-status-changed', {
        detail: {
          status: this.status,
          score: {
            current: this.totalPoints,
          },
        }
      }));
      return 0;
    }

    const randomRow = Math.floor(Math.random() * blankMatrix.length);
    const randomCol = Math.floor(Math.random() * blankMatrix[randomRow].length);
    const targetTile = blankMatrix[randomRow][randomCol];

    let number = 2;
    this.maxNumber = this.maxNumber || 2;

    switch (true) {
      case this.maxNumber <= 8:
        number = 2;
        break;
      case this.maxNumber <= 256:
        number = [2, 4][Math.floor(Math.random() * 2)];
        break;
      default:
        number = [2, 4, 8][Math.floor(Math.random() * 3)];
        break;
    }

    this.tileMatrix[targetTile.row][targetTile.col].setNumber(number);
  }

  start() {
    this.tileMatrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    this.tileMatrix.forEach((list, row) => {
      list.forEach((el, col) => {
        this.tileMatrix[row][col] = new Tile(
          this.ctx,
          0,
          row,
          col,
          this.getAxisValue(col),
          this.getAxisValue(row) + 70,
        );
      })
    });
    this.maxNumber = 2;

    this.spawnNumber();
    this.spawnNumber();


    this.totalPoints = 0;
    try {
      this.bestScore = parseInt((localStorage.getItem('BEST_OF_2048') || 0), 10);
    } catch (e) {
      this.bestScore = 0;
    }

    this.status = 'PLAYING';
    this.scoreCard = new ScoreCard(this.ctx, this.totalPoints, this.bestScore);
    this.gameOverlay = new GameOverlay(this.ctx);
  }
}

const createCanvas = (id = 'playGround2048', scale) => {
  let playGround = document.getElementById(id);

  if (!playGround) {
    playGround = document.createElement('canvas');
    playGround.setAttribute('id', id);
    document.body.appendChild(playGround);
  }
  const w = 450;
  const h = 520;

  playGround.style.width = `${w}px`;
  playGround.style.height = `${h}px`;
  playGround.width = w * scale;
  playGround.height = h * scale;

  return playGround;
}

window.addEventListener('load', () => {
  const scale = 2;
  const playGroundCanvas = createCanvas('playGround2048', scale);

  const ctx = playGroundCanvas.getContext('2d');
  ctx.scale2048 = scale;

  const game = new Game(ctx);
});