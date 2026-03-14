// Name: Network Status
// ID: networkstatus
// Description: Detects if the user is connected to the internet.
// License: CC0 1.0

(function(Scratch) {
  'use strict';

  class NetworkStatus {
    getInfo() {
      return {
        id: 'networkstatus',
        name: 'Network Status',
        color1: '#4C97FF', // Couleur bleue standard Scratch
        blocks: [
          {
            opcode: 'isOnline',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is connected to internet?'
          }
        ]
      };
    }

    isOnline() {
      // navigator.onLine returns true if the browser has network access
      return !!navigator.onLine;
    }
  }

  Scratch.extensions.register(new NetworkStatus());
})(Scratch);