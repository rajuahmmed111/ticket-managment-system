"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const changePasswordValidationSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(8),
    newPassword: zod_1.z.string().refine((val) => strongPasswordRegex.test(val), {
        message: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character',
    }),
});
exports.authValidation = {
    changePasswordValidationSchema,
};
