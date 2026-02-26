// Name: Video Popup
// ID: videoPopupExt
// Description: Display a YouTube video in a popup overlay with a close button.
// License: CC0-1.0

(function(Scratch) {
  'use strict';

  class VideoPopup {
    constructor() {
      this.overlay = null;
    }

    getInfo() {
      return {
        id: 'videoPopupExt',
        name: 'Video Popup',
        color1: '#FF0000', // YouTube Red
        color2: '#CC0000',
        blocks: [
          {
            opcode: 'openPopup',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open video popup [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://www.youtube.com/watch?v=VegYXuOL8Es'
              }
            }
          },
          {
            opcode: 'closePopup',
            blockType: Scratch.BlockType.COMMAND,
            text: 'close video popup'
          }
        ]
      };
    }

    /**
     * Extracts the Video ID from a YouTube URL
     */
    _getYouTubeId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    }

    openPopup(args) {
      const videoId = this._getYouTubeId(String(args.URL));
      if (!videoId) return;

      // If a popup already exists, remove it
      this.closePopup();

      // Create the main overlay
      this.overlay = document.createElement('div');
      this.overlay.style.position = 'fixed';
      this.overlay.style.top = '0';
      this.overlay.style.left = '0';
      this.overlay.style.width = '100%';
      this.overlay.style.height = '100%';
      this.overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
      this.overlay.style.zIndex = '10000';
      this.overlay.style.display = 'flex';
      this.overlay.style.justifyContent = 'center';
      this.overlay.style.alignItems = 'center';

      // Create the container for the video
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.width = '80%';
      container.style.maxWidth = '800px';
      container.style.aspectRatio = '16/9';

      // Create the iframe
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;

      // Create the Close Button (X)
      const closeBtn = document.createElement('button');
      closeBtn.innerText = 'X';
      closeBtn.style.position = 'absolute';
      closeBtn.style.top = '-40px';
      closeBtn.style.right = '0';
      closeBtn.style.background = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.borderRadius = '50%';
      closeBtn.style.width = '30px';
      closeBtn.style.height = '30px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.fontWeight = 'bold';
      closeBtn.onclick = () => this.closePopup();

      // Assemble and add to the page
      container.appendChild(closeBtn);
      container.appendChild(iframe);
      this.overlay.appendChild(container);
      document.body.appendChild(this.overlay);
    }

    closePopup() {
      if (this.overlay) {
        document.body.removeChild(this.overlay);
        this.overlay = null;
      }
    }
  }

  Scratch.extensions.register(new VideoPopup());
})(Scratch);
