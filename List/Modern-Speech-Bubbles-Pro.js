// Name: Modern Speech Bubbles Pro
// ID: modernSpeechBubblesProCC0
// Description: Create highly customizable speech/thought bubbles, supporting advanced sharp styles, images, offsets, and timers.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  let activeBubbles = {};

  class ModernSpeechBubblesPro {
    getInfo() {
      return {
        id: 'modernSpeechBubblesProCC0',
        name: 'Modern Speech Pro',
        color1: '#4a90e2',
        color2: '#357abd',
        blocks: [
          {
            opcode: 'sayModernPro',
            blockType: Scratch.BlockType.COMMAND,
            text: 'sprite [SPRITE] show bubble [CONTENT_TYPE] [TEXT_OR_URL] style [STYLE] bg [BG_COLOR] text [TXT_COLOR] size [SIZE] px offset X [OX] Y [OY] wait [TIME] secs',
            arguments: {
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spritesMenu' },
              CONTENT_TYPE: { type: Scratch.ArgumentType.STRING, menu: 'contentTypeMenu', defaultValue: 'text' },
              TEXT_OR_URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' },
              STYLE: { type: Scratch.ArgumentType.STRING, menu: 'styleMenu', defaultValue: 'normal' },
              BG_COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#ffffff' },
              TXT_COLOR: { type: Scratch.ArgumentType.STRING, defaultValue: '#333333' },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 16 },
              OX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              OY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              TIME: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
          {
            opcode: 'clearBubble',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear bubble for sprite [SPRITE]',
            arguments: {
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spritesMenu' }
            }
          },
          {
            opcode: 'clearAllBubbles',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear all modern bubbles'
          }
        ],
        menus: {
          spritesMenu: { acceptReporters: true, items: '_getTargets' },
          contentTypeMenu: { acceptReporters: false, items: ['text', 'image/gif URL'] },
          styleMenu: { acceptReporters: false, items: ['normal', 'shout', 'thought', 'angry'] }
        }
      };
    }

    _getTargets() {
      const targets = Scratch.vm.runtime.targets;
      const spriteNames = targets.filter(t => !t.isStage).map(t => t.getName());
      return spriteNames.length > 0 ? spriteNames : ['None'];
    }

    sayModernPro(args) {
      const canvas = Scratch.vm.runtime.renderer.canvas;
      if (!canvas || !canvas.parentElement) return;

      const spriteName = args.SPRITE;
      const targets = Scratch.vm.runtime.targets;
      const targetSprite = targets.find(t => !t.isStage && t.getName() === spriteName);
      if (!targetSprite) return;

      if (activeBubbles[spriteName]) {
        this._removeBubble(spriteName);
      }

      const bubble = document.createElement('div');
      bubble.style.position = 'absolute';
      bubble.style.backgroundColor = args.BG_COLOR;
      bubble.style.color = args.TXT_COLOR;
      bubble.style.padding = '14px 20px';
      bubble.style.fontFamily = '"Segoe UI", Roboto, sans-serif';
      bubble.style.fontWeight = 'bold';
      bubble.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
      bubble.style.maxWidth = '260px';
      bubble.style.pointerEvents = 'none';
      bubble.style.zIndex = '99999';
      bubble.style.transform = 'translate(-50%, -100%)';
      bubble.style.boxSizing = 'border-box';
      bubble.style.display = 'flex';
      bubble.style.alignItems = 'center';
      bubble.style.justifyContent = 'center';
      bubble.style.textAlign = 'center';

      // Injecter les animations globales si non présentes
      if (!document.getElementById('bubble-effects-css')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'bubble-effects-css';
        styleTag.innerHTML = `
          @keyframes angryVibration { 
            0% { transform: translate(-51%, -101%) scale(1.02); } 
            50% { transform: translate(-49%, -99%) scale(0.98); } 
            100% { transform: translate(-50%, -100%) scale(1); } 
          }
          @keyframes shoutPulse {
            0% { transform: translate(-50%, -100%) scale(1); }
            50% { transform: translate(-50%, -100%) scale(1.05); }
            100% { transform: translate(-50%, -100%) scale(1); }
          }
        `;
        document.head.appendChild(styleTag);
      }

      // --- 1. GESTION DU CONTENU ---
      if (args.CONTENT_TYPE === 'image/gif URL') {
        const img = document.createElement('img');
        img.src = args.TEXT_OR_URL;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '140px';
        img.style.display = 'block';
        img.style.borderRadius = '4px';
        bubble.appendChild(img);
      } else {
        bubble.innerText = args.TEXT_OR_URL;
        bubble.style.fontSize = `${Number(args.SIZE) || 16}px`;
      }

      // --- 2. DESIGN DES EXPRESSIONS (CLIP-PATHS MULTI-POINTS) ---
      const style = args.STYLE;
      const arrow = document.createElement('div');
      arrow.style.position = 'absolute';

      if (style === 'normal') {
        bubble.style.borderRadius = '16px';
        arrow.style.bottom = '-8px';
        arrow.style.left = '50%';
        arrow.style.transform = 'translateX(-50%)';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.borderLeft = '8px solid transparent';
        arrow.style.borderRight = '8px solid transparent';
        arrow.style.borderTop = `8px solid ${args.BG_COLOR}`;
        bubble.appendChild(arrow);
      } 
      else if (style === 'angry') {
        // STYLE FÂCHÉ : Forme d'étoile irrégulière tranchante (pics prononcés)
        bubble.style.borderRadius = '0px';
        bubble.style.padding = '25px 30px';
        // Clip-path complexe à 20 points pour générer de vraies pointes "piquant" tout autour
        bubble.style.clipPath = 'polygon(0% 20%, 15% 25%, 10% 0%, 45% 12%, 50% 0%, 60% 15%, 90% 2%, 85% 30%, 100% 25%, 92% 55%, 100% 80%, 75% 75%, 70% 100%, 55% 82%, 45% 95%, 35% 80%, 10% 90%, 15% 65%, 0% 60%, 8% 40%)';
        bubble.style.animation = 'angryVibration 0.08s infinite';
      } 
      else if (style === 'shout') {
        // STYLE CRIER : Éclats d'impact style BD manga (grands pics structurés)
        bubble.style.borderRadius = '0px';
        bubble.style.padding = '25px';
        bubble.style.clipPath = 'polygon(5% 5%, 25% 12%, 50% 2%, 75% 12%, 95% 5%, 88% 35%, 100% 50%, 88% 65%, 95% 95%, 70% 85%, 50% 100%, 30% 85%, 5% 95%, 12% 65%, 0% 50%, 12% 35%)';
        bubble.style.animation = 'shoutPulse 0.3s infinite ease-in-out';
      } 
      else if (style === 'thought') {
        // STYLE PENSÉE : Nuage doux et petites bulles distinctes
        bubble.style.borderRadius = '30px';
        
        const dot1 = document.createElement('div');
        dot1.style.position = 'absolute';
        dot1.style.bottom = '-12px';
        dot1.style.left = '50%';
        dot1.style.width = '14px';
        dot1.style.height = '14px';
        dot1.style.borderRadius = '50%';
        dot1.style.backgroundColor = args.BG_COLOR;
        
        const dot2 = document.createElement('div');
        dot2.style.position = 'absolute';
        dot2.style.bottom = '-24px';
        dot2.style.left = '45%';
        dot2.style.width = '8px';
        dot2.style.height = '8px';
        dot2.style.borderRadius = '50%';
        dot2.style.backgroundColor = args.BG_COLOR;
        
        bubble.appendChild(dot1);
        bubble.appendChild(dot2);
      }

      canvas.parentElement.appendChild(bubble);

      // --- 3. CALCUL DU POSITIONNEMENT ET DES OFFSETS ---
      const offsetX = Number(args.OX) || 0;
      const offsetY = Number(args.OY) || 0;

      const updateInterval = setInterval(() => {
        const currentTarget = Scratch.vm.runtime.targets.find(t => !t.isStage && t.getName() === spriteName);
        if (!currentTarget) {
          this._removeBubble(spriteName);
          return;
        }
        
        const pctX = (((currentTarget.x + offsetX) + 240) / 480) * 100;
        const spriteHeightOffset = currentTarget.size ? currentTarget.size / 3 : 25; 
        const pctY = ((180 - (currentTarget.y + offsetY) - spriteHeightOffset) / 360) * 100;

        bubble.style.left = `${pctX}%`;
        bubble.style.top = `${pctY}%`;
      }, 1000 / 60);

      // --- 4. EXPIRATION DU CHRONOMÈTRE ---
      let timeoutId = null;
      const waitTime = Number(args.TIME);
      if (waitTime > 0) {
        timeoutId = setTimeout(() => {
          this._removeBubble(spriteName);
        }, waitTime * 1000);
      }

      activeBubbles[spriteName] = {
        element: bubble,
        interval: updateInterval,
        timeout: timeoutId
      };
    }

    clearBubble(args) {
      this._removeBubble(args.SPRITE);
    }

    clearAllBubbles() {
      Object.keys(activeBubbles).forEach(spriteName => {
        this._removeBubble(spriteName);
      });
    }

    _removeBubble(spriteName) {
      if (activeBubbles[spriteName]) {
        clearInterval(activeBubbles[spriteName].interval);
        if (activeBubbles[spriteName].timeout) clearTimeout(activeBubbles[spriteName].timeout);
        if (activeBubbles[spriteName].element.parentElement) {
          activeBubbles[spriteName].element.remove();
        }
        delete activeBubbles[spriteName];
      }
    }
  }

  Scratch.extensions.register(new ModernSpeechBubblesPro());
})(Scratch);
