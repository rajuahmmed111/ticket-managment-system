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
const ws_1 = require("ws");
const client_1 = require("@prisma/client");
const config_1 = __importDefault(require("./config"));
const app_1 = __importDefault(require("./app"));
// import { privateMessageService } from "./app/modules/privateMessage/privateMessage.service";
const prisma = new client_1.PrismaClient();
let wss;
const channelClients = new Map();
function broadcastToChannel(channelId, data, excludeSocket = null) {
    const clients = channelClients.get(channelId);
    if (clients) {
        clients.forEach((client) => {
            if (excludeSocket !== client && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = app_1.default.listen(config_1.default.port, () => {
            console.log('Server running on port', config_1.default.port);
        });
        // new WebSocket server
        wss = new ws_1.WebSocketServer({ server });
        // client handle connection
        wss.on('connection', (ws) => {
            console.log('New WebSocket connection!');
            let channelId = null;
            // client received message
            ws.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    const parsed = JSON.parse(message.toString());
                    if (parsed.type === 'subscribe' && parsed.channelId) {
                        channelId = parsed.channelId;
                        if (channelId && !channelClients.has(channelId)) {
                            channelClients.set(channelId, new Set());
                        }
                        channelId && ((_a = channelClients.get(channelId)) === null || _a === void 0 ? void 0 : _a.add(ws));
                        ws.send(JSON.stringify({ type: 'subscribed', channelId }));
                    }
                    else if (parsed.type === 'message') {
                        const channelId = parsed.channelId;
                        const privateMessage = parsed.message;
                        broadcastToChannel(channelId, privateMessage);
                    }
                    // else if (
                    //   parsed.type === "offer" ||
                    //   parsed.type === "answer" ||
                    //   parsed.type === "candidate"
                    // ) {
                    //   broadcastToChannel(parsed.channelName, parsed, ws);
                    // }
                }
                catch (err) {
                    console.error('error:', err.message);
                }
            }));
            ws.on('close', () => {
                var _a, _b;
                if (channelId) {
                    (_a = channelClients.get(channelId)) === null || _a === void 0 ? void 0 : _a.delete(ws);
                    if (((_b = channelClients.get(channelId)) === null || _b === void 0 ? void 0 : _b.size) === 0) {
                        channelClients.delete(channelId);
                    }
                }
                console.log('Client disconnected!');
            });
        });
    });
}
main();
