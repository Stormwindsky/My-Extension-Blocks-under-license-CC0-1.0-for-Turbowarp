// Name: FSK Audio Transmitter
// ID: fskAudioTransmitter
// Description: Play FSK signals with specific block titles.
// License: CC0-1.0

(function(Scratch) {
  'use strict';

  class FSKAudio {
    constructor() {
      this.audioCtx = null;
    }

    getInfo() {
      return {
        id: 'fskAudioTransmitter',
        name: 'FSK Audio',
        color1: '#ff4c4c',
        color2: '#cc0000',
        blocks: [
          {
            opcode: 'playFSKAndWait',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play FSK [TEXT] until done',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello'
              }
            }
          },
          {
            opcode: 'playFSK',
            blockType: Scratch.BlockType.COMMAND,
            text: 'start FSK [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'World'
              }
            }
          }
        ]
      };
    }

    _startFSK(text) {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      const bitDuration = 0.05; 
      const freq0 = 1200;
      const freq1 = 2200;

      let bits = "";
      for (let i = 0; i < text.length; i++) {
        bits += text.charCodeAt(i).toString(2).padStart(8, '0');
      }

      const now = this.audioCtx.currentTime;
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      for (let i = 0; i < bits.length; i++) {
        const freq = bits[i] === '1' ? freq1 : freq0;
        oscillator.frequency.setValueAtTime(freq, now + (i * bitDuration));
      }

      oscillator.start(now);
      const totalDuration = bits.length * bitDuration;
      oscillator.stop(now + totalDuration);

      return totalDuration;
    }

    async playFSKAndWait(args) {
      const duration = this._startFSK(String(args.TEXT));
      await new Promise(resolve => setTimeout(resolve, duration * 1000));
    }

    playFSK(args) {
      this._startFSK(String(args.TEXT));
    }
  }

  Scratch.extensions.register(new FSKAudio());
})(Scratch);
