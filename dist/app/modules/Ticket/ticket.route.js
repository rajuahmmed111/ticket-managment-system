"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const ticket_controller_1 = require("./ticket.controller");
const router = express_1.default.Router();
// ticket create
router.post('/create', (0, auth_1.default)(), ticket_controller_1.ticketController.createTicket);
// ticket update
router.put('/update/:id', (0, auth_1.default)(), ticket_controller_1.ticketController.updateTicket);
// ticket soft delete
router.patch('/delete/:id', (0, auth_1.default)(), ticket_controller_1.ticketController.deleteTicket);
// tickets view
router.get('/view', (0, auth_1.default)(client_1.Role.ADMIN), ticket_controller_1.ticketController.viewTickets);
// view single ticket
router.get('/view/:id', (0, auth_1.default)(), ticket_controller_1.ticketController.viewSingleTicket);
exports.ticketRoute = router;
