import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from '../constants';
import { Cell, CellValue, CellState } from '../types';

export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  // generating all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open,
      })
    }
  }

  // randomly place bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NO_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowIndex) => row.map((cell, colIndex) => {
        if (randomRow === rowIndex && randomCol === colIndex) {
          return {
            ...cell,
            value: CellValue.bomb
          }
        }

        return cell;
      }));
    }
    bombsPlaced++;
  }

  // calculate the numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }

      let numOfBombs = 0;
      const topLeftBomb = rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null;
      const topBomb = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null;
      const topRIghtBomb = rowIndex > 0 && colIndex < MAX_COLS - 1 ? cells[rowIndex - 1][colIndex + 1] : null;
      const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null;
      const rightBomb = colIndex < MAX_COLS - 1 ? cells[rowIndex][colIndex + 1] : null;
      const bottomLeftBomb = rowIndex < MAX_ROWS - 1 && colIndex > 0 ? cells[rowIndex + 1][colIndex - 1] : null;
      const bottomBomb = rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null;
      const bottomRightBomb = rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1 ? cells[rowIndex + 1][colIndex + 1] : null;

      // optional chaining topBomb?.value === CellValue.bomb (new in TS 3.7)
      // basically means if top bomb exists && value === CellValue.bomb
      if (topBomb?.value === CellValue.bomb)
        numOfBombs++;
      if (topLeftBomb?.value === CellValue.bomb)
        numOfBombs++;
      if (topRIghtBomb?.value === CellValue.bomb)
        numOfBombs++;
      if (leftBomb?.value === CellValue.bomb)
        numOfBombs++;
      if (rightBomb?.value === CellValue.bomb)
        numOfBombs++;
      if (bottomLeftBomb?.value === CellValue.bomb)
        numOfBombs++;
      if (bottomBomb?.value === CellValue.bomb)
        numOfBombs++;
      if (bottomRightBomb?.value === CellValue.bomb)
        numOfBombs++;

      if (numOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numOfBombs
        }
      }

    }
  }

  return cells;
};