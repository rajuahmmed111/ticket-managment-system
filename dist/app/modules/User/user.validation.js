"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const createUserSchema = zod_1.z.object({
    userName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    // password: z.string().refine((val) => strongPasswordRegex.test(val), {
    //   message:
    //     'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character',
    // }),
    dateOfBirth: zod_1.z.string(),
});
exports.userValidation = {
    createUserSchema,
};
