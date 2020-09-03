import React, { useEffect, useState } from 'react';

import Button from '../Button';
import NumberDisplay from '../NumberDisplay';
import { generateCells } from '../../utils';
import { Cell, Face, CellState } from '../../types';

import './App.scss';

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);

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
    if (live) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      }
    }
  }, [live, time]);

  //function that returns a function
  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    //start game
    if (!live)
      setLive(true);
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
    }

    console.log('right click');
  }

  const handleFaceClick = (): void => {
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells());
    }
  }

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          onClick={handleCellClick}
          onContext={handleCellContext}
          row={rowIndex}
          col={colIndex} />
      ))
    );
  }

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
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