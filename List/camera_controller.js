// Name: Advanced Camera Controller
// ID: advancedCameraCC0
// Description: Smoothly control game camera zoom, pan, and target tracking directly on the stage canvas.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  // Camera state tracking
  let cameraState = {
    zoom: 100, // Percentage
    x: 0,      // Offset X
    y: 0,      // Offset Y
    targetTarget: null,
    intervalId: null
  };

  class CameraController {
    getInfo() {
      return {
        id: 'advancedCameraCC0',
        name: 'Camera Controller',
        color1: '#00a896',
        color2: '#028090',
        blocks: [
          {
            opcode: 'setZoom',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set camera zoom to [ZOOM] %',
            arguments: {
              ZOOM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'setPan',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set camera X [X] Y [Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'changePan',
            blockType: Scratch.BlockType.COMMAND,
            text: 'change camera X by [DX] Y by [DY]',
            arguments: {
              DX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              DY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'trackSprite',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set camera tracking to sprite [SPRITE]',
            arguments: {
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spritesMenu' }
            }
          },
          {
            opcode: 'resetCamera',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset camera settings'
          }
        ],
        menus: {
          spritesMenu: {
            acceptReporters: true,
            // Dynamically loads available sprites from the Scratch project
            items: '_getTargets'
          }
        }
      };
    }

    getCanvas() {
      return Scratch.vm.runtime.renderer.canvas;
    }

    _getTargets() {
      const targets = Scratch.vm.runtime.targets;
      // Filter out the background stage to only list actual moving sprites
      const spriteNames = targets
        .filter(target => !target.isStage)
        .map(target => target.getName());
      
      if (spriteNames.length === 0) return ['None'];
      return spriteNames;
    }

    applyTransforms() {
      const canvas = this.getCanvas();
      if (!canvas) return;

      const scale = cameraState.zoom / 100;
      // Invert Y axes because Scratch Y goes up, but Web CSS transform goes down
      const translateX = -cameraState.x;
      const translateY = cameraState.y;

      // Combine scale (zoom) and translation (movement) safely
      canvas.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }

    setZoom(args) {
      cameraState.zoom = Math.max(10, Number(args.ZOOM)); // Safety limit minimum 10%
      this.applyTransforms();
    }

    setPan(args) {
      this.stopTracking();
      cameraState.x = Number(args.X);
      cameraState.y = Number(args.Y);
      this.applyTransforms();
    }

    changePan(args) {
      this.stopTracking();
      cameraState.x += Number(args.DX);
      cameraState.y += Number(args.DY);
      this.applyTransforms();
    }

    trackSprite(args) {
      this.stopTracking();
      const spriteName = args.SPRITE;
      
      cameraState.intervalId = setInterval(() => {
        const targets = Scratch.vm.runtime.targets;
        const targetSprite = targets.find(t => !t.isStage && t.getName() === spriteName);
        
        if (targetSprite) {
          // Updates camera to align directly with the sprite's real-time internal coordinates
          cameraState.x = targetSprite.x;
          cameraState.y = targetSprite.y;
          this.applyTransforms();
        }
      }, 1000 / 60); // Fluid 60 FPS update loop
    }

    stopTracking() {
      if (cameraState.intervalId) {
        clearInterval(cameraState.intervalId);
        cameraState.intervalId = null;
      }
    }

    resetCamera() {
      this.stopTracking();
      cameraState.zoom = 100;
      cameraState.x = 0;
      cameraState.y = 0;
      
      const canvas = this.getCanvas();
      if (canvas) {
        canvas.style.transform = '';
      }
    }
  }

  Scratch.extensions.register(new CameraController());
})(Scratch);
