'use strict';

import Draw from './draw';
import { Position, Dimension, Rectangle } from './struct';
import GameEvent from './game-event';
import Drawable from './drawable';
import Input from './input';
import TextureManager from './texture-manager';
import SoundManager from './sound-manager';
import {
  PAGES, SOUNDS, MUSIC, ROOMS, OBJECTS, RAF, CANVAS, CONTEXT, INPUT,
  TEXTURE_MANAGER, SOUND_MANAGER, VIEWS, PROC, DRAWER, SIZE, CONTAINER,
} from './const';
import GameUtility from './game-utility';

// TODO: rewrite everything to use private methods using out-of-class bound
//       functions and internal methods using shared symbols

class Engine {
  [ROOMS] = [];
  [OBJECTS] = [[]];
  [RAF] = null;
  [VIEWS] = [new Rectangle(0, 0, 300, 150)];
  [DRAWER] = null;

  constructor(container, {w, h}) {
    this[SIZE] = new Dimension(w, h);
    this[CONTAINER] = document.querySelector(container);
    this[CONTAINER].setAttribute('tabindex', 0);
    this[CONTAINER].style.position = 'relative';
    this[CONTAINER].style.width = w + 'px';
    this[CONTAINER].style.height = h + 'px';
    this[CONTAINER].style.outline = 'none';
    this[VIEWS][0].w = w;
    this[VIEWS][0].h = h;
    this[INPUT] = new Input(this[CONTAINER]);
    this[TEXTURE_MANAGER] = new TextureManager(this.constructor[PAGES]);
    this[SOUND_MANAGER] = new SoundManager(this.constructor[SOUNDS], this.constructor[MUSIC]);
  }
  get size() { return this[SIZE]; }

  // triggers the event for all objects currently active
  [PROC](event) {
    for(let obj of this[OBJECTS][0]) {
      obj.proc(event);
    }
    this[ROOMS][0] && this[ROOMS][0].proc(event);
  }

  // specifies how to start a game
  start() {}
  // processes all events for one frame
  step() {
    this[PROC](new GameEvent('stepstart'));
    for(let event of this[INPUT]) {
      this[PROC](event);
    }
    this[PROC](new GameEvent('step'));
    this[PROC](new GameEvent('stepend'));
  }
  // refreshes the game screen
  draw() {
    const drawer = this[DRAWER] || (this[DRAWER] = new Draw(this[CONTAINER]));
    // draw under layers first
    // IDEA: add some optimization options here for purely static layers
    //       we shouldn't need to re-draw every item individually if they
    //       haven't changed at all
    drawer.removeCanvases(this[ROOMS].length * 2);
    for(let i = this[ROOMS].length - 1; i >= 0; --i) {
      drawer.view(this[VIEWS][i]);
      for(let obj of this[OBJECTS][i]) {
        obj instanceof Drawable && obj.draw(drawer.object(obj));
      }
      this[ROOMS][i] && this[ROOMS][i].draw(drawer);
      drawer.render(i);
      // draw GUI
      drawer.view(new Rectangle(0, 0, ...this.size));
      for(let obj of this[OBJECTS][i]) {
        obj instanceof Drawable && obj.drawGUI(drawer.object(obj));
      }
      this[ROOMS][i] && this[ROOMS][i].drawGUI(drawer);
      drawer.render(this[ROOMS].length + i);
    }
  }
  // run at the end of a game
  end() {}

  // runs the game
  run() {
    let me = 0;
    const takeStep = () => {
      me = this[RAF];
      this.step();
      this.draw();
      if(this[RAF] === me) {
        // guard against the game being re-run by just stopping it.
        // NOTE: behaviour is undefined if there are still rooms/objects in the
        // game when it is re-run
        this[RAF] = window.requestAnimationFrame(takeStep);
      }
    };
    this.start();
    this[PROC](new GameEvent('gamestart'));
    this[RAF] = window.requestAnimationFrame(takeStep);
  }

  // spawns a persistent object
  // HACK: internalize
  spawn(Obj, ...args) {
    const o = new Obj(this);
    o.init(...args);
    this[OBJECTS][0].push(o);
    return o;
  }
  // destroys a persistent object
  // HACK: internalize
  destroy(obj) {
    if(typeof obj === 'function') {
      this[OBJECTS][0].filter(o => !(o instanceof obj));
    } else {
      const i = this[OBJECTS][0].indexOf(obj);
      if(i >= 0) {
        this[OBJECTS][0].splice(i, 1);
      }
    }
  }
  // finds a persistent object
  find(Obj) {
    return this[OBJECTS][0].filter(o => o instanceof Obj);
  }

  get texture() {
    return this[TEXTURE_MANAGER];
  }

  get sound() {
    return this[SOUND_MANAGER];
  }

  get layers() {
    return this[ROOMS].length;
  }

  get util() {
    return new GameUtility(this);
  }
}

export { Engine };
export default Engine;
