(function () {
  const GRID_SIZE = 16;
  const TICK_MS = 160;
  const DEFAULT_THEME = 'classic';
  const THEMES = ['classic', 'neon'];

  const { createInitialState, queueDirection, tick, togglePause } = window.SnakeLogic;

  const gridEl = document.getElementById('grid');
  const scoreEl = document.getElementById('score');
  const statusEl = document.getElementById('status');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const themeSelect = document.getElementById('themeSelect');

  let state = createInitialState(GRID_SIZE);

  function applyTheme(themeName) {
    const selectedTheme = THEMES.includes(themeName) ? themeName : DEFAULT_THEME;
    document.body.dataset.theme = selectedTheme;
    themeSelect.value = selectedTheme;
    try {
      localStorage.setItem('snake-theme', selectedTheme);
    } catch (_error) {
      // localStorage may be unavailable in some embedded environments.
    }
  }

  function loadInitialTheme() {
    try {
      const savedTheme = localStorage.getItem('snake-theme');
      if (savedTheme) {
        applyTheme(savedTheme);
        return;
      }
    } catch (_error) {
      // localStorage may be unavailable in some embedded environments.
    }

    applyTheme(DEFAULT_THEME);
  }

  function buildGrid() {
    gridEl.innerHTML = '';
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      gridEl.appendChild(cell);
    }
  }

  function render() {
    const cells = gridEl.children;
    for (let i = 0; i < cells.length; i += 1) {
      cells[i].className = 'cell';
    }

    state.snake.forEach((segment) => {
      const idx = segment.y * GRID_SIZE + segment.x;
      if (cells[idx]) {
        cells[idx].classList.add('snake');
      }
    });

    if (state.food) {
      const idx = state.food.y * GRID_SIZE + state.food.x;
      if (cells[idx]) {
        cells[idx].classList.add('food');
      }
    }

    scoreEl.textContent = String(state.score);
    if (state.gameOver) {
      statusEl.textContent = 'Game Over';
    } else if (state.paused) {
      statusEl.textContent = 'Paused';
    } else {
      statusEl.textContent = 'Running';
    }

    pauseBtn.textContent = state.paused ? 'Resume' : 'Pause';
    pauseBtn.disabled = state.gameOver;
  }

  function step() {
    state = tick(state);
    render();
  }

  function setDirection(dir) {
    state = queueDirection(state, dir);
  }

  function restart() {
    state = createInitialState(GRID_SIZE);
    render();
  }

  const keyToDirection = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    a: 'left',
    s: 'down',
    d: 'right',
  };

  document.addEventListener('keydown', (event) => {
    const direction = keyToDirection[event.key] || keyToDirection[event.key.toLowerCase?.()];
    if (direction) {
      event.preventDefault();
      setDirection(direction);
      return;
    }

    if (event.code === 'Space') {
      event.preventDefault();
      state = togglePause(state);
      render();
    }
  });

  pauseBtn.addEventListener('click', () => {
    state = togglePause(state);
    render();
  });

  restartBtn.addEventListener('click', restart);

  themeSelect.addEventListener('change', (event) => {
    applyTheme(event.target.value);
  });

  document.querySelectorAll('[data-dir]').forEach((button) => {
    button.addEventListener('click', () => {
      setDirection(button.dataset.dir);
    });
  });

  buildGrid();
  loadInitialTheme();
  render();
  setInterval(step, TICK_MS);
})();
