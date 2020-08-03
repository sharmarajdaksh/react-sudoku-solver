const allowedDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const getPresetCells = (grid) => {
  let presetCells = [];

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (parseInt(grid[i][j]) !== 0) {
        presetCells.push([i, j]);
      }
    }
  }

  return presetCells;
};

const isSolved = (grid) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (!isValidLocation(grid, i, j, grid[i][j])) {
        return false;
      }
    }
  }

  return true;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
export const generateCompleteSolution = async (
  grid,
  presetCells = [],
  callback,
  callback2
) => {
  await sleep(200);

  if (isSolved(grid)) {
    return true;
  } else {
    callback(grid);
  }

  let allowedDigitsLocal = [...allowedDigits];

  for (let i = 0; i < 81; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;

    if (presetCells.some((cell) => cell === [row, col])) continue;

    if (grid[row][col] === 0) {
      callback2([row, col]);

      await sleep(200);

      // allowedDigitsLocal = shuffle(allowedDigitsLocal);
      for (let n = 0; n < 9; n++) {
        let number = allowedDigitsLocal[n];
        if (isValidLocation(grid, row, col, number)) {
          path.push([number, row, col]);
          grid[row][col] = number;

          if (!findEmptySquares(grid)) {
            return true;
          } else {
            if (
              await generateCompleteSolution(
                grid,
                presetCells,
                callback,
                callback2
              )
            ) {
              return true;
            }
          }
        }
      }
      grid[row][col] = 0;
      await sleep(200);
      return false;
    }
  }

  return true;
};

const isValidLocation = (grid, row, column, number) => {
  return !(
    isUsedInRow(grid, row, number) ||
    isUsedInColumn(grid, column, number) ||
    isUsedInSubgrid(grid, row, column, number)
  );
};

const isUsedInRow = (grid, row, number) => {
  if (grid[row].some((n) => parseInt(n) === parseInt(number))) {
    return true;
  }
  return false;
};

const isUsedInColumn = (grid, col, number) => {
  for (let i = 0; i < 9; i++) {
    if (parseInt(grid[i][col]) === parseInt(number)) {
      return true;
    }
  }
  return false;
};

const isUsedInSubgrid = (grid, row, col, number) => {
  let subRow = Math.floor(row / 3) * 3;
  let subCol = Math.floor(col / 3) * 3;
  for (let i = subRow; i < subRow + 3; i++) {
    for (let j = subCol; j < subCol + 3; j++) {
      if (parseInt(grid[i][j]) === parseInt(number)) {
        return true;
      }
    }
  }

  return false;
};

const findEmptySquares = (grid) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (parseInt(grid[i][j]) === 0) return [i, j];
    }
  }
  return;
};

const path = [];
