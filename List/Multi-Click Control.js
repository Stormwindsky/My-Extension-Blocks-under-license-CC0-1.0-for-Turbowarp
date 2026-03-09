// Name: Multi-Click Control
// ID: stormwindmulticlick
// Description: Trigger events based on configurable click counts.
// License: CC0 1.0

(function (Scratch) {
  'use strict';

  class MultiClickControl {
    constructor() {
      this.counts = {
        greenFlag: 0,
        stopAll: 0,
        both: 0
      };

      Scratch.vm.runtime.on('PROJECT_START', () => {
        this.counts.greenFlag++;
        this.counts.both++;
      });

      Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => {
        this.counts.stopAll++;
        this.counts.both++;
      });
    }

    getInfo() {
      return {
        id: 'stormwindmulticlick',
        name: 'Multi-Click Control',
        color1: '#ffab19',
        blocks: [
          {
            opcode: 'hatStop',
            blockType: Scratch.BlockType.HAT,
            text: 'when [ICON] clicked [TIMES] times',
            arguments: {
              ICON: { type: Scratch.ArgumentType.IMAGE, data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNGRjRDMEMiIHJ4PSIyIi8+PC9zdmc+' },
              TIMES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'hatFlag',
            blockType: Scratch.BlockType.HAT,
            text: 'when [ICON] clicked [TIMES] times',
            arguments: {
              ICON: { type: Scratch.ArgumentType.IMAGE, data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSAySDRWMThINTNWMTBMMTMgMTJMNSAyWiIgZmlsbD0iIzRDRjA1OSIvPjwvc3ZnPg==' },
              TIMES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'hatBoth',
            blockType: Scratch.BlockType.HAT,
            text: 'when [F] and [S] clicked [TIMES] times',
            arguments: {
              F: { type: Scratch.ArgumentType.IMAGE, data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSAySDRWMThINTNWMTBMMTMgMTJMNSAyWiIgZmlsbD0iIzRDRjA1OSIvPjwvc3ZnPg==' },
              S: { type: Scratch.ArgumentType.IMAGE, data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiNGRjRDMEMiIHJ4PSIyIi8+PC9zdmc+' },
              TIMES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          '---',
          {
            opcode: 'resetCounts',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset all click counters'
          }
        ]
      };
    }

    hatStop(args) { return this.counts.stopAll >= args.TIMES; }
    hatFlag(args) { return this.counts.greenFlag >= args.TIMES; }
    hatBoth(args) { return this.counts.both >= args.TIMES; }

    resetCounts() {
      this.counts.greenFlag = 0;
      this.counts.stopAll = 0;
      this.counts.both = 0;
    }
  }

  Scratch.extensions.register(new MultiClickControl());
})(Scratch);