import { Context } from "hono";
import { ResponseParams } from "../types";

export function response(c: Context, status: number, message: string, data?: any): Response {
    return c.json({ message, data }, { status });
}