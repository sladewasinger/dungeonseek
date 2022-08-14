export class RectangleCollision {
  static checkOverlap(rectA, rectB) {
    if (rectA.x + rectA.width < rectB.x || rectA.x > rectB.x + rectB.width) {
      return false;
    }

    if (rectA.y + rectA.height < rectB.y || rectA.y > rectB.y + rectB.height) {
      return false;
    }

    if (rectA.width === 0 || rectA.width === 0 || rectB.width === 0 || rectB.height === 0) {
      return false;
    }

    return true;
  }
}
