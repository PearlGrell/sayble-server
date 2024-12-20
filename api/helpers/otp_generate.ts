import { randomBytes } from "crypto";

export function generate_otp(): string {

    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < 6; i++) {
        const randomIndex = randomBytes(1)[0] % digits.length;
        otp += digits[randomIndex];
    }
    return otp;
}