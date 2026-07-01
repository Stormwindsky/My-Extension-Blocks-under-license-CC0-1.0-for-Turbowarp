// Name: Glitch & CSS Corruptor
// ID: glitchCorruptorCC0
// Description: Rationally corrupts CSS properties and injects runtime JS glitches using a seedable PRNG.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  // Mulberry32 Generator - Seedable PRNG
  function createRandom(seed) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  let lastGeneratedSeed = 0;

  class GlitchCorruptor {
    getInfo() {
      return {
        id: 'glitchCorruptorCC0',
        name: 'Glitch Corruptor',
        color1: '#7209b7',
        color2: '#3f37c9',
        blocks: [
          {
            opcode: 'corruptPage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'corrupt CSS and JS with seed [SEED] intensity [INTENSITY] %',
            arguments: {
              SEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              INTENSITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
            }
          },
          {
            opcode: 'getLastSeed',
            blockType: Scratch.BlockType.REPORTER,
            text: 'last corruption seed'
          }
        ]
      };
    }

    corruptPage(args) {
      let seed = Number(args.SEED);
      // If seed is 0 or invalid, generate a random one
      if (seed === 0) {
        seed = Math.floor(Math.random() * 9999999);
      }
      lastGeneratedSeed = seed;

      const rand = createRandom(seed);
      const intensity = Math.min(100, Math.max(0, Number(args.INTENSITY))) / 100;

      // --- 1. CORRUPTION DU CSS ---
      // Target elements without deleting or modifying the raw HTML structures
      const allElements = document.querySelectorAll('div, canvas, span, p, img, button');
      
      const glitchFilters = [
        'hue-rotate(90deg) invert(100%)',
        'blur(4px) contrast(300%)',
        'skewX(30deg) saturate(0%)',
        'matrix(1, 2, -1, 1, 40, 40)',
        'brightness(500%) sepia(100%)'
      ];

      allElements.forEach(element => {
        // Apply corruption conditionally based on the intensity percentage
        if (rand() < intensity) {
          const glitchType = Math.floor(rand() * glitchFilters.length);
          
          // Randomly mess up CSS positioning and visuals
          element.style.filter = glitchFilters[glitchType];
          element.style.transform = `translate(${(rand() * 40) - 20}px, ${(rand() * 40) - 20}px) rotate(${(rand() * 20) - 10}deg)`;
          element.style.opacity = rand() > 0.3 ? '0.8' : '0.2';
          
          if (rand() < 0.2) {
            element.style.backgroundColor = rand() > 0.5 ? '#ff003c' : '#00f0ff';
            element.style.color = '#000000';
          }
        }
      });

      // --- 2. CORRUPTION DU JAVASCRIPT ---
      if (intensity > 0.7 && rand() < intensity) {
        // Break fundamental mathematical array logic on the window context dynamically
        // This simulates severe core data corruption in scripts
        try {
          Math.sin = (original => function(x) {
            return rand() < 0.1 ? original(x) * (rand() * 5) : original(x);
          })(Math.sin);

          Math.cos = (original => function(x) {
            return rand() < 0.1 ? original(x) * -1 : original(x);
          })(Math.cos);
        } catch (e) {}
      }

      if (intensity > 0.9 && rand() < intensity) {
        // Extreme JS corruption: sabotage the primary execution frame loop
        window.requestAnimationFrame = function(callback) {
          setTimeout(callback, 1000 / (5 + Math.floor(rand() * 15))); // Forces the tab into an unplayable lag (5-20fps)
        };
      }
    }

    getLastSeed() {
      return lastGeneratedSeed;
    }
  }

  Scratch.extensions.register(new GlitchCorruptor());
})(Scratch);
