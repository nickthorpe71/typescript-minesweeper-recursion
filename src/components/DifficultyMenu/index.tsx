import React from 'react';

import { setDifficulty } from '../../constants'

import './DifficultyMenu.scss';

interface DiffProps {
  onClick(): void;
}

const DifficultyMenu: React.FC<DiffProps> = ({ onClick }) => {

  const handleClick = (diffString: string): void => {
    setDifficulty(diffString);
    onClick();
  }

  return (
    <div>
      <button onClick={() => handleClick('beginner')}>Beginner</button>
      <button onClick={() => handleClick('intermediate')}>Intermediate</button>
      <button onClick={() => handleClick('expert')}>Expert</button>
    </div>
  )
}

export default DifficultyMenu;