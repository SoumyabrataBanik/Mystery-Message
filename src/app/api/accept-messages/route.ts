import { getServerSession } from "next-auth";
import connectDb from "@/lib/connectDb";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { UserModel } from "@/models/User.model";

export async function POST(request: Request) {
    await connectDb();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized entry",
            },
            {
                status: 400,
            }
        );
    }

    const user: User = session.user as User;

    const userId = user._id;

    const { acceptMessages } = await request.json();

    try {
        const updateUserAcceptingMessages = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessages,
            },
            {
                new: true,
            }
        );

        if (!updateUserAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept messages",
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Successfully updated User accepting messages",
                updateUserAcceptingMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages",
            },
            {
                status: 500,
            }
        );
    }
}

export const GET = async function (request: Request) {
    await connectDb();

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized access!",
            },
            {
                status: 401,
            }
        );
    }

    const user: User = session.user as User;

    try {
        const foundUser = await UserModel.findById(user._id);

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User is accepting message",
                isAcceptingMessages: foundUser.isAcceptingMessage,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                error: error,
                message: "Failed to get user accepting messages",
            },
            {
                status: 500,
            }
        );
    }
};
