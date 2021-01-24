import Load from '../util/load';
import Display from '../util/display';

interface Mask {
    mask: string,
    mems: Memory[]
}

interface Memory {
    address: number,
    value: number
}

/**
 * Build an array of masks with there memory inputs
 * 
 * @param data Array of Masks
 */
const extract = (data: string[]) => {
    const masks: Mask[] = [];

    let index: number = -1;

    for (let x = 0; x < data.length; x++) {
        // This line is a new mask
        if (data[x].includes('mask')) {
            ++index;

            // Save the mask value and init an empty array memories
            let [, mask] = /mask = (.+)$/.exec(data[x]) || [];
            masks[index] = {
                mask: mask,
                mems: []
            }

            // This line is a memory
        } else {
            // Build an memory with the address and its value
            let [, address, value] = /mem\[(\d+)\] = (\d+)/.exec(data[x]) || [];
            masks[index].mems.push({
                address: +address,
                value: +value
            });
        }
    }

    return masks;
}

/**
 * Convert a binary array into a interger
 * 
 * @param binary Binary array
 */
const binaryArrayToDecimal = (binary: string[]): number => {
    return parseInt(binary.join(''), 2);
}

/**
 * Convert a interger into a binary array
 * 
 * @param binary Binary array
 */
const decimalToBinaryArray = (value: number): string[] => {
    return value.toString(2)
        .padStart(36, '0')
        .split('');
}

/**
 * Transform memory value by applying the mask
 * 
 * @param mask Mask
 * @param value Memory value
 */
const applyMaskToMemoryValue = (mask: string[], value: number): number => {
    // Transform the value into a binary array
    let binary = decimalToBinaryArray(value);

    // Apply the mask to the value
    for (let x = 0; x < mask.length; x++) {
        if (mask[x] === '1' || mask[x] === '0') {
            binary[x] = mask[x];
        }
    }

    // Convert the binary array back into an number
    return binaryArrayToDecimal(binary);
}

/**
 * Sum of all values left in memory after running the masks and there memories
 * 
 * @param masks Masks
 */
const answerOne = (masks: Mask[]): number => {
    let mask: string[];
    let memory: number[] = [];

    for (let x = 0; x < masks.length; x++) {
        // Keep the current mask
        mask = masks[x].mask.split('');

        // Write the memory addresses with the current mask
        for (let y = 0; y < masks[x].mems.length; y++) {
            memory[masks[x].mems[y].address] = applyMaskToMemoryValue(mask, masks[x].mems[y].value);
        }
    }

    return memory.reduce((prev: number, next: number) => prev + next, 0);
}

/**
 * Find the masked address by applying the mask onto the address
 * 
 * @param mask Mask
 * @param address Address
 */
const findMaskedAddress = (mask: string[], address: number): string[] => {
    // Transform the address into a binary array
    let maskAddress: string[] = decimalToBinaryArray(address);

    // Apply the mask onto the address
    for (let x = 0; x < mask.length; x++) {
        if (mask[x] === '1' || mask[x] === 'X') {
            maskAddress[x] = mask[x];
        }
    }

    return maskAddress;
}

/**
 * Get the floating memories by replacing X by 0 and 1. Transforming a single
 * array into 2 distinc memory addresses
 * 
 * @param memories Array of memories
 */
const findFloatingMemories = (memories: string[][]): string[][] => {
    const processed: string[][] = [];
    let found = false;

    // Transform all the memories
    for (let x in memories) {
        // We found an X, so we need to transform this array
        if (memories[x].includes('X')) {
            let index = memories[x].indexOf('X');

            // Create an array where X is 1
            let floating1 = [...memories[x]]
            floating1[index] = '1';

            // Create an array where X is 0
            let floating0 = [...memories[x]]
            floating0[index] = '0';

            // Add these memories to the processed array
            processed.push(floating1, floating0);
            found = true;
        }
    }

    // If we found an processed memory. We need to run this function again
    return found ? findFloatingMemories(processed) : memories;
}

/**
 * Sum of all values left in memory after running the masks and there memories
 * 
 * @param masks Masks
 */
const answerTwo = (masks: Mask[]) => {
    let mask: string[];
    let memory: number[] = [];
    let maskedAddress: string[];

    for (let x = 0; x < masks.length; x++) {
        // Keep the current mask
        mask = masks[x].mask.split('');

        // Write the memory addresses with the current mask
        for (let y = 0; y < masks[x].mems.length; y++) {
            // Get the current memory address and value
            let { address, value } = masks[x].mems[y];

            // Apply the mask to the address
            maskedAddress = findMaskedAddress(mask, address)

            // Find the floating memories with the masked address and write them to memory
            findFloatingMemories([maskedAddress])
                .map(binary => memory[binaryArrayToDecimal(binary)] = value)
        }
    }

    return Object.values(memory).reduce((prev: number, next: number) => prev + next, 0);
}

export default () => {

    const data: Mask[] = Load(14, extract);

    return {
        "part-1": {
            'question': Display(14, 1),
            'answer': answerOne(data)
        },
        "part-2": {
            'question': Display(14, 2),
            'answer': answerTwo(data)
        },
    }
}