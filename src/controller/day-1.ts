import Load from '../util/load';
import Display from '../util/display';

/**
 * Convert the data into numbers
 * 
 * @param data Array of numbers
 */
const extract = (data: Array<string>): Array<number> => {
  return data.map(row => +row);
}

/**
 * With the array we need to find 2 numbers that equal {search} then multiply them
 * 
 * @param data Array of numbers to search
 * @param search The number that we are searching for or -1 it's impossible
 */
const answerOne = (data: Array<number>, search: number): number => {
  // The first number can only be 0 to n - 1
  for (let x = 0; x < data.length - 1; x++) {
    // The second number can only be x + 1 to n
    for (let y = x + 1; y < data.length; y++) {
      // Are these numbers equal to {search} ?
      if (data[x] + data[y] === search) {
        return data[x] * data[y];
      }
    }
  }

  return -1;
}

/**
 * With the array we need to find 3 numbers that equal {search} then multiply them
 * 
 * @param data Array of numbers to search
 * @param search The number that we are searching for or -1 it's impossible
 */
const answerTwo = (data: Array<number>, search: number): number => {
  // The first number can only be 0 to n - 2
  for (let x = 0; x < data.length - 2; x++) {
    // The second number can only be x + 1 to n - 1
    for (let y = x + 1; y < data.length - 1; y++) {
      // The third number can only be y + 1 to n
      for (let z = y + 1; z < data.length; z++) {
        // Are these numbers equal to {search} ?
        if (data[x] + data[y] + data[z] === search) {
          return data[x] * data[y] * data[z];
        }
      }
    }
  }

  return -1;
}


export default () => {

  const search: number = 2020;
  const data: Array<number> = Load(1, extract) as Array<number>;

  return {
    "part-1": {
      'question': Display(1, 1),
      'answer': answerOne(data, search)
    },
    "part-2": {
      'question': Display(1, 2),
      'answer': answerTwo(data, search)
    },
  }
}