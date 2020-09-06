import React, { useEffect, useState } from 'react';

import Button from '../Button';
import NumberDisplay from '../NumberDisplay';
import { generateCells, openCellsRecursively } from '../../utils';
import { Cell, Face, CellState, CellValue } from '../../types';
import { MAX_ROWS, MAX_COLS } from '../../constants';

import './App.scss';


const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState(10);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = () => {
      setFace(Face.oh);
    }

    const handleMouseUp = () => {
      setFace(Face.smile);
    }

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    }

  }, []);

  useEffect(() => {
    if (live && time < 999) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      }
    }
  }, [live, time]);

  useEffect(() => {
    if (hasLost) {
      setLive(false);
      setFace(Face.lost);
    }
  }, [hasLost]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let newCells = cells.slice(); // makes a copy of cells

    //start game
    if (!live) {
      // handle making sure you don't click a bomb in the beginning
      let isABomb = newCells[rowParam][colParam].value === CellValue.bomb;
      while (isABomb) {
        newCells = generateCells();
        if (newCells[rowParam][colParam].value !== CellValue.bomb) {
          isABomb = false;
          break;
        }
      }
      setLive(true);
    }

    const currentCell = newCells[rowParam][colParam];

    if (currentCell.state === CellState.flagged ||
      currentCell.state === CellState.visible)
      return;

    if (currentCell.value === CellValue.bomb) {
      // handle bomb click
      setHasLost(true);
      newCells[rowParam][colParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      // handle clicking a cell with no number or bomb
      newCells = openCellsRecursively(newCells, rowParam, colParam);
    } else {
      // handle clicking on a number
      newCells[rowParam][colParam].state = CellState.visible;
    }

    // check if player has won
    let safeOpenCellExists = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = newCells[row][col];
        if (currentCell.value !== CellValue.bomb && currentCell.state === CellState.open) {
          safeOpenCellExists = true;
          break;
        }
      }
    }

    if (!safeOpenCellExists) {
      newCells = newCells.map(row => row.map(cell => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.flagged
          }
        }
        return cell;
      }))
      setHasWon(true);
    }

    setCells(newCells);
  }

  const handleCellContext = (
    rowParam: number,
    colParam: number
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();

    if (!live)
      return;

    const currentCells = cells.slice(); // copy cells
    const currentCell = cells[rowParam][colParam];

    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.open) {
      currentCells[rowParam][colParam].state = CellState.flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCells[rowParam][colParam].state = CellState.open;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }

    console.log('right click');
  }

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setCells(generateCells());
    setHasLost(false);
    setHasWon(false);
    setBombCounter(10);
  }

  useEffect(() => {
    if (hasWon) {
      setLive(false);
      setFace(Face.win);
    }
  }, [hasWon])

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          onClick={handleCellClick}
          onContext={handleCellContext}
          red={cell.red}
          row={rowIndex}
          col={colIndex} />
      ))
    );
  }

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map(row => row.map(cell => {
      if (cell.value === CellValue.bomb) {
        return {
          ...cell,
          state: CellState.visible
        };
      }
      return cell;
    }));
  }

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={bombCounter} />
        <div className="Face" onClick={handleFaceClick}>
          <span role="img" aria-label='face'>
            {face}
          </span>
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  )
}

export default App;