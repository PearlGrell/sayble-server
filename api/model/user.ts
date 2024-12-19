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
    otp!: string;
    salt!: string;
    tempPassword!: string;
    createdAt: string;
    updatedAt: string;
  
    constructor(user: Omit<User, "id" | "otp" | "isVerified" | "isLoggedIn" | "salt" | "createdAt" | "updatedAt" | "password">) {
        this.id = crypto.randomUUID();
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.isVerified = 0;
        this.isLoggedIn = 0;
        this.dob = user.dob;
        this.image = user.image ?? "";
        this.createdAt = new Date().toISOString().replace('T', ' ').split('.')[0];
        this.updatedAt = new Date().toISOString().replace('T', ' ').split('.')[0];
        this.username = user.username ?? `${this.firstName.toLowerCase()}_${this.lastName.toLowerCase()}_${this.dob.split('-')[0]}`;
    }
}

export default UserModel;  