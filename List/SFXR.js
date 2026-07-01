// Name: Retro Sound Generator (SFXR)
// ID: retroSFXR
// Description: Generates retro 8-bit sound effects procedurally using the Web Audio API.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  // Setup Web Audio API context safely
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  class RetroSFXR {
    getInfo() {
      return {
        id: 'retroSFXR',
        name: 'Retro Sound (SFXR)',
        color1: '#4c97ff',
        color2: '#3373cc',
        blocks: [
          {
            opcode: 'playPresetSound',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play sound preset [PRESET]',
            arguments: {
              PRESET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'presets',
                defaultValue: 'laser'
              }
            }
          },
          {
            opcode: 'playCustomTone',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play wave [TYPE] at [FREQ] Hz for [DURATION] secs',
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'waveTypes',
                defaultValue: 'square'
              },
              FREQ: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 440
              },
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.2
              }
            }
          }
        ],
        menus: {
          presets: {
            acceptReporters: true,
            items: ['laser', 'explosion', 'jump', 'coin', 'powerup']
          },
          waveTypes: {
            acceptReporters: true,
            items: ['sine', 'square', 'sawtooth', 'triangle']
          }
        }
      };
    }

    playPresetSound(args) {
      initAudio();
      const preset = args.PRESET;
      const now = audioCtx.currentTime;

      // Create core audio nodes
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Procedural Sound Design Logic
      if (preset === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } 
      else if (preset === 'explosion') {
        // Pseudo-noise using a fast frequency drop on a square wave
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(10, now + 0.4);
        
        // Add random volume jitter to simulate explosion crunch
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.4);
        
        osc.start(now);
        osc.stop(now + 0.4);
      } 
      else if (preset === 'jump') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } 
      else if (preset === 'coin') {
        osc.type = 'sine';
        // Classic arpeggio coin effect (two distinct tones quickly)
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(880.00, now + 0.07); // A5
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.07);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
      else if (preset === 'powerup') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(400, now + 0.1);
        osc.frequency.linearRampToValueAtTime(800, now + 0.2);
        gainNode.gain.setValueAtTime(0.25, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    }

    playCustomTone(args) {
      initAudio();
      const type = args.TYPE;
      const freq = Number(args.FREQ) || 440;
      const duration = Number(args.DURATION) || 0.2;
      
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      
      // Clean fade out to prevent audio clicks
      gainNode.gain.setValueAtTime(0.25, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + duration);
    }
  }

  Scratch.extensions.register(new RetroSFXR());
})(Scratch);
