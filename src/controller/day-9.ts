import Load from '../util/load';
import Display from '../util/display';

/**
 * Find the first number in the list (after the preamble) which is not the sum of two of the {preamble} numbers before it.
 * 
 * @param data Array of numbers
 * @param preamble The preamble
 */
const answerOne = (data: number[], preamble: number): any => {
    return data.reduce((accumulator: number[], next: number): any => {
        // We found the number, simply return it till the end
        if (!Array.isArray(accumulator)) {
            return accumulator
        }

        // Build the accumulator with the {preamble} length of numbers
        if (accumulator.length < preamble) {
            accumulator.push(next)
            return accumulator
        }

        // Is the sum of this number with any other in the accumulator ?
        if (accumulator.reduce((_prev, _cur, _index, source) => {
            return source.filter(num => source.includes((next - num))).length
        })) {
            // Add the number and remove the first one
            accumulator.push(next)
            return accumulator.slice(1)
        }

        // This number is not in the accumulator
        return next;
    }, []);
}

/**
 * Find a contiguous set of at least two numbers in your list which sum to the invalid number from step 1
 * 
 * @param data 
 * @param preamble 
 */
const answerTwo = (data: number[], preamble: number): number => {
    // Get the number from the first step
    let target: number = answerOne(data, preamble);

    let range: number[] = [];

    // Go through all the numbers to find the contiguous set
    data.some((number: number, index: number): boolean => {
        let total = 0

        // Ignore the target number
        if (number === target)
            return false

        // Find the contiguous set by adding the numbers till they are equal to the target number
        return data.slice(index).some((n: number, i: number): boolean => {
            total += n;

            // We found the contiguous set
            if (total === target) {
                range = [index, index + i]
                return true
            }

            return false;
        })
    });

    // Build an array of numbers with the contiguous set
    let numbers: number[] = data.slice(range[0], range[1] + 1);

    // Add the biggest and smallest number of the range of numbers
    return Math.max(...numbers) + Math.min(...numbers);
}

export default () => {

    const data: number[] = Load(9, (data) => data.map(row => +row));

    return {
        "part-1": {
            'question': Display(9, 1),
            'answer': answerOne(data, 25)
        },
        "part-2": {
            'question': Display(9, 2),
            'answer': answerTwo(data, 25)
        },
    }
}