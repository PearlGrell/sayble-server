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
exports.resetPassword = resetPassword;
const token_1 = require("../../helpers/token");
const response_1 = require("../../helpers/response");
const database_1 = require("../../database/database");
const schema_1 = require("../../database/schema");
const drizzle_orm_1 = require("drizzle-orm");
const user_1 = __importDefault(require("../../models/user"));
function resetPassword(_a) {
    return __awaiter(this, arguments, void 0, function* ({ req, res }) {
        var _b;
        try {
            const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
            const { password, otp } = req.body;
            if (!token)
                return response_1.response.error(res, "Token is required", 400);
            const id = yield (0, token_1.verify_token)(token);
            const userData = yield database_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).get();
            if (!userData)
                return response_1.response.error(res, "User not found", 404);
            const user = new user_1.default(userData);
            yield user.resetPassword(password, otp);
            yield database_1.db.update(schema_1.users).set(user).where((0, drizzle_orm_1.eq)(schema_1.users.id, id)).run();
            response_1.response.success(res, "Password Reset Successfully", "message");
        }
        catch (e) {
            console.error(e);
        }
    });
}
//# sourceMappingURL=reset_password.js.map