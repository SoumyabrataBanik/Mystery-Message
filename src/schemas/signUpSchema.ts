import { z } from "zod";

export const userNameValidation = z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(20, "Username must not be longer than 20 characters")
    .regex(/^[a-zA-z0-9_]+$/, "Username must not contain special characters");

export const emailValidation = z
    .string()
    .email({ message: "Invalid email address" });

export const passwordValidation = z
    .string()
    .min(8, "Password must be atleast 8 characters long");

export const signUpSchema = z.object({
    userName: userNameValidation,
    email: emailValidation,
    password: passwordValidation,
});
