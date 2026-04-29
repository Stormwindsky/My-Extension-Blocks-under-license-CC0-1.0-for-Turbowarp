// Name: Modern Answer & Quiz
// ID: modernQuiz
// Description: Modern inputs and Kahoot-style quiz blocks with Dark/Light mode support.
// License: CC0 1.0

(function (Scratch) {
  'use strict';

  class ModernQuiz {
    constructor() {
      this.lastAnswer = '';
      this.isCorrect = false;
      this.theme = 'light'; 
      this._setupStyles();
    }

    getInfo() {
      return {
        id: 'modernQuiz',
        name: 'Modern Quiz',
        color1: '#46178f',
        color2: '#381272',
        blocks: [
          {
            opcode: 'setTheme',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set theme to [THEME]',
            arguments: {
              THEME: {
                type: Scratch.ArgumentType.STRING,
                menu: 'themeMenu'
              }
            }
          },
          '---',
          {
            opcode: 'askModern',
            blockType: Scratch.BlockType.COMMAND,
            text: 'ask [QUESTION] with modern input',
            arguments: {
              QUESTION: { type: Scratch.ArgumentType.STRING, defaultValue: 'What is your name?' }
            }
          },
          {
            opcode: 'askQuizFour',
            blockType: Scratch.BlockType.COMMAND,
            text: 'quiz [QUESTION] choices: A [A] B [B] C [C] D [D]',
            arguments: {
              QUESTION: { type: Scratch.ArgumentType.STRING, defaultValue: 'Pick a color' },
              A: { type: Scratch.ArgumentType.STRING, defaultValue: 'Red' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: 'Blue' },
              C: { type: Scratch.ArgumentType.STRING, defaultValue: 'Green' },
              D: { type: Scratch.ArgumentType.STRING, defaultValue: 'Yellow' }
            }
          },
          {
            opcode: 'askQuizTwo',
            blockType: Scratch.BlockType.COMMAND,
            text: 'quiz [QUESTION] choices: [A] or [B]',
            arguments: {
              QUESTION: { type: Scratch.ArgumentType.STRING, defaultValue: 'Is this true?' },
              A: { type: Scratch.ArgumentType.STRING, defaultValue: 'True' },
              B: { type: Scratch.ArgumentType.STRING, defaultValue: 'False' }
            }
          },
          '---',
          {
            opcode: 'getAnswer',
            blockType: Scratch.BlockType.REPORTER,
            text: 'modern answer'
          },
          {
            opcode: 'checkCorrect',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'was answer correct?'
          },
          {
            opcode: 'setCorrectness',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set answer as [STATUS]',
            arguments: {
              STATUS: {
                type: Scratch.ArgumentType.STRING,
                menu: 'statusMenu'
              }
            }
          }
        ],
        menus: {
          statusMenu: { acceptReporters: true, items: ['correct', 'wrong'] },
          themeMenu: { acceptReporters: true, items: ['light', 'dark'] }
        }
      };
    }

    _setupStyles() {
      const style = document.createElement('style');
      style.id = 'mq-styles';
      style.textContent = `
        .mq-container {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          width: 90%; max-width: 500px; padding: 20px;
          border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.4);
          z-index: 10000; font-family: "Segoe UI", Roboto, sans-serif;
          display: flex; flex-direction: column; gap: 15px;
          transition: background 0.3s, color 0.3s;
        }
        .mq-light { background: #ffffff; color: #333333; }
        .mq-dark { background: #1a1a1a; color: #ffffff; border: 1px solid #444; }
        
        .mq-title { font-size: 18px; font-weight: bold; text-align: center; }
        
        .mq-input {
          padding: 12px; border: 2px solid #673ab7; border-radius: 8px; font-size: 16px;
          outline: none; background: transparent; color: inherit;
        }
        
        .mq-grid { display: grid; gap: 10px; }
        .mq-grid-4 { grid-template-columns: 1fr 1fr; }
        .mq-grid-2 { grid-template-columns: 1fr; }

        .mq-btn {
          border: none; border-radius: 8px; padding: 18px; color: white;
          font-weight: 800; cursor: pointer; font-size: 16px;
          transition: transform 0.1s, opacity 0.2s;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .mq-btn:hover { opacity: 0.9; }
        .mq-btn:active { transform: scale(0.96); }
        
        .btn-red { background: #e21b3c; }
        .btn-blue { background: #1368ce; }
        .btn-yellow { background: #ffa602; }
        .btn-green { background: #26890c; }
      `;
      document.head.appendChild(style);
    }

    _createBaseUI(question) {
      this._removeUI();
      const container = document.createElement('div');
      container.id = 'mq-ui';
      container.className = `mq-container mq-${this.theme}`;

      const title = document.createElement('div');
      title.className = 'mq-title';
      title.innerText = question;
      container.appendChild(title);

      return container;
    }

    _removeUI() {
      const existing = document.getElementById('mq-ui');
      if (existing) existing.remove();
    }

    setTheme(args) {
      this.theme = args.THEME;
    }

    askModern(args) {
      const container = this._createBaseUI(args.QUESTION);
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.className = 'mq-input';
        input.placeholder = "Type your answer...";
        
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            this.lastAnswer = input.value;
            this._removeUI();
            resolve();
          }
        });

        container.appendChild(input);
        document.body.appendChild(container);
        input.focus();
      });
    }

    askQuizFour(args) {
      const container = this._createBaseUI(args.QUESTION);
      return new Promise((resolve) => {
        const grid = document.createElement('div');
        grid.className = 'mq-grid mq-grid-4';
        
        const config = [
          { t: args.A, c: 'btn-red' }, { t: args.B, c: 'btn-blue' },
          { t: args.C, c: 'btn-yellow' }, { t: args.D, c: 'btn-green' }
        ];

        config.forEach(item => {
          const btn = document.createElement('button');
          btn.className = `mq-btn ${item.c}`;
          btn.innerText = item.t;
          btn.onclick = () => { this.lastAnswer = item.t; this._removeUI(); resolve(); };
          grid.appendChild(btn);
        });

        container.appendChild(grid);
        document.body.appendChild(container);
      });
    }

    askQuizTwo(args) {
      const container = this._createBaseUI(args.QUESTION);
      return new Promise((resolve) => {
        const grid = document.createElement('div');
        grid.className = 'mq-grid mq-grid-2';
        
        const config = [
          { t: args.A, c: 'btn-blue' }, { t: args.B, c: 'btn-red' }
        ];

        config.forEach(item => {
          const btn = document.createElement('button');
          btn.className = `mq-btn ${item.c}`;
          btn.innerText = item.t;
          btn.onclick = () => { this.lastAnswer = item.t; this._removeUI(); resolve(); };
          grid.appendChild(btn);
        });

        container.appendChild(grid);
        document.body.appendChild(container);
      });
    }

    getAnswer() { return this.lastAnswer; }
    checkCorrect() { return this.isCorrect; }
    setCorrectness(args) { this.isCorrect = (args.STATUS === 'correct'); }
  }

  Scratch.extensions.register(new ModernQuizPro());
})(Scratch);
