/**
 * TTStorm Extension for StormWarp
 * License: CC0 1.0 Universal (Public Domain)
 * Description: A "from scratch" TTS engine using Web Speech API with pitch and rate control.
 */

(function(Scratch) {
  'use strict';

  class TTStorm {
    constructor() {
      // Default settings
      this.pitch = 1;
      this.rate = 1;
    }

    getInfo() {
      return {
        id: 'ttstorm',
        name: 'TTStorm',
        color1: '#4C1CBA', // Deep Purple
        color2: '#36138A',
        blocks: [
          {
            opcode: 'speakText',
            blockType: Scratch.BlockType.COMMAND,
            text: 'speak [TEXT] in [LANG]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World'
              },
              LANG: {
                type: Scratch.ArgumentType.STRING,
                menu: 'languages',
                defaultValue: 'en-US'
              }
            }
          },
          {
            opcode: 'setPitch',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set pitch to [PITCH]',
            arguments: {
              PITCH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'setRate',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set speed to [RATE]',
            arguments: {
              RATE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'stopSpeaking',
            blockType: Scratch.BlockType.COMMAND,
            text: 'stop all speech'
          }
        ],
        menus: {
          languages: {
            acceptReporters: true,
            items: [
              { text: 'English (US)', value: 'en-US' },
              { text: 'English (UK)', value: 'en-GB' },
              { text: 'Français (France)', value: 'fr-FR' },
              { text: 'Français (Canada)', value: 'fr-CA' }
            ]
          }
        }
      };
    }

    /**
     * Core TTS function using native browser synthesis
     */
    speakText(args) {
      const text = String(args.TEXT);
      const lang = args.LANG;

      // Stop any current speech to prevent overlapping (Storm effect)
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.pitch = this.pitch;
      utterance.rate = this.rate;

      window.speechSynthesis.speak(utterance);
    }

    setPitch(args) {
      // Clamp pitch between 0 and 2 (API limits)
      this.pitch = Math.max(0, Math.min(2, Number(args.PITCH)));
    }

    setRate(args) {
      // Clamp rate between 0.1 and 10
      this.rate = Math.max(0.1, Math.min(10, Number(args.RATE)));
    }

    stopSpeaking() {
      window.speechSynthesis.cancel();
    }
  }

  // Register the extension in StormWarp
  Scratch.extensions.register(new TTStorm());
})(Scratch);