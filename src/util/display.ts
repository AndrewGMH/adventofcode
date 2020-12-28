import Storage from "./storage";
import fs from "fs";

export default (day:number, part:number): string => {
    let question = '';

    try {
        // Get the file path
        const file = `${Storage}/${day}/part-${part}.html`;

        if (!fs.existsSync(file)) {
            // Throw file does not exist or is not redable
        }

        // Extract the data with the custom function
        question = fs.readFileSync(file, 'utf8');

    } catch (error) {
        // Display the error
    }

    return question;
}