// Name: Experimental Page Destroyer
// ID: experimentalDestroyerCC0
// Description: Experimental blocks to test page deletion, CSS wiping, and tab crashing safely.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  class ExperimentalDestroyer {
    getInfo() {
      return {
        id: 'experimentalDestroyerCC0',
        name: 'Experimental Tools',
        color1: '#d62828',
        color2: '#003049',
        blocks: [
          {
            opcode: 'crashTab',
            blockType: Scratch.BlockType.COMMAND,
            text: 'force crash browser tab'
          },
          {
            opcode: 'wipeContent',
            blockType: Scratch.BlockType.COMMAND,
            text: 'wipe page [TARGET]',
            arguments: {
              TARGET: {
                type: Scratch.ArgumentType.STRING,
                menu: 'wipeMenu',
                defaultValue: 'CSS Only'
              }
            }
          }
        ],
        menus: {
          wipeMenu: {
            acceptReporters: false,
            items: ['CSS Only', 'JavaScript Objects', 'HTML Body', 'Everything']
          }
        }
      };
    }

    crashTab() {
      // Infinitly allocates memory in a fraction of a second to force a browser out-of-memory crash
      console.warn("TurboWarp: Intentional tab crash triggered.");
      const totalCrash = [];
      while (true) {
        totalCrash.push(new Array(1000000).fill("CRASH"));
      }
    }

    wipeContent(args) {
      const target = args.TARGET;

      if (target === 'CSS Only' || target === 'Everything') {
        // Remove all stylesheet links and style tags from the document
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(element => element.remove());
        
        // Inline styles wiper for the body
        document.body.removeAttribute('style');
      }

      if (target === 'HTML Body' || target === 'Everything') {
        // Clears the entire visible DOM inside the page body
        document.body.innerHTML = '<h1>Page Content Wiped Experimentally</h1>';
      }

      if (target === 'JavaScript Objects' || target === 'Everything') {
        // Destroys core JavaScript bindings used by the extension/page context
        // This will break the TurboWarp VM execution loop completely
        if (window.Scratch) window.Scratch = null;
        
        // Nullify common Web APIs on this tab instance
        window.audioCtx = null;
        Object.keys(window).forEach(key => {
          try {
            window[key] = null;
          } catch (e) {
            // Some global properties are read-only and will safely skip
          }
        });
      }
    }
  }

  Scratch.extensions.register(new ExperimentalDestroyer());
})(Scratch);
