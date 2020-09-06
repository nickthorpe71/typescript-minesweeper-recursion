export let MAX_ROWS = 9;
export let MAX_COLS = 9;
export let NO_OF_BOMBS = 10;

export const setDifficulty = (diffString: string): void => {
  if (diffString === 'beginner') {
    MAX_ROWS = 9;
    MAX_COLS = 9;
    NO_OF_BOMBS = 10;
  } else if (diffString === 'intermediate') {
    MAX_ROWS = 16;
    MAX_COLS = 16;
    NO_OF_BOMBS = 40;
  } else if (diffString === 'expert') {
    MAX_ROWS = 16;
    MAX_COLS = 30;
    NO_OF_BOMBS = 99;
  }
}