import Storage from "./storage";
import fs from "fs";

/**
 * Get the data then extract the values with the custom extract function
 * 
 * @return Array
 */
export default (day:number, extract: (data: Array<string>) => Array<any>) => {
    let data = [];

    try {
        // Get the file path
        const file = `${Storage}/${day}/data.txt`;

        if (!fs.existsSync(file)) {
            // Throw file does not exist or is not redable
        }

        // Extract the data with the custom function
        data = extract(fs.readFileSync(file, 'utf8').split('\n'));

    } catch (error) {
        // Display the error
    }

    return data;
}