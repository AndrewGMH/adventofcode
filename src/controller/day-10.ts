import Load from '../util/load';
import Display from '../util/display';

/**
 * Find the number of 1-jolt differences multiplied by the number of 3-jolt differences
 * 
 * @param data Array of voltages
 */
const answerOne = (data: number[]): number => {
    let previous: number = 0;
    let lvl1Adapters: number[] = [];
    let lvl3Adapters: number[] = [];

    // Go through each possible input
    for (let x = 0; x < data.length; x++) {
        // Is this a lvl 1 adapter ?
        if (data[x] - previous === 1) {
            lvl1Adapters.push(data[x]);
        // Is this a lvl 3 adapter ?
        } else if (data[x] - previous === 3) {
            lvl3Adapters.push(data[x]);
        }

        // Keep the past voltage
        previous = data[x];
    }
    
    return lvl1Adapters.length * lvl3Adapters.length;
}

/**
 * Find total number of distinct ways you can arrange the adapters to connect the charging outlet to your device
 * 
 * @param data Array of voltages
 * @param cache Array of past voltages configurations
 */
const answerTwo = (data: number[], cache: any = {}): number => {
    // Build a cache key for the current array
    const key = data.join();
    
    // If the key already exists, return the cache
    if (key in cache) {
        return cache[key];
    }

    let num: number = 1;

    // Go through each possible input in the data array
    for (let x = 1; x < data.length - 1; x++) {
        // This next voltage is possible (1 to 3 volts)
        if (data[x + 1] - data[x - 1] <= 3) {
            // Start again with the new data array
            num += answerTwo([data[x - 1], ...data.slice((x + 1))], cache);
        }
    }

    // Save the current value into the cache
    cache[key] = num;

    return num;
}

export default () => {

    let data: number[] = Load(10, (data) => data.map(row => +row));

    // Sort the inputs
    data = data.sort((a, b) => a - b);

    // Outlet starts at 0 and the max power is +3
    data = [0, ...data, data[data.length - 1] + 3];

    return {
        "part-1": {
            'question': Display(10, 1),
            'answer': answerOne(data)
        },
        "part-2": {
            'question': Display(10, 2),
            'answer': answerTwo(data)
        },
    }
}