// Name: Screen Juice Effects
// ID: screenJuiceCC0
// Description: Apply screen shake, mirror modes, grayscale, and visual juice directly to the stage canvas.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  // Object to store active CSS filter states
  let activeFilters = {
    invert: 0,
    blur: 0,
    grayscale: 0
  };

  class ScreenJuice {
    getInfo() {
      return {
        id: 'screenJuiceCC0',
        name: 'Screen Juice',
        color1: '#ff477e',
        color2: '#d91b5c',
        blocks: [
          {
            opcode: 'shakeScreen',
            blockType: Scratch.BlockType.COMMAND,
            text: 'shake screen with intensity [INTENSITY] for [DURATION] secs',
            arguments: {
              INTENSITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              DURATION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.4 }
            }
          },
          {
            opcode: 'setMirrorMode',
            blockType: Scratch.BlockType.COMMAND,
            text: 'turn mirror mode [STATE]',
            arguments: {
              STATE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'toggleMenu',
                defaultValue: 'ON'
              }
            }
          },
          {
            opcode: 'setGrayscale',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set grayscale [VALUE] %',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'setInvertColors',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set invert colors [VALUE] %',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'setMotionBlur',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set screen blur [VALUE] px',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
            }
          },
          {
            opcode: 'resetAllEffects',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset all screen effects'
          }
        ],
        menus: {
          toggleMenu: {
            acceptReporters: false,
            items: ['ON', 'OFF']
          }
        }
      };
    }

    getCanvas() {
      return Scratch.vm.runtime.renderer.canvas;
    }

    updateFilters(canvas) {
      // Combines filter properties so they don't overwrite each other
      canvas.style.filter = `grayscale(${activeFilters.grayscale}%) invert(${activeFilters.invert}%) blur(${activeFilters.blur}px)`;
    }

    shakeScreen(args) {
      const canvas = this.getCanvas();
      if (!canvas) return;

      const intensity = Number(args.INTENSITY) || 0;
      const duration = (Number(args.DURATION) || 0) * 1000;
      const startTime = Date.now();

      // Store current transforms so we don't clear the mirror mode if active
      const isMirrored = canvas.style.transform.includes('scaleX(-1)');

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
          canvas.style.transform = isMirrored ? 'scaleX(-1)' : '';
          clearInterval(interval);
        } else {
          const currentIntensity = intensity * (1 - (elapsed / duration));
          const randomX = (Math.random() - 0.5) * currentIntensity;
          const randomY = (Math.random() - 0.5) * currentIntensity;
          
          // Apply shake while preserving mirror state
          canvas.style.transform = `${isMirrored ? 'scaleX(-1)' : ''} translate(${randomX}px, ${randomY}px)`;
        }
      }, 1000 / 60);
    }

    setMirrorMode(args) {
      const canvas = this.getCanvas();
      if (!canvas) return;

      if (args.STATE === 'ON') {
        canvas.style.transform = 'scaleX(-1)';
      } else {
        canvas.style.transform = '';
      }
    }

    setGrayscale(args) {
      const canvas = this.getCanvas();
      if (!canvas) return;

      activeFilters.grayscale = Math.max(0, Math.min(100, Number(args.VALUE)));
      this.updateFilters(canvas);
    }

    setInvertColors(args) {
      const canvas = this.getCanvas();
      if (!canvas) return;

      activeFilters.invert = Math.max(0, Math.min(100, Number(args.VALUE)));
      this.updateFilters(canvas);
    }

    setMotionBlur(args) {
      const canvas = this.getCanvas();
      if (!canvas) return;

      activeFilters.blur = Math.max(0, Number(args.VALUE));
      this.updateFilters(canvas);
    }

    resetAllEffects() {
      const canvas = this.getCanvas();
      if (!canvas) return;

      canvas.style.transform = '';
      activeFilters.grayscale = 0;
      activeFilters.invert = 0;
      activeFilters.blur = 0;
      canvas.style.filter = 'none';
    }
  }

  Scratch.extensions.register(new ScreenJuice());
})(Scratch);
