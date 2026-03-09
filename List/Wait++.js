// Name: Wait++
// ID: waitplusplus
// Description: Advanced wait blocks for long durations (minutes, hours, weeks, months, years).
// License: CC0 1.0

(function(Scratch) {
  'use strict';

  class WaitPlusPlus {
    getInfo() {
      return {
        id: 'waitplusplus',
        name: 'Wait++',
        color1: '#FFAB19',
        color2: '#EC9C13',
        blocks: [
          {
            opcode: 'waitMinutes',
            blockType: Scratch.BlockType.COMMAND,
            text: 'wait [DURATION] minutes',
            arguments: {
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'waitHours',
            blockType: Scratch.BlockType.COMMAND,
            text: 'wait [DURATION] hours',
            arguments: {
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'waitWeeks',
            blockType: Scratch.BlockType.COMMAND,
            text: 'wait [DURATION] weeks',
            arguments: {
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'waitMonths',
            blockType: Scratch.BlockType.COMMAND,
            text: 'wait [DURATION] months',
            arguments: {
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
          {
            opcode: 'waitYears',
            blockType: Scratch.BlockType.COMMAND,
            text: 'wait [DURATION] years',
            arguments: {
              DURATION: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          }
        ]
      };
    }

    waitMinutes(args) {
      const duration = Number(args.DURATION) || 0;
      return new Promise(resolve => {
        setTimeout(resolve, duration * 60 * 1000);
      });
    }

    waitHours(args) {
      const duration = Number(args.DURATION) || 0;
      return new Promise(resolve => {
        setTimeout(resolve, duration * 60 * 60 * 1000);
      });
    }

    waitWeeks(args) {
      const duration = Number(args.DURATION) || 0;
      return new Promise(resolve => {
        setTimeout(resolve, duration * 7 * 24 * 60 * 60 * 1000);
      });
    }

    waitMonths(args) {
      const duration = Number(args.DURATION) || 0;
      // Approximation: 1 month = 30 days
      return new Promise(resolve => {
        setTimeout(resolve, duration * 30 * 24 * 60 * 60 * 1000);
      });
    }

    waitYears(args) {
      const duration = Number(args.DURATION) || 0;
      // Approximation: 1 year = 365 days
      return new Promise(resolve => {
        setTimeout(resolve, duration * 365 * 24 * 60 * 60 * 1000);
      });
    }
  }

  Scratch.extensions.register(new WaitPlusPlus());
})(Scratch);