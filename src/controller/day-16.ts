import Load from '../util/load';
import Display from '../util/display';

interface Field {
    key: string,
    firstRange: number[],
    secondRange: number[],
}

interface Index {
    index: number,
    key: string,
}

/**
 * Extract all the fields, my ticket and other tickets
 * 
 * @param data 
 */
const extract = (data: string[]) => {
    let section: number = 1;
    const fields: Field[] = [];
    const myTicket: number[] = [];
    const otherTickets: number[][] = [];

    for (let row of data) {
        // Ignore header
        if (row === 'your ticket:' || row === 'nearby tickets:') {
            continue;
        // If the row is empty its a new section
        } else if (row === '') {
            ++section;
            continue;
        }

        switch (section) {
            // Fields
            case 1:
                let [key, ranges] = row.split(': ');

                let [firstRange, secondRange] = ranges.split(' or ');

                let [minFirstRange, maxFirstRange] = firstRange.split('-');

                let [minSecondRange, maxSecondRange] = secondRange.split('-');

                fields.push({
                    'key': key,
                    'firstRange': [+minFirstRange, +maxFirstRange],
                    'secondRange': [+minSecondRange, +maxSecondRange]
                });
                break;
            
            // My ticket
            case 2:
                row.split(',').map(x => myTicket.push(+x));
                break;

            // Other tickets
            case 3:
                otherTickets.push(row.split(',').map(x => +x));
                break;
        }
    }

    return [fields, myTicket, otherTickets];
}

/**
 * Validate that the value is in the field ranges
 * 
 * @param value Value that we are checking
 * @param firstRange First range
 * @param secondRange Second range
 */
const validateValueInRanges = (value: number, firstRange: number[], secondRange: number[]): boolean => {
    return (value >= firstRange[0] && value <= firstRange[1]) || (value >= secondRange[0] && value <= secondRange[1]);
}

/**
 * Check each number of the ticket to make sure that it can be in atleast one field range
 * 
 * @param ticket The ticket numbers
 * @param fields Fields to validate
 */
const findInvalidNumberInRanges = (ticket: number[], fields: Field[]): number => {
    let check: boolean[] = [];

    // Check each number to find if it fits in any range
    for (let value of ticket) {
        check = [];
        for (let field of fields) {
            check.push(validateValueInRanges(value, field.firstRange, field.secondRange));
        }

        // This number is invalid since it doesn't fit in any range
        if (check.filter(x => x === true).length === 0) {
            return value;
        }
    }

    return -1;
}

/**
 * Find the scanning error rate by adding each invalid ticket numbers
 * 
 * @param data Array that contains the fields, my ticket and other tickets
 */
const answerOne = (data: any[]): number => {
    let [fields, , otherTickets] = data;

    // Find invalid tickets
    return [...otherTickets.map((ticket: number[]) => findInvalidNumberInRanges(ticket, fields))]
        // Ignore valid ticket
        .filter(x => x !== -1)
        // Add the invalid ticket numbers
        .reduce((prev: number, next: number) => next + prev, 0);
}

/**
 * Find all the possibilities that where defined by the other travelers tickets
 * 
 * @param otherTickets Other travelers tickets
 * @param fields The fields
 */
const findPosibleFieldIndexes = (otherTickets: number[][], fields: Field[]): Index[][] => {
    let positionsPerTicket: Index[][] = [];
    let positions: Index[];

    for (let ticket of otherTickets) {
        // Reset the current tiket positions
        positions = [];

        // Check each field for possible fields
        for (let key in ticket) {
            for (let field of fields) {
                // Does this value fit in the current field ?
                if (validateValueInRanges(ticket[key], field.firstRange, field.secondRange)) {
                    positions.push({ index: +key, key: field.key });
                }
            }
        }
        // Keep all the position of the current ticket
        positionsPerTicket.push(positions);
    }

    return positionsPerTicket;
}

/**
 * Find each field index based on all the possibilities that where defined by the other travelers tickets
 * 
 * @param fieldIndexes All the possibilities that where defined by the other travelers tickets
 * @param keys All the index keys
 * @param indexes All the index positions
 * @param current The current index position
 * @param memory The field indexes that we have found
 */
const findFieldByIndex = (fieldIndexes: any[], keys: string[], indexes: number[], current: number, memory: Index[] = []): Index[] => {
    // We found all the keys !
    if (keys.length === 0) {
        return memory;
    }

    // Keys that where are looking for in the current iteration
    let keysToCheck = [...keys];

    // Go througth all possible field indexes
    for (const fieldIndex of fieldIndexes) {
        // Keep the field indexes of the position that we are looking for
        let possibleFieldsIndexes = fieldIndex.filter((fieldIndex: Index) => fieldIndex.index == indexes[current])
            .map((fieldIndex: Index) => fieldIndex.key);

        // Remove the keys that can't be in the current position
        for (const key of keysToCheck) {
            if (!possibleFieldsIndexes.includes(key)) {
                keysToCheck.splice(keysToCheck.indexOf(key), 1)
            }
        }
    }

    // Is this the only possible position ?
    if (keysToCheck.length === 1) {
        // Get the key
        let key = keysToCheck.pop() || '';
        
        // Remove it from the search
        keys.splice(keys.indexOf(key), 1);
        
        // Keep in memory where the key is
        memory.push({ index: indexes[current], key: key });
    }

    // Look for the next index
    ++current;
    if (current >= indexes.length) {
        current = 0;
    }

    return findFieldByIndex(fieldIndexes, keys, indexes, indexes[current], memory);
}

/**
 * Find the six fields on your ticket that start with the word departure and multiply them.
 * 
 * @param data Array that contains the fields, my ticket and other tickets
 */
const answerTwo = (data: any[]): number => {
    const [fields, myTicket, otherTickets] = data;

    // Word we are looking for
    const search = 'departure';

    // Validate the tickets
    const validatedTickets = [...otherTickets.filter((ticket: number[]) => findInvalidNumberInRanges(ticket, fields) === -1)];

    // Find all possible field indexes for each validated ticket
    const fieldIndexes = findPosibleFieldIndexes(validatedTickets, fields);
    const fieldKeys = fields.map((field: Field) => field.key);

    // Find the index of each field
    return findFieldByIndex(fieldIndexes, fieldKeys, [...fieldKeys.map((_key: number, index: number) => index)], 0)
        // Only keep the fields with the word that we are looking for
        .filter((memory) => memory.key.includes(search))
        // Multiply the numbers of our ticket based on the field index
        .reduce((prev, next) => {
            return prev * myTicket[next.index];
        }, 1);
}


export default () => {

    const data = Load(16, extract);

    return {
        "part-1": {
            'question': Display(16, 1),
            'answer': answerOne(data)
        },
        "part-2": {
            'question': Display(16, 2),
            'answer': answerTwo(data)
        },
    }
}