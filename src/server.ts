import express from 'express';
import { Request, Response } from 'express';
import ResponseTime from './middleware/response-time';

import Day1 from "./controller/day-1";
import Day2 from "./controller/day-2";
import Day3 from "./controller/day-3";
import Day4 from './controller/day-4';
import Day5 from './controller/day-5';
import Day7 from './controller/day-7';
import Day9 from './controller/day-9';
import Day10 from './controller/day-10';
import Day11 from './controller/day-11';
import Day12 from './controller/day-12';
import Day14 from './controller/day-14';
import Day15 from './controller/day-15';
import Day16 from './controller/day-16';
import Day25 from './controller/day-25';

const app = express();
const PORT = 3000;

app.use(ResponseTime);

// Display day 1 - 25
app.get(/\b(0?[1-9]|1[0-9]|2[0-5])\b/, (req: Request, res: Response) => {
  let id: number = +req.params[0];
  let data;

  switch (id) {
    case 1:
      data = Day1();
      break;
    
    case 2:
      data = Day2();
      break;

    case 3:
      data = Day3();
      break;

    case 4:
      data = Day4();
      break;

    case 5:
      data = Day5();
      break;

    case 7:
      data = Day7();
      break;

    case 9:
      data = Day9();
      break;

    case 10:
      data = Day10();
      break;

    case 11:
      data = Day11();
      break;

    case 12:
      data = Day12();
      break;

    case 14:
      data = Day14();
      break;

    case 15:
      data = Day15();
      break;

    case 16:
      data = Day16();
      break;

    case 25:
      data = Day25();
      break;

    default:
      data = `So much to do and so little time... Day ${id} was not found.`;
      break;
  }

  res.send({ data });
});

app.get('*', (_req: Request, res: Response) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log('server started at http://localhost:' + PORT);
});