import Load from '../util/load';
import Display from '../util/display';

interface Seat {
  id: number;
  bin: string;
}

/**
 * Find the row with the instructions
 * 
 * @param bin Instructions
 * @param numberOfRows Number of rows the plane has
 */
const findRow = (bin: string, numberOfRows: number): number => {
  const instructions: Array<string> = bin.split("");

  let max: number = numberOfRows - 1;
  let min: number = 0;
  let middle: number;

  instructions.forEach((instruction) => {
    middle = Math.ceil((max - min) / 2);

    // Keep upper half
    if (instruction === "B") {
      min = min + middle;

      // Keep lower half
    } else {
      max = max - middle;
    }
  });

  return max;
}

/**
 * Find the column with the instructions
 * 
 * @param bin Instructions
 * @param numberOfColumns Number of columns the plane has
 */
const findColumn = (bin: string, numberOfColumns: number): number => {
  const instructions: Array<string> = bin.split("");

  let max: number = numberOfColumns - 1;
  let min: number = 0;
  let middle: number;

  instructions.forEach((instruction) => {
    middle = Math.ceil((max - min) / 2);

    // Keep upper half
    if (instruction === "R") {
      min = min + middle;

      // Keep lower half
    } else {
      max = max - middle;
    }
  });

  return max;
}

/**
 * The seat ID is the row ID multiplied by 8 then we add the column ID
 * 
 * @param row The row where the set is placed
 * @param column The column where the set is placed
 */
const findSeatId = (row: number, column: number): number => {
  return (row * 8) + column;
}

/**
 * Set the passanger seat based on the instructions
 * 
 * @param seats All the seats on the airplane
 * @param bin The instructions for the seat
 */
const setPassanger = (seats: Seat[][], bin: string): void => {
  let parts = bin.match(/([F|B]+)([L|R]+)/) || [];

  let row: number;
  row = findRow(parts[1], seats.length);

  let column: number;
  column = findColumn(parts[2], seats[0].length);

  seats[row][column] = {
    "id": findSeatId(row, column),
    "bin": bin,
  };
}

/**
 * Find the missing key
 * 
 * @param array Array keys
 */
const findMissingKey = (array: Array<number>): number => {
  for (let x = 0; x < array.length - 1; x++) {
    if (array[x] + 1 != array[x + 1]) {
      return array[x] + 1;
    }
  }

  return -1;
}

/**
 * Find the highest seat ID
 * 
 * @param seats All the seats on the airplane
 */
const answerOne = (seats: Seat[][]): number => {
  return seats.flat().reduce((prev: Seat, current: Seat) => prev.id > current.id ? prev : current).id;
}

/**
 * Find the missing seat that isn't in the beginning or end of the plane
 * 
 * @param seats All the seats on the airplane
 */
const answerTwo = (seats: Seat[][]): any => {
  return findMissingKey([...seats.flat().map(seat => seat.id)])
}

export default () => {

  // Size of the plane
  const numberOfRows: number = 128;
  const numberOfColumns: number = 8;

  const seats = new Array(numberOfRows);

  const data: Array<string> = Load(5, (data: Array<string>) => data);

  // Build the plane
  for (let x = 0; x < seats.length; x++) {
    seats[x] = new Array(numberOfColumns);
  }

  // Place the passangers
  for (let x = 0; x < data.length; x++) {
    setPassanger(seats, data[x]);
  }

  return {
    "part-1": {
      'question': Display(5, 1),
      'answer': answerOne(seats)
    },
    "part-2": {
      'question': Display(5, 2),
      'answer': answerTwo(seats)
    },
  }
}