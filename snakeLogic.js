(function (global) {
  const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  const OPPOSITE = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
  };

  function key(point) {
    return `${point.x},${point.y}`;
  }

  function createInitialState(size) {
    const center = Math.floor(size / 2);
    const snake = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ];

    return {
      size,
      snake,
      direction: 'right',
      queuedDirection: 'right',
      food: placeFood(size, snake),
      score: 0,
      gameOver: false,
      paused: false,
    };
  }

  function placeFood(size, snake, random = Math.random) {
    const occupied = new Set(snake.map(key));
    const available = [];

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const candidate = { x, y };
        if (!occupied.has(key(candidate))) {
          available.push(candidate);
        }
      }
    }

    if (available.length === 0) {
      return null;
    }

    const idx = Math.floor(random() * available.length);
    return available[idx];
  }

  function queueDirection(state, nextDirection) {
    if (!DIRECTIONS[nextDirection]) {
      return state;
    }

    if (OPPOSITE[state.direction] === nextDirection && state.snake.length > 1) {
      return state;
    }

    return {
      ...state,
      queuedDirection: nextDirection,
    };
  }

  function tick(state, random = Math.random) {
    if (state.gameOver || state.paused) {
      return state;
    }

    const direction = state.queuedDirection;
    const delta = DIRECTIONS[direction];
    const head = state.snake[0];
    const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

    const hitsWall =
      nextHead.x < 0 ||
      nextHead.y < 0 ||
      nextHead.x >= state.size ||
      nextHead.y >= state.size;

    if (hitsWall) {
      return { ...state, gameOver: true, direction };
    }

    const isFood = state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;
    const nextSnake = [nextHead, ...state.snake];
    if (!isFood) {
      nextSnake.pop();
    }

    const body = nextSnake.slice(1);
    const selfCollision = body.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y);

    if (selfCollision) {
      return { ...state, gameOver: true, direction };
    }

    const nextScore = state.score + (isFood ? 1 : 0);
    const nextFood = isFood ? placeFood(state.size, nextSnake, random) : state.food;

    return {
      ...state,
      snake: nextSnake,
      direction,
      food: nextFood,
      score: nextScore,
      gameOver: nextFood === null ? true : false,
    };
  }

  function togglePause(state) {
    if (state.gameOver) {
      return state;
    }

    return { ...state, paused: !state.paused };
  }

  const exported = {
    DIRECTIONS,
    createInitialState,
    placeFood,
    queueDirection,
    tick,
    togglePause,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  } else {
    global.SnakeLogic = exported;
  }
})(typeof window !== 'undefined' ? window : globalThis);
