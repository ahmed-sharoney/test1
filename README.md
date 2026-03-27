# Classic Snake

A minimal implementation of classic Snake using plain HTML/CSS/JavaScript.

## Run

1. Start the local server from this repo root:
   - `npm start`
2. Open `http://localhost:8000`.

## Test

- `npm test`

## Controls

- Arrow keys or `W/A/S/D` to move.
- `Space` or **Pause** button to pause/resume.
- **Restart** button to start a new game.
- On-screen directional buttons support touch/mobile input.
- Theme selector lets the player switch between **Classic Green** and **Neon Purple**.

## Manual verification checklist

- [ ] Snake moves one cell per tick and follows direction inputs.
- [ ] Opposite-direction instant reversal is blocked.
- [ ] Eating food increases score and snake length.
- [ ] Food never appears on top of snake body.
- [ ] Hitting wall or self triggers game over.
- [ ] Pause/resume works via keyboard and button.
- [ ] Restart resets score/state and starts a fresh run.
- [ ] Theme switch updates colors instantly and keeps selected theme after refresh.
