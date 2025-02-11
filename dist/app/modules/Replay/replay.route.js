"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replayRoute = void 0;
const express_1 = __importDefault(require("express"));
const replay_controller_1 = require("./replay.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
// send replay 
router.post('/send-message/:receiverId', (0, auth_1.default)(), replay_controller_1.replayController.sendReplay);
router.get('/channels', (0, auth_1.default)(), replay_controller_1.replayController.getUserChannels);
// get all message
router.get('/get-message/:channelName', (0, auth_1.default)(), replay_controller_1.replayController.getMessages);
exports.replayRoute = router;
