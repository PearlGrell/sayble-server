import { generate_hash } from "../helpers/hash_generator";
import { generate_otp } from "../helpers/otp_generate";
import { verifyPassword } from "../helpers/verify_password";
import { User } from "../types";

class UserModel implements User {
    id: string;
    firstName: string;
    lastName: string;
    username!: string;
    email: string;
    password!: string;
    dob: string;
    image!: string;
    isVerified: number;
    isLoggedIn: number;
    otp: string ="";
    salt!: string;
    tempPassword!: string;
    createdAt: string;
    updatedAt: string;

    constructor(user: Partial<User> & { email: string; firstName: string; lastName: string; dob: string; }) {
        this.id = user.id ?? crypto.randomUUID();
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.isVerified = user.isVerified ?? 0;
        this.isLoggedIn = user.isLoggedIn ?? 0;
        this.dob = user.dob;
        this.username = user.username ?? user.email.split('@')[0];
        this.image = user.image ?? "";
        this.createdAt = user.createdAt ?? new Date().toISOString().replace('T', ' ').split('.')[0];
        this.updatedAt = user.updatedAt ?? new Date().toISOString().replace('T', ' ').split('.')[0];
        if (user.password && user.salt && user.otp) {
            this.password = user.password;
            this.salt = user.salt;
            this.otp = user.otp;
        } else {
            this.set_password(`${this.firstName}${this.lastName}@${this.dob.split('-')[0]}`);
        }
    }

    async set_password(password: string) {
        const { salt, hash } = generate_hash(password);
        this.salt = salt;
        this.password = hash;

        const otp = generate_otp();
        this.otp = otp;

    }

    async verify_password(password: string) : Promise<boolean> {
        return verifyPassword({
            user: this,
            password
        });
    }

    async isUserVerified() : Promise<boolean> {
        return this.isVerified === 1;
    }

    async isUserLoggedIn() : Promise<boolean> {
        return this.isLoggedIn === 1;
    }
}

export default UserModel;  