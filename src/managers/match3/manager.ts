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

  public drawTile(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    name: string
  ) {
    if (this.state[name]) {
      // 已經畫過了
      this.state[name].graphics.x = 100 + x + 2;
      this.state[name].graphics.y = 100 + y + 2;
      this.state[name].r = r;
      this.state[name].g = g;
      this.state[name].b = b;
      this.state[name].graphics.clear();
      this.state[name].graphics.fillStyle(
        Phaser.Display.Color.GetColor(r, g, b),
        1
      );
      this.state[name].graphics.fillRect(0, 0, 36, 36);
    } else {
      // 繪製新的方塊
      const graphics = this.scene.add.graphics();
      graphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      graphics.fillRect(100 + x + 2, 100 + y + 2, 36, 36);
      this.state = { ...this.state, [name]: { x, y, r, g, b, graphics } };
    }
    this.state[name].graphics.setVisible(true);
  }
}
