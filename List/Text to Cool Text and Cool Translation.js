/**
 * Extension: Text to Cool Text and Cool Translation
 * License: CC0 1.0 Universal
 */

(function (Scratch) {
  'use strict';

  class CoolTextExtension {
    getInfo() {
      return {
        id: 'cooltexttranslation',
        name: 'Text to Cool Text and Cool Translation',
        color1: '#4a90e2',
        color2: '#357abd',
        blocks: [
          {
            opcode: 'toBinary',
            blockType: Scratch.BlockType.REPORTER,
            text: 'text to binary [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' }
            }
          },
          {
            opcode: 'toMirror',
            blockType: Scratch.BlockType.REPORTER,
            text: 'mirror text [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' }
            }
          },
          {
            opcode: 'toGlitch',
            blockType: Scratch.BlockType.REPORTER,
            text: 'glitch text [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' }
            }
          },
          {
            opcode: 'toDingbats',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert [TEXT] to [FONT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' },
              FONT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'fontMenu',
                defaultValue: 'Wingdings'
              }
            }
          }
        ],
        menus: {
          fontMenu: {
            acceptReporters: true,
            items: ['Wingdings', 'Webdings', 'Zapf Dingbats']
          }
        }
      };
    }

    toBinary(args) {
      return args.TEXT.split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
    }

    toMirror(args) {
      const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const mirrored = "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnuʌʍxʎz∀qƆpƎℲפHIſʞ˥WNOԀQᴚS┴∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86";
      return args.TEXT.split('').map(c => {
        const i = normal.indexOf(c);
        return i !== -1 ? mirrored[i] : c;
      }).reverse().join('');
    }

    toGlitch(args) {
      const chars = args.TEXT.split('');
      const noise = ['⛼', '⟁', '☒', '', '░', '▒', '▓', 'ℵ'];
      return chars.map(c => c + (Math.random() > 0.7 ? noise[Math.floor(Math.random() * noise.length)] : '')).join('');
    }

    toDingbats(args) {
      // Note: This maps standard characters to their Unicode equivalent positions for these fonts
      // for display in a standard browser environment.
      const text = args.TEXT;
      if (args.FONT === 'Wingdings') {
        // Simple shift logic or mapping for demo purposes
        return text.split('').map(c => String.fromCodePoint(0x2700 + (c.charCodeAt(0) % 50))).join('');
      } else if (args.FONT === 'Webdings') {
        return text.split('').map(c => String.fromCodePoint(0x1F500 + (c.charCodeAt(0) % 50))).join('');
      } else if (args.FONT === 'Zapf Dingbats') {
        return text.split('').map(c => String.fromCodePoint(0x2701 + (c.charCodeAt(0) % 50))).join('');
      }
      return text;
    }
  }

  Scratch.extensions.register(new CoolTextExtension());
})(Scratch);