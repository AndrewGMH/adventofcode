import Load from '../util/load';
import Display from '../util/display';

interface UserInput {
  policy: string;
  password: string;
}

interface AnswerOnePolicy {
  min: number;
  max: number;
  letter: string;
}

interface AnswerTwoPolicy {
  first: number;
  second: number;
  letter: string;
}

/**
 * Convert the data into user inputs
 * 
 * @param data Array of user inputs
 */
const extract = (data: Array<string>): Array<UserInput> => {
  return data.map(row => {
    let parts = row.split(': ');

    return {
      policy: parts[0],
      password: parts[1],
    }
  });
}

/**
 * Parse the user input into the first answer policy
 * 
 * @param input user input
 */
const parseAnswerOnePolicy = (input: string): AnswerOnePolicy => {
  let parts = input.split(" ");

  return {
    min: +parts[0].split("-")[0],
    max: +parts[0].split("-")[1],
    letter: parts[1],
  };
}

/**
 * Validate the user input and make sure it follows the first answer policy 
 * 
 * @param input user input
 * @param password use password
 */
const validateAnswerOnePolicy = (input: string, password: string): boolean => {
  let rules = parseAnswerOnePolicy(input);

  let count = password.split(rules.letter).length - 1;

  return count >= rules.min && count <= rules.max;
}

/**
 * Validate the user inputs and only keep the valid ones with the first answer policy
 * 
 * @param data user inputs
 */
const answerOne = (data: Array<UserInput>): number => {
  return data.filter((input: UserInput) => validateAnswerOnePolicy(input.policy, input.password)).length;
}

/**
 * Parse the user input into the second answer policy
 * 
 * @param input user input
 */
const parseAnswerTwoPolicy = (input: string): AnswerTwoPolicy => {
  let parts = input.split(" ");

  return {
    first: +parts[0].split("-")[0] - 1,
    second: +parts[0].split("-")[1] - 1,
    letter: parts[1],
  };
}

/**
 * Validate the user input and make sure it follows the second answer policy 
 * 
 * @param input user input
 * @param password user password
 */
const validateAnswerTwoPolicy = (input: string, password: string): boolean => {
  let rules = parseAnswerTwoPolicy(input);

  let first = password[rules.first] === rules.letter;
  let second = password[rules.second] === rules.letter;

  return (first || second) && !(first && second);
}

/**
 * Validate the user inputs and only keep the valid ones with the second answer policy
 * 
 * @param data user inputs
 */
const answerTwo = (data: Array<UserInput>): number => {
  return data.filter((input: UserInput) => validateAnswerTwoPolicy(input.policy, input.password)).length;
}


export default () => {

  const data: Array<UserInput> = Load(2, extract) as Array<UserInput>;

  return {
    "part-1": {
      'question': Display(2, 1),
      'answer': answerOne(data)
    },
    "part-2": {
      'question': Display(2, 2),
      'answer': answerTwo(data)
    },
  }
}