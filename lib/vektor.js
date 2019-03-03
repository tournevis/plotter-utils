'use strict';

export default class Vektor {
  constructor(x, y, z) {
    if (x instanceof Vektor) {
      this.x = x.x || 0
      this.y = x.y || 0
      this.z = x.z || 0
    } else if (x instanceof Array) {
      this.x = arguments[0] || 0
      this.y = arguments[1] || 0
      this.z = arguments[2] || 0
    } else {
      this.x = x || 0
      this.y = y || 0
      this.z = z || 0
    }
  }

  add(x, y, z) {
    if (x instanceof Vektor) {
      this.x += x.x || 0
      this.y += x.y || 0
      this.z += x.z || 0
      return this
    } else if (x instanceof Array) {
      this.x += x[0] || 0
      this.y += x[1] || 0
      this.z += x[2] || 0
      return this
    }
    this.x += x || 0
    this.y += y || 0
    this.z += z || 0
    return this
  }

  sub(x, y, z) {
    if (x instanceof Vektor) {
      this.x -= x.x || 0
      this.y -= x.y || 0
      this.z -= x.z || 0
      return this
    } else if (x instanceof Array) {
      this.x -= x[0] || 0
      this.y -= x[1] || 0
      this.z -= x[2] || 0
      return this
    }
    this.x -= x || 0
    this.y -= y || 0
    this.z -= z || 0
    return this
  }
  
  mult(n) {
    if (!(typeof n === 'number')) {
      console.warn(
        'Vektor.mult',
        'n is undefined or not a finite number'
      )
      return this
    }
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  }
  div(n) {
    if (!(typeof n === 'number' && !(n === 0))) {
      console.warn(
        'Vektor.mult',
        'n is undefined or not a finite number'
      )
      return this
    }
    this.x /= n;
    this.y /= n;
    this.z /= n;
    return this;
  }
  scaleMag (n) {
    return this.normalize().mult(n)
  }
  len () {
    return Math.sqrt(this.lenSq());
  }

  normalize () {
    var len = this.len();
    // here we multiply by the reciprocal instead of calling 'div()'
    // since div duplicates this zero check.
    if (len !== 0) this.mult(1 / len);
    return this;
  }
  lenSq () {
    var x = this.x;
    var y = this.y;
    var z = this.z;
    return x * x + y * y + z * z;
  }
  max(max) {
    this.x = Math.min(this.x, max)
    this.y = Math.min(this.y, max)
    this.z = Math.min(this.z, max)
    return this
  }
  limit (max) {
     var mSq = this.lenSq();
      if (mSq > max * max) {
        this.div(Math.sqrt(mSq)) //normalize it
          .mult(max);
      }
      return this;
  }
  hypot (x, y, z) {
    if (x instanceof Vektor) {
      return Math.hypot(this.x, this.y, this.z)   
    }
    if (x instanceof Vektor) {
      return Math.hypot(x.x || 0, x.y || 0, x.z || 0)   
    }
    return Math.hypot(x || 0, y || 0, z || 0)
  }
  dot(x, y, z) {
    if (x instanceof Vektor) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
  }
}
