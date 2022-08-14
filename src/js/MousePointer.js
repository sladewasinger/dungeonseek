export class MousePointer {
  constructor(camera) {
    this.camera = camera;
    this.x = 0;
    this.y = 0;
    this.canvasX = 0;
    this.canvasY = 0;
    this.leftClick = false;

    window.addEventListener('mousedown', (e) => this.mousedown(e))
    window.addEventListener('mouseup', (e) => this.mouseup(e))
    window.addEventListener('mousemove', (e) => {
      if (this.leftClick) {
        this.camera.x += (e.clientX - this.x) / this.camera.scale;
        this.camera.y += (e.clientY - this.y) / this.camera.scale;
      }
      this.mousemove(e);
    });
    window.addEventListener('wheel', (e) => this.scroll(e));
  }

  mousedown(e) {
    this.leftClick = true;
  }

  mousemove(e) {
    this.x = e.clientX;
    this.y = e.clientY;

    this.canvasX = this.x / this.camera.scale - this.camera.x;
    this.canvasY = this.y / this.camera.scale - this.camera.y;
  }

  mouseup(e) {
    this.leftClick = false;
  }

  scroll(event) {
    if (event.deltaY > 0) {
      this.camera.scale *= 0.9;
    } else {
      this.camera.scale *= 1.1;
    }
  }
}
