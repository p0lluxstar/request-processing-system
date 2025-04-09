import { env } from 'process';
import express from 'express';
import { Application } from 'express';
import morgan from 'morgan';
import { APP_NAME } from './constants/params';
import requestsRoute from './routes/request.route';

const app: Application = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use('/requests', requestsRoute);
app.get('/', (req, res) => {
  res.send(APP_NAME)
})

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
