# Pumpy Surfer

A Flappy Bird-inspired HTML5 Canvas game where you control a surfer riding waves instead of a bird flying through pipes.

## How to Play

1. Open `index.html` in a web browser
2. Click "Start Game" or press SPACEBAR to begin
3. Press SPACEBAR or CLICK to pump and keep your surfer on the wave
4. Avoid crashing into whitewater obstacles or falling off the wave
5. Try to achieve the highest score possible!

## Game Features

- Simple one-button controls (SPACEBAR or mouse CLICK)
- Score tracking with high score saved in localStorage
- Dynamic wave physics with animated movement
- Particle effects when pumping
- Challenging obstacle avoidance gameplay
- Responsive design that works on most modern browsers
- Attractive visuals with detailed surfer character and wave graphics
- Progressive Web App (PWA) support with manifest file

## Development

This game was built with:
- HTML5 Canvas for rendering
- Vanilla JavaScript (no frameworks)
- CSS3 for styling
- Progressive Web App capabilities

## Directory Structure

```
pumpy-surfer/
├── index.html
├── manifest.json
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── game.js
└── assets/
    └── favicon.svg
```

## Technical Details

The game is organized into several JavaScript classes:
- `PumpySurferGame`: Main game controller handling game loop, state management, and coordination
- `Surfer`: Player character with physics and rendering
- `Wave`: Dynamic wave with animation and collision detection
- `Obstacle`: Whitewater obstacles that the player must avoid
- `Particle`: Visual effects for pumping action

## Future Enhancements

- Add sound effects and background music
- Implement particle effects for waves and crashes
- Add multiple difficulty levels
- Create different surfer characters to choose from
- Add power-ups and special abilities
- Implement mobile touch controls
- Add a level progression system
- Create different wave patterns and themes
- Add obstacles that move vertically as well as horizontally

## Credits

Inspired by the popular Flappy Bird game concept.