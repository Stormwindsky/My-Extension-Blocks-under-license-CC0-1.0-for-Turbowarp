// Name: Dev Notes
// ID: devNotesExt
// Description: Passive blocks for leaving comments and notes directly inside scripts.
// License: CC0-1.0

(function(Scratch) {
  'use strict';

  class DevNotes {
    getInfo() {
      return {
        id: 'devNotesExt',
        name: 'Dev Notes',
        color1: '#8e8e8e', // Gris pour montrer que c'est passif (commentaire)
        color2: '#707070',
        blocks: [
          {
            // Bloc Hat (Chapeau) qui ne se déclenche jamais
            opcode: 'noteHat',
            blockType: Scratch.BlockType.HAT,
            text: 'Note: [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Script description...'
              }
            }
          },
          {
            // Bloc de commande normal (ne fait rien)
            opcode: 'noteCommand',
            blockType: Scratch.BlockType.COMMAND,
            text: '// [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'This part does something...'
              }
            }
          },
          {
            // Bloc Reporter (renvoie juste son propre texte)
            opcode: 'noteReporter',
            blockType: Scratch.BlockType.REPORTER,
            text: 'note: [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'info here'
              }
            }
          },
          {
            // Bloc de type C (Boucle) qui exécute ce qu'il y a dedans sans rien ajouter
            opcode: 'noteCBlock',
            blockType: Scratch.BlockType.CONDITIONAL,
            text: 'section: [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Setup blocks'
              }
            }
          }
        ]
      };
    }

    // Toutes les fonctions sont vides ou retournent simplement la valeur
    // pour ne pas impacter le fonctionnement du projet.

    noteHat(args) {
      return false; // Ne se déclenche jamais
    }

    noteCommand(args) {
      // Ne fait rien
    }

    noteReporter(args) {
      return String(args.TEXT);
    }

    noteCBlock(args, util) {
      // Exécute simplement les blocs à l'intérieur
      return true;
    }
  }

  Scratch.extensions.register(new DevNotes());
})(Scratch);
