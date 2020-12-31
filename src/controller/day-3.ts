import Load from '../util/load';
import Display from '../util/display';

/**
 * Get the number of trees we would hit if we went x moves to the right
 * 
 * @param data Array of positions of the trees
 * @param movesToTheRight Moves to the right
 */
const countTreesInCourse = (data: Array<string>, movesToTheRight: number): number => {
  // Number of trees we hit
  let trees: number = 0;
  // Current position
  let pos: number;
  // When the trees repeat
  let colums: number = data[0].length;

  // Slide down the course
  for (let x = 0; x < data.length; x++) {
    // Your position in the course
    pos = (x * movesToTheRight);

    // Your position in the repeating trees is equal n % number of of trees before repeating.
    if (data[x][(pos % colums)] === "#") {
      trees++;
    }
  }

  return trees;
}

/**
 * Get the number of trees we would hit if we went 3 moves to the right followed by one move down.
 * 
 * @param data Array of positions of the trees
 */
const answerOne = (data: Array<string>): number => {
  return countTreesInCourse(data, 3);
}

/**
 * Multiply each result of set of moves of trees we would hit
 * 
 * @param data Array of positions of the trees
 */
const answerTwo = (data: Array<string>): number => {
  let total: number = 1;
  let dataBaseOnDownMoves: Array<string> = [];

  const setOfMoves = [
    [1, 1], // 1 Right and 1 down
    [3, 1], // 3 Right and 1 down
    [5, 1], // 5 Right and 1 down
    [7, 1], // 7 Right and 1 down
    [1, 2]  // 1 Right and 2 down
  ];

  // Do all the courses
  for (let x = 0; x < setOfMoves.length; x++) {
    // Remove rows that we would jump
    if (setOfMoves[x][1] > 1) {
      dataBaseOnDownMoves = data.filter(function (_row, index) {
        return index % setOfMoves[x][1] == 0;
      });
    } else {
      dataBaseOnDownMoves = data;
    }
  
    // Multiply each course result
    total *= countTreesInCourse(dataBaseOnDownMoves, setOfMoves[x][0])
  }

  return total;
}

export default () => {

  const data: Array<string> = Load(3, (data: Array<string>) => data);

  return {
    "part-1": {
      'question': Display(3, 1),
      'answer': answerOne(data)
    },
    "part-2": {
      'question': Display(3, 2),
      'answer': answerTwo(data)
    },
  }
}