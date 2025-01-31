import { NextFunction, Request, Response } from "express";
import db from "../database";
import { sanitize_user } from "../helper/sanitize_user";
import { response } from "../helper/response";
import UserModel from "../models/userModel";
import * as Token from "../helper/jwt_auth" ;
import { User } from "../types";

export async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  
  await db.user.findMany().then((val) => {
    const users = val.map(sanitize_user);
    if (users.length === 0) {
      return response(res, 404, "Users");
    }
    return response(res, 200, users, "users");
  }).catch(next);
} 

export function getUserById(req: Request, res: Response, next: NextFunction): void {
    const id = req.params.id;
    db.user.findUnique({
        where: { id }
    }).then((val) => {
        if (!val) {
        return response(res, 404, "User");
        }
        return response(res, 200, sanitize_user(val), "user");
    }).catch(next);
}

export async function getUserByToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    next(new Error("Token is required"));
  }
  const id = await Token.token_verify(token!).catch(next);

  await db.user.findUnique({
    where: { id }
  }).then((val) => {
    if (!val) {
      return response(res, 404, "User");
    }
    return response(res, 200, sanitize_user(val), "user");
  }).catch(next);
}

export async function signUpUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { name, email, dob } = req.body;

  if (!name || !email || !dob) {
    next(new Error("Name, email and dob are required"));
  }

  if(RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email) === false){
    next(new Error("Invalid email"));
  }

  if(RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$").test(dob) === false){
    next(new Error("Invalid dob"));
  }

  const user = new UserModel({name, email, dob});

  await db.user.create({
    data: user
  }).then(async (val) => {
    return response(res, 201, await Token.token_create(user.id), "token");
  }).catch((error) => {
    if (error.code === "P2002" && error.meta?.target) {
      const target = error.meta.target as string[];
      if (target.includes("email")) {
        next(new Error("Email is already in use."));
      }
      if (target.includes("username")) {
        next(new Error("Username is already in use."));
      }
    }
    next(error);
  });
}

export async function verifyUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { otp } = req.body;
    if (!token) {
      next(new Error("Token is required"));
    }
    const id = await Token.token_verify(token!);

    const userDatabase = await db.user.findUnique({
      where: { id }
    });
    if (!userDatabase) {
      next(new Error("User not found"));
    }
  
    const user = new UserModel(userDatabase as User);
    if(user.verifyOTP(otp)){
      await db.user.update({
        where: { id },
        data: user.toJSON()
      });
      return response(res, 200, "User verified successfully", "message");
    }
    else{
      return response(res, 400, "Invalid OTP", "message");
    }
  }
  catch(error){
    next(error);
  }
}

export async function resendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      next(new Error("Token is required"));
    }
    const id = await Token.token_verify(token!);

    const userDatabase = await db.user.findUnique({
      where: { id }
    });
    if (!userDatabase) {
      next(new Error("User not found"));
    }
  
    const user = new UserModel(userDatabase as User);

    if(user.isVerified){
      return response(res, 400, "User is already verified", "message");
    }

    user.resendOTP();
    await db.user.update({
      where: { id },
      data: user.toJSON()
    });
    return response(res, 200, "OTP sent successfully", "message");
  }
  catch(error){
    next(error);
  }
}

export async function loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new Error("Email and password are required"));
  }

  if(RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email) === false){
    next(new Error("Invalid email"));
  }

  const userDatabase = await db.user.findUnique({
    where: { email }
  }).catch(next);
  if (!userDatabase) {
    next(new Error("User not found"));
  }

  const user = new UserModel(userDatabase as User);
  if (!user.verifyPassword(password)) {
    next(new Error("Invalid password"));
  }

  user.isLoggedIn = true;
  await db.user.update({
    where: { email },
    data: user.toJSON()
  });

  return response(res, 200, "User logged in successfully", "message");
}

export async function sendPasswordResetEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const email = req.body.email;
    if (!email) {
      next(new Error("Email is required"));
    }

    if(RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email) === false){
      next(new Error("Invalid email"));
    }

    const userDatabase = await db.user.findUnique({
      where: { email }
    }).catch(next);

    if (!userDatabase) {
      next(new Error("User not found"));
    }

    const user = new UserModel(userDatabase as User);
    user.sendPasswordReset().then(async () => {
      await db.user.update({ where: { email }, data: user.toJSON() });
      return response(res, 200, "Password reset email sent successfully", "message");
    }).catch(next);
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.split(" ")[1];
  const { password, otp } = req.body;
  if (!token) {
    next(new Error("Token is required"));
  }
  const id = await Token.token_verify(token!);

  const userDatabase = await db.user.findUnique({
    where: { id }
  }).catch(next);
  if (!userDatabase) {
    next(new Error("User not found"));
  }

  const user = new UserModel(userDatabase as User);
  if (!user.resetPassword(password, otp)) {
    next(new Error("Invalid OTP"));
  }

  await db.user.update({
    where: { id },
    data: user.toJSON()
  }).then(() => {
    return response(res, 200, "Password reset successfully", "message");
  }).catch(next);
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    next(new Error("Token is required"));
  }
  const id = await Token.token_verify(token!).catch(next);
  const { name, image, dob, username } = req.body;

  const userDatabase = await db.user.findUnique({
    where: { id }
  }).catch(next);
  if (!userDatabase) {
    next(new Error("User not found"));
  }

  const user = new UserModel(userDatabase as User);
  
  if(username){
    await db.user.findUnique({
      where: { username }
    }).then((val) => {
      if (val) {
        next(new Error("Username is already in use"));
      }
    }).catch(next);

    user.username = username;
  }

  if (name) {
    user.name = name;
  }
  if (image) {
    user.image = image;
  }
  if (dob) {
    user.dob = dob;
  }

  await db.user.update({
    where: { id },
    data: user.toJSON()
  }).then(() => {
    return response(res, 200, "User updated successfully", "message");
  }).catch(next);
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    next(new Error("Token is required"));
  }
  const id = await Token.token_verify(token!).catch(next);
  await db.user.delete({
    where: { id }
  }).then(() => {
    return response(res, 200, "User deleted successfully", "message");
  }).catch(next);
}