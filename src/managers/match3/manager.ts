import { MATCH3_CONFIG } from "../../configs/match3/layout.constants";

type TTileData = {
  [key: string]: {
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    graphics: Phaser.GameObjects.Graphics;
  };
};

type TDrawTileProps = {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  name: string;
  upper?: boolean;
};

export default class Match3Manager {
  private scene: Phaser.Scene;
  private status: "unset" | "gameOver" = "unset";

  private state: TTileData = {};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public gameOver() {
    if (this.status === "gameOver") return;
    this.status = "gameOver";
    console.log("Game Over");
  }

  public hideAllTiles() {
    Object.keys(this.state).forEach((key) => {
      this.state[key].graphics.setVisible(false);
    });
  }

  public addScore(count: number) {
    console.log("Add Score", count);
  }

  public drawTile(props: TDrawTileProps) {
    const { x, y, r, g, b, name, upper } = props;

    const draw = (graphics: Phaser.GameObjects.Graphics) => {
      this.state[name].graphics.clear();
      graphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      graphics.fillRect(
        MATCH3_CONFIG.x + x,
        MATCH3_CONFIG.y + y,
        MATCH3_CONFIG.width,
        MATCH3_CONFIG.height
      );
      graphics.setDepth(upper ? 1 : 2);
    };

    if (this.state[name]) {
      // 已經畫過了

      this.state[name].r = r;
      this.state[name].g = g;
      this.state[name].b = b;
      draw(this.state[name].graphics);
    } else {
      // 繪製新的方塊
      const graphics = this.scene.add.graphics();
      this.state = { ...this.state, [name]: { x, y, r, g, b, graphics } };
      draw(graphics);
    }
    this.state[name].graphics.setVisible(true);
  }
}
