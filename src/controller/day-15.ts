import Display from '../util/display';

interface Memory {
    first: number,
    second: number,
}

/**
 * Find the next number based on the following conditions
 * 
 *  - The previous number and the current one are equal: @return 1
 *  - The previous number or the current number are not in memory @return 0
 *  - Its the first time the current number is used @return turn - first number position
 *  - Its the second or more time the current number was used @return turn - second number position
 * 
 * @param memories Previous number positions
 * @param prev Previous number
 * @param current Current number
 * @param turn The current turn
 */
const nextNumber = (memories: Memory[], prev: number, current: number, turn: number): number => {
    turn--;

    // The previous number and the current one are equal
    if (prev === current) {
        // Save the number positions
        memories[current] = {
            'first' : turn - 1,
            'second': turn,
        };

        return 1;
    }

    // Is the previous and current number in memory ?
    if (prev in memories && current in memories) {
        // Get the number positions
        let { first, second } = memories[current];

        // The number was only used onced
        if (second == -1) {
            // Save the second position
            memories[current] = {
                'first' : first,
                'second': turn,
            };

            return turn - first;
        }

        // Update the first number position with the second one then save the position
        memories[current] = {
            'first' : second,
            'second': turn,
        };

        return turn - second;
    }

    // Don't forget to memorize the first instance of the number
    memories[current] = {
        'first' : turn,
        'second': -1,
    }

    return 0;
}

/**
 * Loop the next number function and ouput the last number
 * 
 * @param data Pre defined numbers
 * @param turns Number of turn to loop
 */
const loopNextNumber = (data: number[], turns: number): number => {
    const memories: Memory[] = [];

    // Create memories with the pre define numbers
    for (let x = 0; x < data.length; ++x) {
        memories[data[x]] = {
            'first': x,
            'second': -1,
        };
    }

    let prev: number = -1;
    let current: number = -1;
    let delta: number = data[data.length - 1];

    // Loop the next number function x times - pre defined numbers data size
    for (let turn = data.length; turn < turns; ++turn) {
        current = delta;
        delta = nextNumber(memories, prev, current, turn);
        prev = current;
    }

    return delta;
}

export default () => {

    const data: number[] = [20, 9, 11, 0, 1, 2];

    return {
        "part-1": {
            'question': Display(15, 1),
            'answer': loopNextNumber(data, 2020)
        },
        "part-2": {
            'question': Display(15, 2),
            'answer': loopNextNumber(data, 30000000)
        },
    }
}