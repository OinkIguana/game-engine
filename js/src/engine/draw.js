'use strict';

const [STACK, COLOR, ALPHA, FONT, CONTEXT] = [Symbol(), Symbol(), Symbol(), Symbol(), Symbol()];

class Draw {
  [STACK] = {};
  [COLOR] = '#000000';
  [ALPHA] = 1;
  [FONT] = '14px Arial';

  constructor(context) { this[CONTEXT] = context; }

  // settings
  alpha(alpha) {
    this[ALPHA] = alpha;
    return this;
  }
  color(color) {
    this[COLOR] = typeof color === 'number' ? '#' + color.toString(16).padStart(6, '0') : color;
    return this;
  }

  // drawing
  rect(rect, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [alpha, color] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.fillRect(...rect);
    });
    return this;
  }
  point(point, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [alpha, color] = [this[COLOR], this[ALPHA]];
    this[STACK][depth].push(con => {
      con.fillStyle = color;
      con.globalAlpha = alpha;
      con.fillRect(...point, 1, 1);
    });
    return this;
  }
  sprite(sprite, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const alpha = this[ALPHA];
    this[STACK][depth].push(con => {
      con.globalAlpha = alpha;
      con.drawImage(sprite.texture, ...sprite.src, ...sprite.dest);
    });
    return this;
  }
  text(str, where, depth = 0) {
    this[STACK][depth] = this[STACK][depth] || [];
    const [font, alpha, color] = [this[FONT], this[ALPHA], this[COLOR]]
    this[STACK][depth].push(con => {
      con.font = font;
      con.globalAlpha = alpha;
      con.fillStyle = color;
      con.fillText(str, ...where);
    });
    return this;
  }

  render() {
    for(let depth of Object.keys(this[STACK]).map(x=>+x).sort((a,b)=>a-b)) {
      for(let item of this[STACK][depth]) {
        item(this[CONTEXT]);
      }
    }
    this[STACK] = {};
  }
}

export default Draw;
