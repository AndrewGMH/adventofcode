import express from 'express';
import { Request, Response } from 'express';
import ResponseTime from './middleware/response-time';

const app = express();
const PORT = 3000;

app.use(ResponseTime);

app.get('/', (_req: Request, res: Response) => {
  res.send({
    message: 'hello world',
  });
});

app.listen(PORT, () => {
  console.log('server started at http://localhost:' + PORT);
});