/**
 * Glide++ Extension
 * License: CC0 1.0 Universal (Public Domain)
 */

(function (Scratch) {
  'use strict';

  // Délai d'un frame Scratch (~33ms à 30fps)
  const FRAME_DELAY = 1000 / 30;

  class GlidePlusPlus {
    constructor() {
      this.activeGlides = new Set();
    }

    getInfo() {
      return {
        id: 'glidePlusPlus',
        name: 'Glide++',
        color1: '#ff85a2',
        color2: '#ff4d79',
        blocks: [
          {
            opcode: 'universalGlide',
            blockType: Scratch.BlockType.COMMAND,
            text: 'glide [MODE] to x: [X] y: [Y] speed/time: [SPEED] lag/fps: [VAL]',
            arguments: {
              MODE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'glideModes',
                defaultValue: 'Classic'
              },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              VAL: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12 }
            }
          }
        ],
        menus: {
          glideModes: {
            acceptReporters: true,
            items: ['Classic', 'Smooth', 'Laggy', 'Stop Motion', 'Stop Motion (Classic)']
          }
        }
      };
    }

    async universalGlide(args, util) {
      const mode = args.MODE;
      const targetX = Number(args.X);
      const targetY = Number(args.Y);
      const speedInput = Number(args.SPEED);
      const valInput = Number(args.VAL);

      const glideId = Symbol();
      this.activeGlides.add(glideId);

      const onStop = () => {
        this.activeGlides.clear();
      };
      util.runtime.on('PROJECT_STOP_ALL', onStop);

      const shouldContinue = () => this.activeGlides.has(glideId);

      // Attend un vrai frame (33ms) pour que Scratch puisse rendre l'image
      const waitFrame = () => new Promise(r => setTimeout(r, FRAME_DELAY));

      // --- MODE: CLASSIC ---
      // speedInput = durée en secondes
      if (mode === 'Classic') {
        const startX = util.target.x;
        const startY = util.target.y;
        const totalFrames = Math.max(1, Math.round(speedInput * 30)); // ex: 2s = 60 frames
        
        for (let i = 1; i <= totalFrames && shouldContinue(); i++) {
          const ratio = i / totalFrames;
          util.target.setXY(
            startX + (targetX - startX) * ratio,
            startY + (targetY - startY) * ratio
          );
          await waitFrame(); // attend ~33ms = 1 frame à 30fps
        }
      }

      // --- MODE: SMOOTH ---
      // speedInput = facteur de lissage (plus il est grand, plus c'est lent)
      else if (mode === 'Smooth') {
        const speed = Math.max(1.1, speedInput);

        while (shouldContinue()) {
          const distX = targetX - util.target.x;
          const distY = targetY - util.target.y;

          if (Math.abs(distX) < 0.1 && Math.abs(distY) < 0.1) break;

          util.target.setXY(
            util.target.x + distX / speed,
            util.target.y + distY / speed
          );

          await waitFrame(); // attend ~33ms pour un vrai glissement visible
        }
      }

      // --- MODE: LAGGY ---
      else if (mode === 'Laggy') {
        const speed = Math.max(1.1, speedInput);
        const lagIntensity = Math.min(100, Math.max(0, valInput));
        while (shouldContinue()) {
          const distX = targetX - util.target.x;
          const distY = targetY - util.target.y;
          if (Math.abs(distX) < 0.1 && Math.abs(distY) < 0.1) break;

          if (Math.random() * 100 > lagIntensity) {
            util.target.setXY(util.target.x + distX / speed, util.target.y + distY / speed);
          }
          await new Promise(r => setTimeout(r, Math.random() * lagIntensity));
        }
      }

      // --- MODE: STOP MOTION (SMOOTH) ---
      else if (mode === 'Stop Motion') {
        const fps = Math.max(1, Math.min(30, valInput));
        const frameDelay = 1000 / fps;
        const speed = Math.max(1.1, speedInput);
        while (shouldContinue()) {
          const distX = targetX - util.target.x;
          const distY = targetY - util.target.y;
          if (Math.abs(distX) < 0.1 && Math.abs(distY) < 0.1) break;

          util.target.setXY(util.target.x + distX / speed, util.target.y + distY / speed);
          await new Promise(r => setTimeout(r, frameDelay));
        }
      }

      // --- MODE: STOP MOTION (CLASSIC) ---
      else if (mode === 'Stop Motion (Classic)') {
        const startX = util.target.x;
        const startY = util.target.y;
        const durationFrames = Math.max(1, speedInput * 30);
        const fps = Math.max(1, Math.min(30, valInput));
        const frameDelay = 1000 / fps;

        let elapsed = 0;
        while (shouldContinue() && elapsed < durationFrames) {
          elapsed += (30 / fps);
          const ratio = Math.min(1, elapsed / durationFrames);
          util.target.setXY(startX + (targetX - startX) * ratio, startY + (targetY - startY) * ratio);
          await new Promise(r => setTimeout(r, frameDelay));
        }
      }

      // Snap to final and clean up
      if (shouldContinue()) util.target.setXY(targetX, targetY);
      this.activeGlides.delete(glideId);
      util.runtime.off('PROJECT_STOP_ALL', onStop);
    }
  }

  Scratch.extensions.register(new GlidePlusPlus());
})(Scratch);
