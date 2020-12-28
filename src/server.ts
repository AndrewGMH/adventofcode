import express from 'express';
import { Request, Response } from 'express';
const app = express();
const PORT = 3000;

app.use((req: Request, res: Response, next: () => void) => {
    const startHrTime = process.hrtime();

    res.on("finish", () => {
      const elapsedHrTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
      console.log("%s : %fms", req.path, elapsedTimeInMs);
    });
  
    next();
});

app.get('/', (_req: Request, res: Response) => {
  res.send({
    message: 'hello world',
  });
});

app.listen(PORT, () => {
  console.log('server started at http://localhost:'+PORT);
});