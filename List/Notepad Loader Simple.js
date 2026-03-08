// Name: Notepad Loader Simple
// ID: stormwindNotepadSimple
// Description: Opens stormwindsky.com Notepad in a popup iframe.
// License: CC0 1.0

(function (Scratch) {
  'use strict';

  let isOpen = false;

  // Styles CSS
  const style = document.createElement('style');
  style.textContent = `
    .notepad-container {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      display: flex; justify-content: center; align-items: center;
      z-index: 10000; background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(3px); opacity: 0; visibility: hidden;
      transition: all 0.25s ease-out;
    }
    .notepad-container.active { opacity: 1; visibility: visible; }
    .notepad-modal {
      width: 85%; height: 85%; background: #fff; border-radius: 15px;
      position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.4);
      transform: translateY(20px) scale(0.95); transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    .notepad-container.active .notepad-modal { transform: translateY(0) scale(1); }
    .notepad-close {
      position: absolute; top: 10px; right: 15px;
      background: #ff4757; color: white; border: none;
      border-radius: 50%; width: 35px; height: 35px; cursor: pointer;
      font-weight: bold; font-size: 20px; z-index: 10002;
      display: flex; justify-content: center; align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .notepad-close:hover { background: #ff2e40; }
    .notepad-iframe { width: 100%; height: 100%; border: none; border-radius: 15px; }
  `;
  document.head.appendChild(style);

  // Création du DOM
  const container = document.createElement('div');
  container.className = 'notepad-container';
  const modal = document.createElement('div');
  modal.className = 'notepad-modal';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'notepad-close';
  closeBtn.innerHTML = '×';
  const iframe = document.createElement('iframe');
  iframe.className = 'notepad-iframe';

  modal.appendChild(closeBtn);
  modal.appendChild(iframe);
  container.appendChild(modal);
  document.body.appendChild(container);

  class NotepadExtension {
    getInfo() {
      return {
        id: 'stormwindNotepadSimple',
        name: 'Stormwind Notepad',
        color1: '#4C97FF',
        blocks: [
          {
            opcode: 'openNotepad',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open notepad with text [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello!' }
            }
          },
          {
            opcode: 'closeNotepad',
            blockType: Scratch.BlockType.COMMAND,
            text: 'close notepad'
          },
          {
            opcode: 'isNotepadOpen',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is notepad open?'
          }
        ]
      };
    }

    openNotepad(args) {
      const baseUrl = 'https://www.stormwindsky.com/Tools/Notepad/Notepad.html';
      iframe.src = `${baseUrl}#${encodeURIComponent(args.TEXT)}`;
      container.classList.add('active');
      isOpen = true;
    }

    closeNotepad() {
      this._doClose();
    }

    isNotepadOpen() {
      return isOpen;
    }

    _doClose() {
      container.classList.remove('active');
      isOpen = false;
      // On vide la source pour stopper les scripts éventuels de l'iframe en arrière-plan
      iframe.src = 'about:blank';
    }
  }

  const ext = new NotepadExtension();
  closeBtn.onclick = () => ext._doClose();

  Scratch.extensions.register(ext);
})(Scratch);