import connectDb from "@/lib/connectDb";
import { UserModel } from "@/models/User.model";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request): Promise<Response> {
    await connectDb();

    try {
        const { userName, email, password } = await request.json();

        if (
            !userName ||
            !email ||
            !password ||
            userName.trim() === "" ||
            email.trim() === "" ||
            password.trim() === ""
        ) {
            return Response.json({
                success: false,
                message: "All fields are required!",
            });
        }

        const existingUserVerifiedByUsername = await UserModel.findOne({
            userName,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            console.error("User already exists.");
            return Response.json(
                {
                    success: false,
                    message: "User already exists",
                },
                {
                    status: 400,
                }
            );
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({
            email,
            isVerified: true,
        });

        const verifyCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists",
                    },
                    {
                        status: 500,
                    }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );
                await existingUserVerifiedByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                userName,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        console.log("new user found");
        // Send Verification Email
        const verificationEmail = await sendVerificationEmail(
            email,
            userName,
            verifyCode
        );

        if (!verificationEmail.success) {
            return Response.json(
                {
                    success: false,
                    message: verificationEmail.message,
                },
                {
                    status: 500,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User Verification mail sent",
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Error while registering user.", error);
        return Response.json(
            {
                success: false,
                message: "Error while registering user",
            },
            {
                status: 500,
            }
        );
    }
}
