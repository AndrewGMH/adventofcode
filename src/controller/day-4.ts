import Load from '../util/load';
import Display from '../util/display';

/**
 * Extract the data so each line represents one passanger
 * 
 * @param data Array of strings
 */
const extract = (data: Array<string>): Array<string> => {
  let users = [];
  let build = "";

  for (let x = 0; x < data.length; x++) {
    if (data[x] != "") {
      build += " " + data[x];
    } else {
      users.push(build.trim());
      build = "";
    }
  }

  return users;
}

/**
 * Make sure the birth year is between 1920 and 2002
 * 
 * @param year Passenger year of birth
 */
const validateBirthYear = (year: number): boolean => {
  return year >= 1920 && year <= 2002;
}

/**
 * Make sure the issue year is between 2010 and 2020
 * 
 * @param year Passenger passport issue year
 */
const validateIssueYear = (year: number): boolean => {
  return year >= 2010 && year <= 2020;
}

/**
 * Make sure the expiration year is between 2020 and 2030
 * 
 * @param year Passenger passport expiration year
 */
const validateExpirationYear = (year: number): boolean => {
  return year >= 2020 && year <= 2030;
}

/**
 * Make sure the height is between 150cm and 193cm or 59" and 76"
 * 
 * @param height Passenger height
 */
const validateHeight = (height: string): boolean => {
  let number: any = height.match(/\d+/) || [];
  number = +number[0];

  // Centimeters
  if (height.indexOf(`cm`) != -1) {
    return number >= 150 && number <= 193;

    // Inches
  } else if (height.indexOf(`in`) != -1) {
    return number >= 59 && number <= 76;

    // Invalid unit
  } else {
    return false;
  }
}

/**
 * Make sure the hair color is a hex code
 * 
 * @param color Passenger hair color
 */
const validateHairColor = (color: string): boolean => {
  return /\#([a-f0-9]+){6}/.test(color);
}

/**
 * Make sure the eye color is one of these choices: "amb", "blu", "brn", "gry", "grn", "hzl", "oth"
 * 
 * @param color Passenger eye color
 */
const validateEyeColor = (color: string): boolean => {
  return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(color);
}

/**
 * Make sure the passport ID is a 9 digit number
 * 
 * @param passport Passenger passpost ID
 */
const validatePassportID = (passport: string): boolean => {
  return /^\d{9}$/.test(passport);
}

/**
 * Make sure all the required fields are there
 * 
 * @param values Passengers values
 */
const required = (values: string): boolean => {
  let valid: boolean = true;

  // Validate required keys
  ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'].map((key: string, _index: number) => {
    // Missing key, the string of values is invalid
    if (values.indexOf(`${key}:`) === -1) {
      valid = false;
      return;
    }
  });

  return valid;
}

/**
 * Make sure the fields contains valid information
 * 
 * @param values Passengers values
 */
const validate = (values: Array<string>): boolean => {
  let valuesAreValid: boolean = true;
  let valid: boolean = true;
  let parts: Array<string>;

  values.map((value: string, _index: number) => {
    parts = value.split(':');

    switch (parts[0]) {
      // Birth year
      case 'byr':
        valid = validateBirthYear(+parts[1]);
        break;

      // Issue year
      case 'iyr':
        valid = validateIssueYear(+parts[1]);
        break;

      // Expiration year
      case 'eyr':
        valid = validateExpirationYear(+parts[1]);
        break;

      // Height
      case 'hgt':
        valid = validateHeight(parts[1]);
        break;

      // Hair color
      case 'hcl':
        valid = validateHairColor(parts[1]);
        break;

      // Eye color
      case 'ecl':
        valid = validateEyeColor(parts[1]);
        break;

      // Passport ID
      case 'pid':
        valid = validatePassportID(parts[1]);
        break;
    }

    // Something is invalid, stop the process
    if (!valid) {
      valuesAreValid = false;
      return;
    }
  });

  return valuesAreValid;
}

/**
 * Find all the passengers with all the required fields
 * 
 * @param data Array of passenger passports
 */
const answerOne = (data: Array<string>): number => {
  return data.filter((data: string) => required(data)).length;
}

/**
 * Find all the passengers with all the required fields, then make sure the data is valid.
 * 
 * @param data Array of passenger passports
 */
const answerTwo = (data: Array<string>): number => {
  return data.filter((data: string) => required(data))
    .filter((data: string) => validate(data.split(' ')))
    .length;
}


export default () => {

  const data: Array<string> = Load(4, extract);

  return {
    "part-1": {
      'question': Display(4, 1),
      'answer': answerOne(data)
    },
    "part-2": {
      'question': Display(4, 2),
      'answer': answerTwo(data)
    },
  }
}