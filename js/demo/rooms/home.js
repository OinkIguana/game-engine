'use strict';

import { Room, texturepage, tilemap, Rectangle } from '../../engine';
import Player from '../objects/player';

@texturepage('sarah')
@tilemap('home')
class Home extends Room {
  start() {
    super.spawn(Player);
  }
};

export default Home;