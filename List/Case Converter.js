// Name: Case Converter
// ID: caseConverterExt
// Description: Blocks to switch text between uppercase and lowercase.
// License: CC0-1.0

(function(Scratch) {
  'use strict';

  class CaseConverter {
    getInfo() {
      return {
        id: 'caseConverterExt',
        name: 'Case Converter',
        color1: '#4a90e2',
        color2: '#357abd',
        blocks: [
          {
            opcode: 'convertToUppercase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert [TEXT] to UPPERCASE',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'convertToLowercase',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert [TEXT] to lowercase',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'WORLD'
              }
            }
          }
        ]
      };
    }

    convertToUppercase(args) {
      return String(args.TEXT).toUpperCase();
    }

    convertToLowercase(args) {
      return String(args.TEXT).toLowerCase();
    }
  }

  Scratch.extensions.register(new CaseConverter());
})(Scratch);
