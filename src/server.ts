import express from 'express';
import { Request, Response } from 'express';
import ResponseTime from './middleware/response-time';

import Day1 from "./controller/day-1";
import Day2 from "./controller/day-2";
import Day3 from "./controller/day-3";
import Day4 from './controller/day-4';
import Day5 from './controller/day-5';
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