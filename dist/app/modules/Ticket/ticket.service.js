"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// create ticket
const createTicket = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const newTicket = yield prisma_1.default.ticket.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    UserStatus: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
    return newTicket;
});
//update ticket
const updateTicket = (payload, ticketId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const ticket = yield prisma_1.default.ticket.findUnique({
        where: {
            id: ticketId,
        },
    });
    if (!ticket) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Ticket not found');
    }
    if (ticket.userId !== userId) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update this ticket');
    }
    const updatedTicket = yield prisma_1.default.ticket.update({
        where: { id: ticketId },
        data: payload,
    });
    return updatedTicket;
});
// ticket soft delete
const deleteTicket = (ticketId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const ticket = yield prisma_1.default.ticket.findUnique({
        where: {
            id: ticketId,
        },
    });
    if (!ticket) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Ticket not found');
    }
    if (ticket.userId !== userId) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to delete this ticket');
    }
    yield prisma_1.default.ticket.update({
        where: { id: ticketId },
        data: { isDeleted: true },
    });
});
// view tickets
const viewTickets = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const tickets = yield prisma_1.default.ticket.findMany({
        where: { userId, isDeleted: false },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                },
            },
        },
    });
    return tickets;
});
// view single ticket
const viewSingleTicket = (ticketId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const ticket = yield prisma_1.default.ticket.findUnique({
        where: {
            id: ticketId,
            isDeleted: false,
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                },
            },
        },
    });
    if (!ticket) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Ticket not found');
    }
    if (ticket.userId !== userId) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to view this ticket');
    }
    return ticket;
});
exports.ticketService = {
    createTicket,
    updateTicket,
    deleteTicket,
    viewTickets,
    viewSingleTicket,
};
