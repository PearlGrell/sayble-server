import { users } from "../database/schema";
import { db } from "../database/database";
import { eq } from "drizzle-orm";
import UserModel from "../model/user";
import { Context } from "hono";
import { response } from "../helpers/response";

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export async function createUser(c: Context) {
    try {
        const { email, first_name, last_name, dob, username, image } = await c.req.json();
        
        if (!email || !first_name || !last_name || !dob) {
            return response(c, 400, "Missing required fields");
        }

        if (!isValidEmail(email)) {
            return response(c, 400, "Invalid email address");
        }

        const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
        if (existingUser) {
            return response(c, 400, `User with email '${email}' already exists`);
        }

        const newUser = new UserModel({
            email,
            firstName: first_name,
            lastName: last_name,
            dob,
            username,
            image,
        });

        const result = await db.insert(users).values(newUser).returning();
        if (result.length === 0) {
            return response(c, 500, "Failed to create user");
        }

        return response(c, 201, "User created successfully");
    } catch (error) {
        console.error("Error creating user:", error);
        return response(c, 500, "An error occurred while creating the user");
    }
}

export async function getUserByID(c: Context) {
    try {
        const search_id = c.req.param('id');

        if (!search_id) {
            return response(c, 400, "Missing required fields");
        }

        const user = await db.select().from(users).where(eq(users.id, search_id)).get();

        if (!user) {
            return response(c, 404, "User not found");
        }

        const { id, isVerified, isLoggedIn, otp, salt, tempPassword, password, ...userData } = user;

        return response(c, 200, 'User Found',userData);  
    } catch (error) {
        console.error("Error getting current user:", error);
        return response(c, 500, "An error occurred while getting the user");
    }
}