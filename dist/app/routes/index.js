"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/Auth/auth.routes");
const user_route_1 = require("../modules/User/user.route");
const ticket_route_1 = require("../modules/Ticket/ticket.route");
const replay_route_1 = require("../modules/Replay/replay.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: user_route_1.userRoute,
    },
    {
        path: '/auth',
        route: auth_routes_1.authRoutes,
    },
    {
        path: '/ticket',
        route: ticket_route_1.ticketRoute,
    },
    {
        path: '/replay',
        route: replay_route_1.replayRoute,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
