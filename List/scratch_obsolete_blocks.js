// Name: Scratch Obsolete Blocks Restoration
// ID: scratchObsoleteBlocksCC0
// Description: Recreates the legendary corrupted red blocks from Scratch 1.4 and 2.0 projects.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  class ScratchObsoleteBlocks {
    getInfo() {
      return {
        id: 'scratchObsoleteBlocksCC0',
        name: 'Obsolete Blocks',
        color1: '#d42626', // Rouge d'erreur Scratch 2.0 original
        color2: '#b31e1e',
        blocks: [
          {
            opcode: 'undefinedBlock',
            blockType: Scratch.BlockType.COMMAND,
            text: 'undefined' // strict sans majuscule
          },
          {
            opcode: 'obsoleteBlock',
            blockType: Scratch.BlockType.COMMAND,
            text: 'obsolete!' // strict sans majuscule
          }
        ]
      };
    }

    // Ces blocs ne font absolument rien par définition, tout comme les vrais blocs corrompus !
    undefinedBlock() {
      // Intentionally blank
    }

    obsoleteBlock() {
      // Intentionally blank
    }
  }

  Scratch.extensions.register(new ScratchObsoleteBlocks());
})(Scratch);
