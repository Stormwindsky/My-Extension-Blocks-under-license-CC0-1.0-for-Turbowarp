// Name: Retro 16-Bit Sound Generator
// ID: retro16BitSFX
// Description: Generates 16-bit era FM-style and layered sound effects procedurally.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

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

  class Retro16BitSFX {
    getInfo() {
      return {
        id: 'retro16BitSFX',
        name: '16-Bit Retro Sound',
        color1: '#8a4cff',
        color2: '#6a33cc',
        blocks: [
          {
            opcode: 'play16BitPreset',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play 16-bit preset [PRESET]',
            arguments: {
              PRESET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'presets16',
                defaultValue: 'laser_fm'
              }
            }
          },
          {
            opcode: 'playFMTone',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play FM tone carrier [CARRIER] Hz mod [MOD] Hz depth [DEPTH] for [DURATION] secs',
            arguments: {
              CARRIER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 440 },
              MOD: { type: Scratch.ArgumentType.NUMBER, defaultValue: 110 },
              DEPTH: { type: Scratch.ArgumentType.NUMBER, defaultValue: 200 },
              DURATION: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.3 }
            }
          }
        ],
        menus: {
          presets16: {
            acceptReporters: true,
            items: ['laser_fm', 'explosion_16bit', 'powerup_synth', 'ambient_pad', 'retro_hit']
          }
        }
      };
    }

    play16BitPreset(args) {
      initAudio();
      const preset = args.PRESET;
      const now = audioCtx.currentTime;

      if (preset === 'laser_fm') {
        // 16-bit Sega Genesis style FM Laser
        const carrier = audioCtx.createOscillator();
        const modulator = audioCtx.createOscillator();
        const modGain = audioCtx.createGain();
        const mainGain = audioCtx.createGain();

        carrier.type = 'sawtooth';
        modulator.type = 'sine';

        // Frequency sweep
        carrier.frequency.setValueAtTime(1200, now);
        carrier.frequency.exponentialRampToValueAtTime(150, now + 0.25);
        
        modulator.frequency.setValueAtTime(300, now);
        modGain.gain.setValueAtTime(400, now);
        modGain.gain.linearRampToValueAtTime(10, now + 0.25);

        mainGain.gain.setValueAtTime(0.25, now);
        mainGain.gain.linearRampToValueAtTime(0.01, now + 0.25);

        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        carrier.connect(mainGain);
        mainGain.connect(audioCtx.destination);

        modulator.start(now);
        carrier.start(now);
        modulator.stop(now + 0.25);
        carrier.stop(now + 0.25);
      }
      else if (preset === 'explosion_16bit') {
        // Complex layered explosion (Deep rumbling + metallic FM crunch)
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        const gain2 = audioCtx.createGain();

        // Low rumble
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(90, now);
        osc1.frequency.linearRampToValueAtTime(20, now + 0.5);
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.linearRampToValueAtTime(0.01, now + 0.5);

        // Metallic crunch
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(180, now);
        osc2.frequency.linearRampToValueAtTime(40, now + 0.2);
        gain2.gain.setValueAtTime(0.2, now);
        gain2.gain.linearRampToValueAtTime(0.01, now + 0.2);

        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(audioCtx.destination);
        gain2.connect(audioCtx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
      }
      else if (preset === 'powerup_synth') {
        // Polyphonic/Chimed 16-bit melody
        const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        notes.forEach((freq, index) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + index * 0.06);
          
          gain.gain.setValueAtTime(0.0, now);
          gain.gain.linearRampToValueAtTime(0.15, now + index * 0.06 + 0.02);
          gain.gain.linearRampToValueAtTime(0.01, now + index * 0.06 + 0.2);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + index * 0.06);
          osc.stop(now + index * 0.06 + 0.2);
        });
      }
      else if (preset === 'ambient_pad') {
        // Soft SNES-like chord pad
        const freqs = [196.00, 246.94, 293.66, 392.00]; // G3, B3, D4, G4
        freqs.forEach(freq => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          
          // Slow attack and slow decay (classic 16-bit RPG style)
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.8);

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.8);
        });
      }
      else if (preset === 'retro_hit') {
        // Classic Orchestral/Action Hit
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    }

    playFMTone(args) {
      initAudio();
      const carrierFreq = Number(args.CARRIER) || 440;
      const modFreq = Number(args.MOD) || 110;
      const depth = Number(args.DEPTH) || 200;
      const duration = Number(args.DURATION) || 0.3;
      const now = audioCtx.currentTime;

      const carrier = audioCtx.createOscillator();
      const modulator = audioCtx.createOscillator();
      const modGain = audioCtx.createGain();
      const mainGain = audioCtx.createGain();

      carrier.type = 'sine';
      modulator.type = 'sine';

      carrier.frequency.setValueAtTime(carrierFreq, now);
      modulator.frequency.setValueAtTime(modFreq, now);
      modGain.gain.setValueAtTime(depth, now);
      
      mainGain.gain.setValueAtTime(0.2, now);
      mainGain.gain.linearRampToValueAtTime(0.01, now + duration);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);
      carrier.connect(mainGain);
      mainGain.connect(audioCtx.destination);

      modulator.start(now);
      carrier.start(now);
      modulator.stop(now + duration);
      carrier.stop(now + duration);
    }
  }

  Scratch.extensions.register(new Retro16BitSFX());
})(Scratch);
