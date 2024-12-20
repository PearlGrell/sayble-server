import { Context } from "hono";

export function response(c: Context, status: number, message: string, data?: any): Response {
    return c.json({ message, data }, { status });
}

export function catch_error(c: Context, error: any, status: number) {
    console.error("Error:", error.message);
    return response(c, status, error.message);
}