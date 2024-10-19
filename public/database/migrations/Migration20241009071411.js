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
exports.Migration20241009071411 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20241009071411 extends migrations_1.Migration {
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.addSql('create table `User` (`id` text not null, `first_name` text not null, `last_name` text not null, `username` text null, `email` text not null, `password` text null, `dob` datetime not null default 1728458050431, `image` text not null, `is_verified` integer not null, `is_logged_in` integer not null, `otp` text not null, `salt` text not null, `temp_password` text not null, `created_at` datetime not null default 1728458050433, `updated_at` datetime not null default 1728458050433, primary key (`id`));');
        });
    }
}
exports.Migration20241009071411 = Migration20241009071411;
