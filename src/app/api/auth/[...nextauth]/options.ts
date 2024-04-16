import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDb from "@/lib/connectDb";
import { UserModel } from "@/models/User.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "johndoe@example.com",
                },
                password: {
                    label: "password",
                    type: "password",
                    placeholder: "********",
                },
            },
            async authorize(credentials: any): Promise<any> {
                await connectDb();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { userName: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        throw new Error("Wrong Credentials!");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your email");
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordCorrect) {
                        throw new Error("Wrong credentials!");
                    } else {
                        return user;
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user?._id?.toString();
                token.isVerified = user?.isVerified;
                token.isAcceptingMessages = user?.isAcceptingMessages;
                token.userName = user?.userName;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.isVerified = token.isVerified;
                session.user.userName = token.userName;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET_KEY,
};
