import express from 'express';
import authRoutes from './authRoutes';
import rideRoutes from './rideRoutes';


const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/rides',
        route: rideRoutes,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
