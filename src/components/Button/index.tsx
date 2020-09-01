import React from 'react';

import './Button.scss';
import { CellState, CellValue } from '../../types';

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
}

const Button: React.FC<ButtonProps> = ({ row, col, state, value }) => {
  return <div className={`Button ${state === CellState.visible ? 'visible' : ''}`} />
}

export default Button;