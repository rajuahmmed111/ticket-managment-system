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
exports.replayService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendReplay = (senderId, ticketId, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!senderId) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const ticket = yield prisma_1.default.ticket.findUnique({
        where: { id: ticketId },
        include: {
            user: {
                select: { id: true },
            },
        },
    });
    if (!ticket || !ticket.user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, 'Receiver not found');
    }
    const receiverId = ticket.user.id;
    const [person1, person2] = [senderId, receiverId].sort();
    const channelName = person1 + person2;
    const [channel, newMessage] = yield prisma_1.default.$transaction((prismaTransaction) => __awaiter(void 0, void 0, void 0, function* () {
        let channel = yield prismaTransaction.channel.findFirst({
            where: { channelName: channelName },
        });
        if (!channel) {
            channel = yield prismaTransaction.channel.create({
                data: {
                    channelName,
                    person1Id: senderId,
                    person2Id: receiverId,
                },
            });
        }
        //create message
        //  message created
        const newMessage = yield prismaTransaction.replay.create({
            data: {
                message,
                senderId,
                channelName: channelName,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
        return [channel, newMessage];
    }));
    //  all messages channel for the sender and receiver
    const allMessages = yield prisma_1.default.channel.findMany({
        where: {
            channelName: channelName,
        },
        include: {
            replay: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return allMessages;
});
// get all messages
const getMessages = (channelName) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield prisma_1.default.channel.findMany({
        where: {
            channelName: channelName,
        },
        select: {
            replay: {
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
    return message;
});
// get user channels
const getUserChannels = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const channels = yield prisma_1.default.channel.findMany({
        where: {
            OR: [{ person1Id: userId }, { person2Id: userId }],
        },
        include: {
            person1: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                },
            },
            person2: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                },
            },
        },
    });
    return channels;
});
exports.replayService = {
    sendReplay,
    getMessages,
    getUserChannels,
};
