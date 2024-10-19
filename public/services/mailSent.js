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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const settings_1 = require("../config/settings");
const MailType = {
    OTP: 'OTP.html',
    // WELCOME: 'WELCOME.html',
    PASSWORDCHANGED: 'PASSWORDCHANGED.html',
};
const sendMail = (_a) => __awaiter(void 0, void 0, void 0, function* () {
    var { to, mailType } = _a, props = __rest(_a, ["to", "mailType"]);
    try {
        const htmlFilePath = path_1.default.join(__dirname, 'Templates', MailType[mailType]);
        const htmlContent = fs_1.default.readFileSync(htmlFilePath, 'utf8');
        let updatedHtmlContent = Object.entries(props).reduce((content, [key, value]) => content.replace(new RegExp(`{{${key.toUpperCase()}}}`, 'g'), value), htmlContent);
        updatedHtmlContent = updatedHtmlContent.replace(/{{COMPANYNAME}}/g, settings_1.settings.APPNAME);
        const mailOptions = {
            from: settings_1.settings.mail.SMTP_USER,
            to,
            subject: `${settings_1.settings.APPNAME}`,
            html: updatedHtmlContent,
            date: new Date(),
            encoding: 'utf8',
            watchHtml: updatedHtmlContent,
        };
        const transporter = yield nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: settings_1.settings.mail.SMTP_USER,
                pass: settings_1.settings.mail.SMTP_PASS
            },
        });
        const info = yield transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendMail = sendMail;
