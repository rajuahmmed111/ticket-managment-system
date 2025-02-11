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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// import { initiateSuperAdmin } from "../app/db/db";
const prisma = new client_1.PrismaClient();
// Handle connection issues
function connectPrisma() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log('Prisma connected to the database successfully!');
        }
        catch (error) {
            console.error('Prisma connection failed:', error);
            process.exit(1); // Exit process with failure
        }
        // Graceful shutdown
        process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
            yield prisma.$disconnect();
            console.log('Prisma disconnected due to application termination.');
            process.exit(0);
        }));
    });
}
connectPrisma();
exports.default = prisma;
