// Name: Pet Follow Cursor
// ID: petFollowCursor
// Description: A small pet that follows your mouse smoothly.
// License: CC0 1.0

(function (Scratch) {
  'use strict';

  // Initial variables
  let petVisible = false;
  let petX = 0;
  let petY = 0;
  let targetX = 0;
  let targetY = 0;
  let speed = 0.15; // Smoothness factor (0 to 1)
  let imageUrl = 'https://raw.githubusercontent.com/Stormwindsky/ArtLibre/main/ArtLibre/ArtLibre/files/Znak%20the%20Dragon%20Snake.svg';

  // Create the image element
  const petElement = document.createElement('img');
  petElement.style.position = 'fixed';
  petElement.style.pointerEvents = 'none'; // Don't block clicks
  petElement.style.zIndex = '999999';
  petElement.style.display = 'none';
  petElement.style.width = '60px'; // Default size
  petElement.src = imageUrl;
  document.body.appendChild(petElement);

  // Update mouse position
  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  // Animation loop for smooth movement
  function animate() {
    if (petVisible) {
      // Linear interpolation (lerp) for smoothness
      petX += (targetX - petX) * speed;
      petY += (targetY - petY) * speed;

      // Update position (offset by 15px so it doesn't hide the cursor)
      petElement.style.left = `${petX + 15}px`;
      petElement.style.top = `${petY + 15}px`;
    }
    requestAnimationFrame(animate);
  }
  animate();

  class PetFollowExtension {
    getInfo() {
      return {
        id: 'petFollowCursor',
        name: 'Pet Follow Cursor',
        color1: '#ff6680',
        blocks: [
          {
            opcode: 'showPet',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show pet'
          },
          {
            opcode: 'hidePet',
            blockType: Scratch.BlockType.COMMAND,
            text: 'hide pet'
          },
          {
            opcode: 'changeImage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'change pet image to [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://raw.githubusercontent.com/Stormwindsky/ArtLibre/main/ArtLibre/ArtLibre/files/Znak%20the%20Dragon%20Snake.svg'
              }
            }
          }
        ]
      };
    }

    showPet() {
      petVisible = true;
      petElement.style.display = 'block';
    }

    hidePet() {
      petVisible = false;
      petElement.style.display = 'none';
    }

    changeImage(args) {
      imageUrl = args.URL;
      petElement.src = imageUrl;
    }
  }

  Scratch.extensions.register(new PetFollowExtension());
})(Scratch);