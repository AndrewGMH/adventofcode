import Load from '../util/load';
import Display from '../util/display';

interface Bag {
    id: string,
    number: number,
    inner: Bag[]
}

/**
 * Extract the data so each line represents one Bag with a set of inner bags
 * 
 * @param data Array of Bags
 */
const extract = (data: string[]): Bag[] => {
    let bags: Bag[] = [];
    let parts: string[] = [];

    for (let x = 0; x < data.length; x++) {
        parts = data[x].split(" bags contain ");

        bags.push({
            "id": parts[0],
            "number": 1,
            "inner": findInnerBags(parts[1]),
        });
    }

    return bags;
}

/**
 * Break down the second part of the string to find all the inner bags
 * 
 * @param data Array of Bags
 */
const findInnerBags = (data: string): Bag[] => {
    let tmp: Bag[] = [];
    let regex = /(?=(\d) ([ \w]+) bag)/g;
    let m;

    while ((m = regex.exec(data)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        tmp.push({ "id": m[2], "number": +m[1], "inner": [] });
    }

    return tmp;
}

/**
 * Search for all the bags that can contain the first bag
 * 
 * @param search Bag Id that we are searching for
 * @param bags Array of available bags
 * @param contain Array of bags that can contain the first bag
 */
const answerOneRecursive = (search: string, bags: Bag[], contain: string[] = []): string[] => {
    // Was the bag already added ?
    if (contain.indexOf(search) === -1)
        contain.push(search)

    // Go through the available to find those that can fit the bag that we are searching fof
    for (const key in bags) {
        // If this bag can fit the one we searching, can this bag fit in another one ?
        if (bags[key].inner.filter(bag => bag.id === search).length > 0) {
            contain = answerOneRecursive(bags[key].id, bags, contain);
        }
    }

    return contain;
}

/**
 * Search for all the bags that can contain the first bag and multiply it by the number of bags
 * 
 * @param search Bag Id that we are searching for
 * @param number How many bags can fit in this bag
 * @param bags Array of available bags
 * @param total Number of bags that can fit inside the first bag
 */
const answerTwoRecursive = (search: string, number: number, bags: Bag[], total = 0): number => {
    let multiplier: number;

    // Find the bag and if it has inner bags
    let bag = bags.find((bag: Bag) => bag.id === search);
    let innerBags = bag?.inner || [];

    // If the bag has inner bags we need to add them
    if (innerBags.length > 0) {
        // Foreach inner bag
        for (const key in innerBags) {
            // The number of bags is equal to the current bag number times the past one
            multiplier = number * innerBags[key].number;

            // Find if this bag fits in another one
            total += answerTwoRecursive(innerBags[key].id, multiplier, bags, multiplier);
        }
    }

    return total;
}

/**
 * Find how many bags can fit the shiny gold one
 * 
 * @param data Array of Bags
 */
const answerOne = (data: Bag[]): number => {
    return answerOneRecursive("shiny gold", data).length - 1;
}

/**
 * Find how many bags can fit into the shiny gold one
 * 
 * @param data Array of Bags
 */
const answerTwo = (data: Bag[]): number => {
    return answerTwoRecursive("shiny gold", 1, data);
}

export default () => {

    const data: Bag[] = Load(7, extract);

    return {
        "part-1": {
            'question': Display(7, 1),
            'answer': answerOne(data)
        },
        "part-2": {
            'question': Display(7, 2),
            'answer': answerTwo(data)
        },
    }
}