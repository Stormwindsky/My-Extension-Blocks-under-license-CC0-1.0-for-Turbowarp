// Name: Storm iFrame Loader
// ID: stormIframeLoaderCC0
// Description: Advanced iFrame loader with scale/viewport resize behaviors and raw HTML string injection.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  let iframeElement = null;
  let resizeBehavior = 'scale';

  class StormIframeLoader {
    getInfo() {
      return {
        id: 'stormIframeLoaderCC0',
        name: 'Storm iFrame Loader',
        color1: '#2a9d8f',
        color2: '#264653',
        blocks: [
          {
            opcode: 'createIframe',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open iFrame with URL [URL]',
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://example.com/' }
            }
          },
          {
            opcode: 'injectRawHTML',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open iFrame with raw HTML [HTML]',
            arguments: {
              HTML: { type: Scratch.ArgumentType.STRING, defaultValue: '<h1>Hello World</h1><p>Local script test.</p>' }
            }
          },
          {
            opcode: 'setResizeBehavior',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set iframe resize behavior to [BEHAVIOR]',
            arguments: {
              BEHAVIOR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'resizeMenu',
                defaultValue: 'scale'
              }
            }
          },
          {
            opcode: 'showIframe',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show iFrame'
          },
          {
            opcode: 'hideIframe',
            blockType: Scratch.BlockType.COMMAND,
            text: 'hide iFrame'
          },
          {
            opcode: 'closeIframe',
            blockType: Scratch.BlockType.COMMAND,
            text: 'close and delete iFrame'
          }
        ],
        menus: {
          resizeMenu: {
            acceptReporters: false,
            items: ['scale', 'viewport']
          }
        }
      };
    }

    _applyStyles() {
      if (!iframeElement) return;

      iframeElement.style.position = 'absolute';
      iframeElement.style.border = 'none';
      iframeElement.style.zIndex = '100000';
      iframeElement.style.backgroundColor = '#ffffff';

      if (resizeBehavior === 'scale') {
        iframeElement.style.top = '0';
        iframeElement.style.left = '0';
        iframeElement.style.width = '100%';
        iframeElement.style.height = '100%';
        iframeElement.style.transform = '';
      } else if (resizeBehavior === 'viewport') {
        iframeElement.style.top = '0';
        iframeElement.style.left = '0';
        iframeElement.style.width = '480px';
        iframeElement.style.height = '360px';
        iframeElement.style.transformOrigin = 'top left';
      }
    }

    _ensureElement() {
      const canvas = Scratch.vm.runtime.renderer.canvas;
      if (!canvas || !canvas.parentElement) return null;

      if (!iframeElement) {
        iframeElement = document.createElement('iframe');
        canvas.parentElement.appendChild(iframeElement);
      }
      this._applyStyles();
      return iframeElement;
    }

    createIframe(args) {
      const iframe = this._ensureElement();
      if (iframe) {
        iframe.src = args.URL;
        iframe.style.display = 'block';
      }
    }

    injectRawHTML(args) {
      const iframe = this._ensureElement();
      if (iframe) {
        const encodedHTML = encodeURIComponent(args.HTML);
        iframe.src = `data:text/html;charset=utf-8,${encodedHTML}`;
        iframe.style.display = 'block';
      }
    }

    setResizeBehavior(args) {
      resizeBehavior = args.BEHAVIOR;
      this._applyStyles();
    }

    showIframe() {
      if (iframeElement) iframeElement.style.display = 'block';
    }

    hideIframe() {
      if (iframeElement) iframeElement.style.display = 'none';
    }

    closeIframe() {
      if (iframeElement) {
        if (iframeElement.parentElement) iframeElement.remove();
        iframeElement = null;
      }
    }
  }

  Scratch.extensions.register(new StormIframeLoader());
})(Scratch);
