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
exports.getUserFromToken = exports.updateProfileImage = exports.resetPassword = exports.forgotPassword = exports.resendOTP = exports.logoutUser = exports.loginUser = exports.updateUsernameAndPassword = exports.verifyUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const User_1 = require("../models/User");
const tokenVerify_1 = require("../helpers/tokenVerify");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getUsers = (_a) => __awaiter(void 0, [_a], void 0, function* ({ request, response, em }) {
    try {
        const users = yield em.find(User_1.UserModel, {});
        return response.status(200).send(users);
    }
    catch (error) {
        console.error('Error getting users:', error);
        const context = {
            message: 'Error getting users',
            error: error,
            status: 500
        };
        return response.status(500).send(context);
    }
});
exports.getUsers = getUsers;
const getUser = (_b) => __awaiter(void 0, [_b], void 0, function* ({ request, response, em }) {
    try {
        const { id } = request.params;
        const user = yield em.findOne(User_1.UserModel, { id: id });
        const image_url = `${request.protocol}://${request.get('host')}/uploads/${user === null || user === void 0 ? void 0 : user.image}`;
        user.image = image_url;
        return response.status(200).send(user);
    }
    catch (error) {
        console.error('Error getting user:', error);
        const context = {
            message: 'Error getting user',
            error: error,
            status: 500
        };
        return response.status(500).send(context);
    }
});
exports.getUser = getUser;
const createUser = (_c) => __awaiter(void 0, [_c], void 0, function* ({ request, response, em }) {
    try {
        const { firstName, lastName, email, dob } = request.body;
        const userExists = yield em.fork().findOne(User_1.UserModel, {
            $or: [
                { email: email }
            ],
        });
        if (userExists && userExists.isVerified) {
            //        logger.info(`User Already Exists - ${userExists}`)
            const context = {
                success: false,
                message: 'User Already Exists',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        const email_username = email.split('@')[0];
        const temp_password = firstName.at(0) + lastName.at(0) + Math.random().toString(36).substring(2, 10);
        let new_user = {};
        if (!userExists) {
            new_user = yield new User_1.UserModel({
                firstName: firstName,
                lastName: lastName,
                email: email,
                dob: dob,
                image: '',
                username: email_username,
                password: temp_password
            });
        }
        else {
            new_user = userExists;
        }
        ;
        const token = yield new_user.getToken();
        // await new_user.setOTP();
        yield new_user.saveUser(em);
        yield new_user.sendMail('OTP');
        //  logger.info(`User Created - ${new_user.id}`);
        const context = {
            success: true,
            message: 'User Created Successfully',
            extras: new_user,
            token: token,
            errorType: null,
            password: `Your password is ${temp_password}`
        };
        return response.status(200).send(context);
    }
    catch (error) {
        console.error('Error creating user:', error);
        const context = {
            message: 'Error creating user',
            error: error,
            status: 500
        };
        return response.status(500).send(context);
    }
    ;
});
exports.createUser = createUser;
const verifyUser = (_d) => __awaiter(void 0, [_d], void 0, function* ({ request, response, em }) {
    var _e;
    try {
        const { OTP } = request.body;
        const _token = ((_e = request.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(" ")[1]) || "";
        const user_id = yield (0, tokenVerify_1.tokenVerify)(_token);
        if (!user_id) {
            //   logger.info(`User Not Found - ${user_id}`);
            const context = {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        const user = yield em.fork().findOne(User_1.UserModel, { id: user_id });
        if (!user) {
            //    logger.info(`User Not Found - ${user_id}`);
            const context = {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        if (user.otp !== OTP) {
            // logger.info(`OTP Not Match - ${OTP}`)
            const context = {
                success: false,
                message: 'OTP Not Match',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        if (user.isVerified) {
            // logger.info(`User Already Verified - ${user.user_id}`)
            const context = {
                success: true,
                message: 'User Already Verified',
                extras: user,
                token: _token,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        yield user.verifyUser();
        user.otp = '';
        yield user.saveUser(em);
        //  await user.sendMail("WELCOME");
        // logger.info(`User Verified - ${user.user_id}`);
        const context = {
            success: true,
            message: 'User Verified Successfully',
            token: _token,
            extras: user,
            errorType: null,
        };
        return response.status(200).send(context);
    }
    catch (error) {
        // logger.error(`User Verification Failed - ${error}`)
        const context = {
            success: false,
            message: 'User Verification Failed',
            extras: null,
            errorType: error
        };
        return response.status(200).send(context);
    }
    ;
});
exports.verifyUser = verifyUser;
const updateUsernameAndPassword = (_f) => __awaiter(void 0, [_f], void 0, function* ({ request, response, em }) {
    var _g;
    try {
        const { username, password } = request.body;
        const _token = ((_g = request.headers.authorization) === null || _g === void 0 ? void 0 : _g.split(" ")[1]) || "";
        const user_id = yield (0, tokenVerify_1.tokenVerify)(_token);
        const user = yield em.fork().findOne(User_1.UserModel, { id: user_id });
        if (!user) {
            return {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
        }
        ;
        yield user.setPassword(password);
        yield user.setUsername(username);
        yield user.saveUser(em);
        const context = {
            success: true,
            message: 'User Updated Successfully',
            extras: user,
            errorType: null
        };
        return response.status(200).send(context);
    }
    catch (error) {
        const context = {
            success: false,
            message: 'User Update Failed',
            extras: null,
            errorType: error
        };
        return response.status(200).send(context);
    }
    ;
});
exports.updateUsernameAndPassword = updateUsernameAndPassword;
const loginUser = (_h) => __awaiter(void 0, [_h], void 0, function* ({ request, response, em }) {
    try {
        const { username, password } = request.body;
        const user = yield em.fork().findOne(User_1.UserModel, {
            username: username
        });
        if (!user) {
            const context = {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        const token = yield user.getToken();
        const passwordMatch = yield user.verifyPassword(password);
        if (!passwordMatch) {
            const context = {
                success: false,
                message: 'Password Not Match',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        if (!(yield user.isUserVerified())) {
            // logger.info(`User Not Verified - ${user.username}`)
            const context = {
                success: false,
                message: 'User Not Verified, Please Verify Your Email',
                extras: user,
                errorType: null,
                token: token
            };
            return response.status(200).send(context);
        }
        ;
        if (yield user.isUserLoggedin()) {
            //  logger.info(`User Already Logged In - ${user.username}`)
            const context = {
                success: true,
                message: 'User Already Logged In',
                extras: user,
                token: token,
                errorType: null,
            };
            return response.status(200).send(context);
        }
        ;
        yield user.loginUser();
        yield user.saveUser(em);
        //logger.info(`User Logged In - ${user.username}`);
        const context = {
            success: true,
            message: 'User Logged In Successfully',
            extras: user,
            token: token,
            errorType: null
        };
        return response.status(200).send(context);
    }
    catch (error) {
        const context = {
            success: false,
            message: 'User Login Failed',
            extras: null,
            errorType: error
        };
        return response.status(200).send(context);
    }
    ;
});
exports.loginUser = loginUser;
const logoutUser = (_j) => __awaiter(void 0, [_j], void 0, function* ({ request, response, em }) {
    var _k;
    try {
        const _token = ((_k = request.headers.authorization) === null || _k === void 0 ? void 0 : _k.split(" ")[1]) || "";
        const user_id = yield (0, tokenVerify_1.tokenVerify)(_token);
        const user = yield em.fork().findOne(User_1.UserModel, {
            id: user_id
        });
        if (!user) {
            const context = {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        yield user.logoutUser();
        yield user.saveUser(em);
        const context = {
            success: true,
            message: 'User Logged Out Successfully',
            extras: user,
            errorType: null
        };
        return response.status(200).send(context);
    }
    catch (error) {
        const context = {
            success: false,
            message: 'User Logout Failed',
            extras: null,
            errorType: error
        };
        return response.status(200).send(context);
    }
    ;
});
exports.logoutUser = logoutUser;
const resendOTP = (_l) => __awaiter(void 0, [_l], void 0, function* ({ request, response, em }) {
    var _m;
    try {
        const _token = ((_m = request.headers.authorization) === null || _m === void 0 ? void 0 : _m.split(" ")[1]) || "";
        const user_id = yield (0, tokenVerify_1.tokenVerify)(_token);
        const user = yield em.fork().findOne(User_1.UserModel, {
            id: user_id
        });
        if (!user) {
            const context = {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        if (yield user.isUserVerified()) {
            const context = {
                success: false,
                message: 'User Already Verified',
                extras: user,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        if (yield user.isUserLoggedin()) {
            const context = {
                success: false,
                message: 'User Already Logged In',
                extras: user,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        yield user.resendOTP();
        yield user.sendMail("OTP");
        yield user.saveUser(em);
        const context = {
            success: true,
            message: 'OTP Sent Successfully',
            extras: user,
            errorType: null
        };
        return response.status(200).send(context);
    }
    catch (error) {
        const context = {
            success: false,
            message: 'OTP Resend Failed',
            extras: null,
            errorType: error
        };
        return response.status(200).send(context);
    }
    ;
});
exports.resendOTP = resendOTP;
const forgotPassword = (_o) => __awaiter(void 0, [_o], void 0, function* ({ request, response, em }) {
    try {
        const { email } = request.body;
        const user = yield em.fork().findOne(User_1.UserModel, {
            email: email
        });
        if (!user) {
            const context = {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        yield user.resendOTP();
        yield user.sendMail("PASSWORDCHANGED");
        yield user.saveUser(em);
        const context = {
            success: true,
            message: 'Password Reset Email Sent Successfully',
            extras: user,
            errorType: null
        };
        return response.status(200).send(context);
    }
    catch (error) {
        const context = {
            success: false,
            message: 'Password Reset Failed',
            extras: null,
            errorType: error
        };
        return response.status(200).send(context);
    }
    ;
});
exports.forgotPassword = forgotPassword;
const resetPassword = (_p) => __awaiter(void 0, [_p], void 0, function* ({ request, response, em }) {
    var _q;
    try {
        const { password } = request.body;
        const _token = ((_q = request.headers.authorization) === null || _q === void 0 ? void 0 : _q.split(" ")[1]) || "";
        const user_id = yield (0, tokenVerify_1.tokenVerify)(_token);
        const user = yield em.fork().findOne(User_1.UserModel, {
            id: user_id
        });
        if (!user) {
            const context = {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        if (!(yield user.isUserVerified())) {
            const context = {
                success: false,
                message: 'User Not Verified',
                extras: user,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        yield user.setPassword(password);
        yield user.saveUser(em);
        const context = {
            success: true,
            message: 'Password Reset Successfully',
            extras: user,
            errorType: null
        };
        return response.status(200).send(context);
    }
    catch (error) {
        const context = {
            success: false,
            message: 'Password Reset Failed',
            extras: null,
            errorType: error
        };
        return response.status(200).send(context);
    }
    ;
});
exports.resetPassword = resetPassword;
const updateProfileImage = (_r) => __awaiter(void 0, [_r], void 0, function* ({ request, response, em }) {
    var _s;
    try {
        const _token = ((_s = request.headers.authorization) === null || _s === void 0 ? void 0 : _s.split(" ")[1]) || "";
        const user_id = yield (0, tokenVerify_1.tokenVerify)(_token);
        const file_extension = request.body.file_extension;
        const image_base64 = request.body.image;
        // Decode base64 string
        const imageBuffer = yield Buffer.from(image_base64, 'base64');
        const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir);
        }
        ;
        // Generate a unique filename
        const filename = `${user_id}_${Date.now()}.` + `${file_extension}`;
        const filepath = path_1.default.join(__dirname, '..', 'uploads', filename);
        // Write the image to the filesystem
        yield fs_1.default.writeFileSync(filepath, imageBuffer);
        const user = yield em.fork().findOne(User_1.UserModel, {
            id: user_id
        });
        if (!user) {
            const context = {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        const imageUrl = `${request.protocol}://${request.get('host')}/uploads/${filename}`;
        user.image = filename;
        yield user.saveUser(em);
        const context = {
            success: true,
            message: 'Profile Image Updated Successfully',
            extras: imageUrl,
            errorType: null
        };
        return response.status(200).send(context);
    }
    catch (error) {
        const context = {
            success: false,
            message: 'User Not Found',
            extras: null,
            errorType: error
        };
        return response.status(200).send(context);
    }
    ;
});
exports.updateProfileImage = updateProfileImage;
const getUserFromToken = (_t) => __awaiter(void 0, [_t], void 0, function* ({ request, response, em }) {
    var _u;
    try {
        const _token = ((_u = request.headers.authorization) === null || _u === void 0 ? void 0 : _u.split(" ")[1]) || "";
        const user_id = yield (0, tokenVerify_1.tokenVerify)(_token);
        const user = yield em.fork().findOne(User_1.UserModel, {
            id: user_id
        });
        const imageUrl = `${request.protocol}://${request.get('host')}/uploads/${user === null || user === void 0 ? void 0 : user.image}`;
        user.image = imageUrl;
        if (!user) {
            const context = {
                success: false,
                message: 'User Not Found',
                extras: null,
                errorType: null
            };
            return response.status(200).send(context);
        }
        ;
        const context = {
            success: true,
            message: 'User Found',
            extras: user,
            errorType: null
        };
        return response.status(200).send(context);
    }
    catch (error) {
        const context = {
            success: false,
            message: 'User Not Found',
            extras: null,
            errorType: error
        };
        return response.status(200).send(context);
    }
    ;
});
exports.getUserFromToken = getUserFromToken;
