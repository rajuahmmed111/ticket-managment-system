import express from 'express';
import { authRoutes } from '../modules/Auth/auth.routes';
import { userRoute } from '../modules/User/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
