const assert = require('assert');
const {
  createInitialState,
  queueDirection,
  tick,
  placeFood,
} = require('../snakeLogic');

function randomSequence(values) {
  let i = 0;
  return () => {
    const v = values[Math.min(i, values.length - 1)];
    i += 1;
    return v;
  };
}

(function testMovement() {
  const state = createInitialState(10);
  const next = tick(state);
  assert.deepStrictEqual(next.snake[0], { x: state.snake[0].x + 1, y: state.snake[0].y });
  assert.strictEqual(next.score, 0);
})();

(function testDirectionReversalBlocked() {
  const state = createInitialState(10);
  const queued = queueDirection(state, 'left');
  assert.strictEqual(queued.queuedDirection, 'right');
})();

(function testGrowthAndScore() {
  const state = createInitialState(10);
  const targetFood = { x: state.snake[0].x + 1, y: state.snake[0].y };
  const withFood = { ...state, food: targetFood };
  const next = tick(withFood, randomSequence([0]));
  assert.strictEqual(next.snake.length, state.snake.length + 1);
  assert.strictEqual(next.score, 1);
})();

(function testWallCollision() {
  const state = {
    ...createInitialState(6),
    snake: [{ x: 5, y: 2 }, { x: 4, y: 2 }, { x: 3, y: 2 }],
    direction: 'right',
    queuedDirection: 'right',
  };
  const next = tick(state);
  assert.strictEqual(next.gameOver, true);
})();

(function testFoodPlacementAvoidsSnake() {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ];
  const food = placeFood(2, snake, randomSequence([0]));
  assert.notDeepStrictEqual(food, snake[0]);
  assert.notDeepStrictEqual(food, snake[1]);
})();

console.log('snakeLogic tests passed');
