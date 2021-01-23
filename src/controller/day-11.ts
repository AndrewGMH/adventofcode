import Load from '../util/load';
import Display from '../util/display';

/**
 * Find the number of occupied seats
 * 
 * @param seats  Array of seats
 * @param maxHeight Height boundary of the seats
 * @param maxWidth Width boundary of the seats
 */
const answerOne = (seats: string[], maxHeight: number, maxWidth: number): number => {
    let changed: boolean;
    let updatedSeats: string[];

    do {
        changed = false;
        updatedSeats = [];

        seats.forEach((row, vertical) => {
            let newRow: string = '';
            [...row].forEach((seat, horizontal) => {
                let occupiedSeats: number = 0;

                // Check one seat up and down
                for (let x = -1; x <= 1; x++) {
                    // Check one seat left and rigth
                    for (let y = -1; y <= 1; y++) {
                        // Ignore the current seat
                        if ((x != 0 || y != 0)
                            // Ignore outtabounds positions
                            && vertical + x >= 0
                            && vertical + x < maxHeight
                            && horizontal + y >= 0
                            && horizontal + y < maxWidth
                            // Is this seat occupied ?
                            && seats[vertical + x][horizontal + y] === '#') {
                            occupiedSeats++;
                        }
                    }
                }

                // There are no occupied seats, take the seat
                if (seat === 'L' && occupiedSeats === 0) {
                    changed = true;
                    newRow += '#';

                // Are there atleast 4 occupied seats, empty the seat
                } else if (seat === '#' && occupiedSeats >= 4) {
                    changed = true;
                    newRow += 'L';

                // Nothing changed
                } else {
                    newRow += seat;
                }
            });

            // Save the row layout
            updatedSeats.push(newRow);
        });

        // Save the row layout
        seats = updatedSeats;
    
    // Keep going till the chaos stops
    } while (changed);

    // Count the number of occupied seats
    return seats.join().split('').filter(seat => seat === '#').length;
}

interface Direction {
    x: number,
    y: number
}

/**
 * Find the number of occupied seats
 * 
 * @param seats 
 * @param maxHeight 
 * @param maxWidth 
 */
const answerTwo = (seats: string[], maxHeight: number, maxWidth: number): number => {
    let changed: boolean;
    let updatedSeats: string[];

    const directions: Direction[] = [
        { x: 0, y: 1 },     // top middle
        { x: 1, y: 1 },     // top rigth
        { x: 1, y: 0 },     // middle right
        { x: 1, y: -1 },    // bottom right
        { x: 0, y: -1 },    // bottom middle
        { x: -1, y: -1 },   // left bottom
        { x: -1, y: 0 },    // left middle
        { x: -1, y: 1 },    // top left
    ];

    do {
        changed = false;
        updatedSeats = [];

        seats.forEach((row, vertical) => {
            let newRow: string = '';
            [...row].forEach((seat, horizontal) => {
                let occupiedSeats: number = 0;

                // Check for occupied seats in every dirrection
                directions.forEach(({ x: deltaHorizontal, y: deltaVertical }) => {
                    let horizontalPos = horizontal + deltaHorizontal;
                    let verticalPos = vertical + deltaVertical;

                    // Keep searching till we are outtabounds
                    while (horizontalPos >= 0 && verticalPos >= 0 && horizontalPos < maxWidth && verticalPos < maxHeight) {
                        // This seat is taken in this dirrection
                        if (seats[verticalPos][horizontalPos] === '#') {
                            occupiedSeats++;
                            break;
                        }

                        // This seat is free in this dirrection
                        if (seats[verticalPos][horizontalPos] === 'L') {
                            break;
                        }

                        horizontalPos += deltaHorizontal;
                        verticalPos += deltaVertical;
                    }
                });

                // There are no occupied seats, take the seat
                if (seat === 'L' && occupiedSeats === 0) {
                    changed = true;
                    newRow += '#';

                // Are there atleast 5 occupied seats, empty the seat
                } else if (seat === '#' && occupiedSeats >= 5) {
                    changed = true;
                    newRow += 'L';

                // Nothing changed
                } else {
                    newRow += seat;
                }
            });

            // Save the row layout
            updatedSeats.push(newRow);
        });

        // Update the seats layout
        seats = updatedSeats;
    
    // Keep going till the chaos stops
    } while (changed);

    // Count the number of occupied seats
    return seats.join().split('').filter(seat => seat === '#').length;
}

export default () => {

    const data: string[] = Load(11, (data: string[]) => data);

    // Height boundary
    const maxHeight = data.length;

    // Width boundary
    const maxWidth = data[0].length;

    return {
        "part-1": {
            'question': Display(11, 1),
            'answer': answerOne(data, maxHeight, maxWidth)
        },
        "part-2": {
            'question': Display(11, 2),
            'answer': answerTwo(data, maxHeight, maxWidth)
        },
    }
}