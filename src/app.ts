import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes/';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globlaErrorhandler';
const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//application route
app.use('/api/v1/', router);

const getAController = (req: Request, res: Response) => {
  res.send({ message: 'ok' });
};

app.get('/', getAController);

//console.log(process.cwd());
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
