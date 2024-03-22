import userRouter from './user.js';
import { errHandler, notFound } from '../middlewares/errHandler.js';

const initRoutes = (app) => {
  app.use('/api/user', userRouter);

  app.use(notFound);
  app.use(errHandler);
};

export { initRoutes };
