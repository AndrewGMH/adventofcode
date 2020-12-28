import express from 'express';
import { Request, Response } from 'express';
import ResponseTime from './middleware/response-time';

import Day1 from "./controller/day-1";

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

    default:
      data = `So much to do and so little time... Day ${id} was not found.`;
      break;
  }

  res.send({ data });
});

app.listen(PORT, () => {
  console.log('server started at http://localhost:' + PORT);
});