'use strict';

import GameEvent from './game-event';

const [QUEUE, STATE] = [Symbol(), Symbol()];

class Input {
  static preventDefault = false;

  [QUEUE] = {
    keydown: [],
    keyup: [],
    mousedown: [],
    mouseup: [],
    mousemove: [0, 0]
  };

  [STATE] = {
    mouse: {},
    key: {}
  }

  constructor(container) {
    this.container = container;
    window.addEventListener('keydown', this.keydown.bind(this), true);
    window.addEventListener('keyup', this.keyup.bind(this), true);
    window.addEventListener('mousedown', this.mousedown.bind(this), true);
    window.addEventListener('mouseup', this.mouseup.bind(this), true);
    window.addEventListener('mousemove', this.mousemove.bind(this), true);
  }

  keystate(key) {
    return !!this[STATE].key[key];
  }

  mousestate(button) {
    return !!this[STATE].mouse[button];
  }

  keydown(event) {
    if(this.container === document.activeElement) {
      event.preventDefault();
      this[QUEUE].keydown.push(new GameEvent('keydown', event.key));
      this[STATE].key[event.key] = true;
    }
  }
  keyup(event) {
    if(this.container === document.activeElement) {
      event.preventDefault();
      this[QUEUE].keyup.push(new GameEvent('keyup', event.key));
      this[STATE].key[event.key] = false;
    }
  }
  mousedown(event) {
    if(this.container === document.activeElement) {
      this[QUEUE].mousedown.push(new GameEvent('mousedown', event.button));
      this[STATE].mouse[event.button] = true;
    }
  }
  mouseup(event) {
    if(this === document.activeElement) {
      event.preventDefault();
      this[QUEUE].mouseup.push(new GameEvent('mouseup', event.button));
      this[STATE].mouse[event.button] = false;
    }
  }
  mousemove(event) {
    const {left: x, top: y} = this.container.getBoundingClientRect();
    this[QUEUE].mousemove = [event.clientX - x, event.clientY - y];
  }

  *[Symbol.iterator] () {
    yield* [
      ... this[QUEUE].keydown.splice(0),
      ... this[QUEUE].mousedown.splice(0),
      ... this[QUEUE].keyup.splice(0),
      ... this[QUEUE].mouseup.splice(0),
      new GameEvent('mousemove', this[QUEUE].mousemove)
    ];
  }
}

export default Input;
