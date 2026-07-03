// Name: Lucky Lucky
// ID: luckyLuckyCC0
// Description: Trigger Minecraft-inspired Lucky Block random events on targeted sprites or backdrops.
// License: CC0 1.0 Universal

(function (Scratch) {
  'use strict';

  class LuckyLucky {
    getInfo() {
      return {
        id: 'luckyLuckyCC0',
        name: 'Lucky Lucky',
        color1: '#ffb026', // Couleur demandée
        color2: '#e09214',
        blocks: [
          {
            opcode: 'triggerLuckyBlock',
            blockType: Scratch.BlockType.COMMAND,
            text: 'trigger lucky block event on target [TARGET]',
            arguments: {
              TARGET: { type: Scratch.ArgumentType.STRING, menu: 'targetsMenu', defaultValue: 'All' }
            }
          }
        ],
        menus: {
          targetsMenu: {
            acceptReporters: true,
            items: '_getTargetsAndAll'
          }
        }
      };
    }

    _getTargetsAndAll() {
      const targets = Scratch.vm.runtime.targets;
      const spriteNames = targets.filter(t => !t.isStage).map(t => t.getName());
      return ['All', 'Stage', ...spriteNames];
    }

    triggerLuckyBlock(args) {
      const runtime = Scratch.vm.runtime;
      let targetName = args.TARGET;
      let selectedTarget = null;

      // --- 1. SÉLECTION DE LA CIBLE ---
      if (targetName === 'All') {
        // Choix au hasard entre la scène (Stage) et n'importe quel sprite existant
        const validTargets = runtime.targets;
        if (validTargets.length > 0) {
          selectedTarget = validTargets[Math.floor(Math.random() * validTargets.length)];
        }
      } else if (targetName === 'Stage') {
        selectedTarget = runtime.getTargetForStage();
      } else {
        selectedTarget = runtime.targets.find(t => !t.isStage && t.getName() === targetName);
      }

      if (!selectedTarget) return;

      // --- 2. LISTE DES ÉVÉNEMENTS RANDOM (Inspirés du Vanilla) ---
      const events = [];

      // Événements applicables uniquement aux Sprites (pas à la Scène)
      if (!selectedTarget.isStage) {
        // Événement : Cacher / Montrer
        events.push(() => {
          selectedTarget.setVisible(!selectedTarget.visible);
        });

        // Événement : Téléportation purement aléatoire (X/Y)
        events.push(() => {
          selectedTarget.x = (Math.random() * 400) - 200;
          selectedTarget.y = (Math.random() * 300) - 150;
        });

        // Événement : Changement de taille fou (Super géant ou minuscule)
        events.push(() => {
          const randomSize = Math.floor(Math.random() * 250) + 30; // Entre 30% et 280%
          selectedTarget.setSize(randomSize);
        });

        // Événement : Direction chaotique
        events.push(() => {
          selectedTarget.direction = Math.floor(Math.random() * 360) - 180;
        });
      }

      // Événements applicables à tout le monde (Sprites ET Stage)
      // Événement : Effets graphiques Scratch (Couleur, Fisheye, Ghost, Pixelate)
      events.push(() => {
        const effects = ['color', 'fisheye', 'ghost', 'pixelate', 'whirl'];
        const chosenEffect = effects[Math.floor(Math.random() * effects.length)];
        const randomValue = Math.floor(Math.random() * 100) + 25;
        selectedTarget.setEffect(chosenEffect, randomValue);
      });

      // Événement : Reset de tous les effets graphiques
      events.push(() => {
        selectedTarget.clearEffects();
      });

      // Événement : Forcer le costume / arrière-plan suivant
      events.push(() => {
        const totalCostumes = selectedTarget.getCostumes().length;
        if (totalCostumes > 1) {
          const nextIndex = (selectedTarget.currentCostume + 1) % totalCostumes;
          selectedTarget.setCostume(nextIndex);
        }
      });

      // --- 3. DÉCLENCHEMENT DE L'ÉVÉNEMENT ---
      if (events.length > 0) {
        const randomEventIndex = Math.floor(Math.random() * events.length);
        events[randomEventIndex]();
        
        // Force Scratch à actualiser le rendu visuel immédiatement
        runtime.requestRedraw();
      }
    }
  }

  Scratch.extensions.register(new LuckyLucky());
})(Scratch);
