"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Third-party imports
const otp_generator_1 = require("otp-generator");
// import logger from '../logger/Logging'
const otpGenerate = () => {
    // logger.info(`🚀 OTP generated`)
    return (0, otp_generator_1.generate)(6, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false
    });
};
exports.default = otpGenerate;
