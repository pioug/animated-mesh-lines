import {
  Color,
} from 'three';

import Engine from 'utils/engine';
import AnimatedText3D from 'objects/AnimatedText3D';
import LineGenerator from 'objects/LineGenerator';

import getRandomFloat from 'utils/getRandomFloat';
import getRandomItem from 'utils/getRandomItem';

import HandleCameraOrbit from 'decorators/HandleCameraOrbit';
import FullScreenInBackground from 'decorators/FullScreenInBackground';

import app from 'App';

import '../../base.css';
import './style.styl';

export default function() {
  /**
   * * *******************
   * * ENGINE
   * * *******************
   */

  @FullScreenInBackground
  @HandleCameraOrbit({ x: 1, y: 1 }, 0.1)
  class CustomEngine extends Engine {}
  const engine = new CustomEngine();
  engine.camera.position.z = 6;

  /**
   * * *******************
   * * LIGNES
   * * *******************
   */

  const RADIUS_START = 0.3;
  const RADIUS_START_MIN = 0.1;
  const Z_MIN = -1;

  const Z_INCREMENT = 0.08;
  const ANGLE_INCREMENT = 0.025;
  const RADIUS_INCREMENT = 0.02;

  const COLORS = ['#F42752', '#FF7C7C', '#896FFF', '#ACFFCD', '#CECECE'].map((col) => new Color(col));
  const STATIC_PROPS = {
    transformLineMethod: p => p * 1.5,
  };

  const position = { x: 0, y: 0, z: 0 };
  class CustomLineGenerator extends LineGenerator {
    addLine() {
      if (this.lines.length > 400) return;

      let z = Z_MIN;
      let radius = (Math.random() > 0.8) ? RADIUS_START_MIN : RADIUS_START;
      let angle = getRandomFloat(0, Math.PI * 2);

      const points = [];
      while (z < engine.camera.position.z) {
        position.x = Math.cos(angle) * radius;
        position.y = Math.sin(angle) * radius;
        position.z = z;

        // incrementation
        z += Z_INCREMENT;
        angle += ANGLE_INCREMENT;
        radius += RADIUS_INCREMENT;

        // push
        points.push(position.x, position.y, position.z);
      }

      // Low lines
      super.addLine({
        visibleLength: getRandomFloat(0.1, 0.4),
        // visibleLength: 1,
        points,
        // speed: getRandomFloat(0.001, 0.002),
        speed: getRandomFloat(0.001, 0.005),
        color: getRandomItem(COLORS),
        width: getRandomFloat(0.01, 0.06),
      });
    }
  }
  const lineGenerator = new CustomLineGenerator({
    frequency: 0.9,
  }, STATIC_PROPS);
  engine.add(lineGenerator);

  /**
   * * *******************
   * * START
   * * *******************
   */
  // Show
  const tlShow = new TimelineLite({ delay: 0.2, onStart: () => {
    lineGenerator.start();
  }});
  tlShow.to('.overlay', 5, { autoAlpha: 0 });

  return engine;
}

