// Name: Jump Effect
// ID: StormWarpJump
// Description: A jump effect inspired by Scratch Jr, Jump Block version of Turbowarp / StormWarp made by Stormwindsky
// License: CC0 1.0

(function (Scratch) {
  'use strict';

  class JumpEffect {
    getInfo() {
      return {
        id: 'stormwindskyJump',
        name: 'Jump Effect',
        color1: '#ffab19', // Couleur orange style Scratch Jr / Mouvement
        blocks: [
          {
            opcode: 'jumpBlock',
            blockType: Scratch.BlockType.COMMAND,
            text: 'jump [HEIGHT]',
            arguments: {
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              }
            }
          }
        ],
        menus: {}
      };
    }

    async jumpBlock(args, util) {
      const height = Number(args.HEIGHT) || 0;
      if (height <= 0) return;

      const target = util.target;
      const startY = target.y;
      
      // Facteur de multiplication pour rendre le saut visible (ajustable)
      const multiplier = 10; 
      const peakY = startY + (height * multiplier);
      
      // Animation de montée (Ease out)
      await this._animate(target, startY, peakY, 150);
      // Animation de descente (Ease in)
      await this._animate(target, peakY, startY, 150);
      
      // Assurer la position finale exacte
      target.setXY(target.x, startY);
    }

    _animate(target, start, end, duration) {
      return new Promise((resolve) => {
        const startTime = Date.now();
        
        const step = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          const currentY = start + (end - start) * progress;
          target.setXY(target.x, currentY);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };
        
        step();
      });
    }
  }

  // Enregistrement de l'extension avec les crédits
  Scratch.extensions.register(new JumpEffect());
})(Scratch);

/**
 * Created by Stormwindsky
 * License: CC0 1.0 Universal
 * This work is dedicated to the public domain.
 */
