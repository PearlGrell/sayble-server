import { users } from "../database/schema";
import { db } from "../database/database";
import { eq, or } from "drizzle-orm";
import UserModel from "../model/user";
import { Context } from "hono";
import { response, catch_error } from "../helpers/response";
import { validate } from "../helpers/validator";
import { generate_token, verify_token } from "../helpers/json_web_token";

const response_user = (user: any) => {
    const { id, isVerified, isLoggedIn, otp, salt, tempPassword, password, ...user_ } = user;
    return user_;
};

const query_users = async (email: string, username: string) => {
    return db
        .select()
        .from(users)
        .where(or(eq(users.email, email), username ? eq(users.username, username) : undefined))
        .all();
};

export async function createUser(c: Context) {

    try {
        const { email, first_name, last_name, dob, username, image } = await c.req.json();

        const error = validate({ email, first_name, last_name, dob });

        if (error.length > 0) {
            return response(c, 400, "Validation Error", error);
        }

        const existingUsers = await query_users(email, username);

        if (existingUsers.some((user) => user.email === email)) {
            return response(c, 400, `User with email '${email}' already exists`);
        }

        if (username && existingUsers.some((user) => user.username === username)) {
            return response(c, 400, "Username is already in use");
        }

        const newUser = new UserModel({
            email,
            firstName: first_name,
            lastName: last_name,
            dob,
            username,
            image,
        });

        const token = generate_token(newUser.id);

        const result = await db.insert(users).values(newUser).returning();
        if (result.length === 0) {
            return response(c, 500, "Failed to create user");
        }

        return response(c, 201, "User created successfully", { token });
    } catch (error) {
        return catch_error(c, error, 500);
    }
}

export async function getUserByID(c : Context) {
    try {
        const search_id = c.req.param("id");

        const user = await db.select().from(users).where(eq(users.id, search_id)).get();

        if (!user) {
            return response(c, 404, "User not found");
        }

        return response(c, 200, "User Found", response_user(user));
    } catch (error) {
        return catch_error(c, error, 500);
    }
}

export async function getUsers(c : Context) {
    try {
        const user_ = await db.select().from(users).all();

        if (user_.length === 0) {
            return response(c, 404, "No users found");
        }

        const user = user_.map(response_user);

        return response(c, 200, "Users Found", user);
    } catch (error) {
        return catch_error(c, error, 500);
    }
}

export async function loginUser(c: Context) {
    try {
        const { email, password } = await c.req.json();

        const userData = await db.select().from(users).where(eq(users.email, email)).get();

        if (!userData) {
            return response(c, 404, "User not found");
        }

        const user = new UserModel({
            ...userData,
            password: userData.password ?? undefined,
            salt: userData.salt ?? undefined,
            otp: userData.otp ?? undefined,
        });

        if (!(await user.isUserVerified())) {
            return response(c, 400, "User is not verified");
        }

        if (!(await user.verify_password(password))) {
            return response(c, 400, "Invalid password");
        }

        user.isLoggedIn = 1;
        await db.update(users).set({ isLoggedIn: user.isLoggedIn }).where(eq(users.id, user.id)).run();

        return response(c, 200, "User logged in successfully");
    } catch (error) {
        return catch_error(c, error, 500);
    }
}
