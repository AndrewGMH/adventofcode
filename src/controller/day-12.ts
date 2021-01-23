import Load from '../util/load';
import Display from '../util/display';

const possibleDirections: ("N" | "E" | "S" | "W")[] = ["N", "E", "S", "W"];

interface Ship {
    currentDirection: "N" | "E" | "S" | "W",
    N: number,
    E: number,
    S: number,
    W: number,
}

interface Waypoint {
    N: number,
    E: number,
    S: number,
    W: number,
}

interface Instruction {
    direction: string,
    force: number
}

/**
 * Find the North/South diff of the model position
 * 
 * @param model Ship or Waypoint model
 */
const getNortSouth = (model: Ship | Waypoint): number => {
    let nortSouth: number = model.N - model.S;
    if (nortSouth < 0)
        nortSouth *= -1;

    return nortSouth;
}

/**
 * Find the East/West diff of the model position
 * 
 * @param model Ship or Waypoint model
 */
const getEastWest = (model: Ship | Waypoint): number => {
    let eastWest: number = model.E - model.W;
    if (eastWest < 0)
        eastWest *= -1;

    return eastWest;
}

/**
 * Extract an array of instructions
 * 
 * @param data Array of instructions
 */
const extract = (data: string[]): Instruction[] => {
    const inputs: Instruction[] = [];
    let row;

    // Each line is an instruction
    for (let x = 0; x < data.length; x++) {
        // Seperate the instructions
        row = data[x].match("([A-Z])([0-9]+)") || [];
        if (1 in row && 2 in row) {
            inputs.push({
                direction: row[1],
                force: +row[2]
            });
        }
    }

    return inputs;
}

/**
 * Change the ship position counter clockwise based on the current position and the number of turns
 * 
 * @param ship The ship position
 * @param rotaion Number of degrees to rotate the ship
 */
const changeDirectionLeft = (ship: Ship, rotaion: number): void => {
    // Number of turns
    let turns: number = (rotaion / 90) % 4;

    // 360, so there's nothing todo
    if (turns === 0) {
        return;
    }

    // Current position
    let current = possibleDirections.indexOf(ship.currentDirection);

    // Find the new position
    current -= turns;
    if (current < 0) {
        current += possibleDirections.length;
    }

    // Set the new ship position
    ship.currentDirection = possibleDirections[current];
}

/**
 * Change the ship position clockwise based on the current position and the number of turns
 * 
 * @param ship The ship position
 * @param rotaion Number of degrees to rotate the ship
 */
const changeDirectionRigth = (ship: Ship, rotaion: number): void => {
    // Number of turns
    let turns: number = (rotaion / 90) % 4;

    // 360, so there's nothing todo
    if (turns === 0) {
        return;
    }

    // Current position
    let current = possibleDirections.indexOf(ship.currentDirection);

    // Change the ship position
    ship.currentDirection = possibleDirections[(current + turns) % 4];
}

/**
 * Find the ship position based on the instructions
 * 
 * @param instructions Array of instructions
 */
const answerOne = (instructions: Instruction[]): number => {
    // Ship starting position
    const ship: Ship = {
        currentDirection: 'E',
        N: 0,
        E: 0,
        S: 0,
        W: 0,

    };

    instructions.forEach(instruction => {
        switch (instruction.direction) {
            // Change ship position
            case "N":
            case "S":
            case "E":
            case "W":
                ship[instruction.direction] += instruction.force;
                break;

            // Go foward in current direction
            case "F":
                ship[ship.currentDirection] += instruction.force;
                break;

            // Turn left
            case "L":
                changeDirectionLeft(ship, instruction.force);
                break;

            // Turn rigth
            case "R":
                changeDirectionRigth(ship, instruction.force);
                break;
        }
    });

    return getNortSouth(ship) + getEastWest(ship);
}

/**
 * Move the ship to the waypoint
 * 
 * @param ship The ship position
 * @param waypoint The waypoint position
 * @param force The times the ship needs to move to the waypoint
 */
const moveToWaipoint = (ship: Ship, waypoint: Waypoint, force: number): Ship => {
    possibleDirections.forEach(direction => {
        // Move the ship in this direction based on force
        ship[direction] += (waypoint[direction] * force);
    });

    return ship;
}

/**
 * Rotate the waypoint to the counter clockwise
 * 
 * @param waypoint The waypoint position
 * @param rotaion Number of degrees to rotate the waypoint
 */
const changeWaipointDirectionLeft = (waypoint: Waypoint, rotaion: number): void => {
    // Number of turns
    let turns: number = (rotaion / 90) % 4;

    // 360, so there's nothing todo
    if (turns === 0) {
        return;
    }

    // Waypoint positions
    let { N, E, S, W } = waypoint;

    // How many left turns ?
    switch (turns) {
        case 1:
            waypoint.N = E;
            waypoint.E = S;
            waypoint.S = W;
            waypoint.W = N;
            break;
        case 2:
            waypoint.N = S;
            waypoint.E = W;
            waypoint.S = N;
            waypoint.W = E;
            break;
        case 3:
            waypoint.N = W;
            waypoint.E = N;
            waypoint.S = E;
            waypoint.W = S;
            break;
    }
}

/**
 * Rotate the waypoint to the clockwise
 * 
 * @param waypoint The waypoint position
 * @param rotaion Number of degrees to rotate the waypoint
 */
const changeWaipointDirectionRigth = (waypoint: Waypoint, rotaion: number): void => {
    // Number of turns
    let turns: number = (rotaion / 90) % 4;

    // 360, so there's nothing todo
    if (turns === 0) {
        return;
    }

    // Waypoint positions
    let { N, E, S, W } = waypoint;

    // How many rigth turns ?
    switch (turns) {
        case 1:
            waypoint.N = W;
            waypoint.E = N;
            waypoint.S = E;
            waypoint.W = S;
            break;
        case 2:
            waypoint.N = S;
            waypoint.E = W;
            waypoint.S = N;
            waypoint.W = E;
            break;
        case 3:
            waypoint.N = E;
            waypoint.E = S;
            waypoint.S = W;
            waypoint.W = N;
            break;
    }
}

/**
 * Find the ship position based on the waypoint instructions
 * 
 * @param instructions Array of instructions
 */
const answerTwo = (instructions: Instruction[]): number => {
    // Ship starting position
    const ship: Ship = {
        currentDirection: 'E',
        N: 0,
        E: 0,
        S: 0,
        W: 0,
    };

    // Waypoint starting position
    const waypoint: Waypoint = {
        N: 1,
        E: 10,
        S: 0,
        W: 0,
    };

    instructions.forEach(instruction => {
        switch (instruction.direction) {
            // Change waypoint position
            case "N":
            case "S":
            case "E":
            case "W":
                waypoint[instruction.direction] += instruction.force;
                break;

            // Go foward in current direction
            case "F":
                moveToWaipoint(ship, waypoint, instruction.force);
                break;

            // Turn left
            case "L":
                changeWaipointDirectionLeft(waypoint, instruction.force);
                break;

            // Turn rigth
            case "R":
                changeWaipointDirectionRigth(waypoint, instruction.force);
                break;
        }
    });

    return getNortSouth(ship) + getEastWest(ship);
}

export default () => {

    const data: Instruction[] = Load(12, extract);

    return {
        "part-1": {
            'question': Display(12, 1),
            'answer': answerOne(data)
        },
        "part-2": {
            'question': Display(12, 2),
            'answer': answerTwo(data)
        },
    }
}