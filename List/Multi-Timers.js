// Name: Multi-Timers
// ID: multiTimersCC0
// Description: Create and manage multiple independent game timers.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  let timers = {};

  class MultiTimers {
    getInfo() {
      return {
        id: 'multiTimersCC0',
        name: 'Multi-Timers',
        color1: '#ffab19',
        color2: '#e69500',
        blocks: [
          {
            opcode: 'startTimer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset timer [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'cooldown' }
            }
          },
          {
            opcode: 'getTimer',
            blockType: Scratch.BlockType.REPORTER,
            text: 'time of timer [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'cooldown' }
            }
          }
        ]
      };
    }

    startTimer(args) {
      const name = args.NAME;
      timers[name] = Date.now();
    }

    getTimer(args) {
      const name = args.NAME;
      if (!timers[name]) return 0;
      // Returns time in seconds with decimal points
      return (Date.now() - timers[name]) / 1000;
    }
  }

  Scratch.extensions.register(new MultiTimers());
})(Scratch);
