
import jwt from "jsonwebtoken"
import { settings } from "../config/settings"

const generateToken = (user_id: string) => {
    const token = jwt.sign({ user_id }, settings.auth.JWT_SECRET as string, { algorithm: "HS256" })

    return token
}

export default generateToken