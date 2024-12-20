import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
interface DecodedToken {
  user_id: string;
}

export const generate_token = (user_id: string) => {
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET as string, { algorithm: "HS256" });
    return token;
};

export const verify_token = (token: string): DecodedToken => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string, { algorithms: ["HS256"] }) as DecodedToken;
        return decoded;
    } catch (error) {
        throw new Error("Invalid token");
    }
};
