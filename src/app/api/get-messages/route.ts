import { getServerSession } from "next-auth";
import connectDb from "@/lib/connectDb";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { UserModel } from "@/models/User.model";
import mongoose from "mongoose";

export const GET = async function (request: Request) {
    await connectDb();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized access!",
            },
            {
                status: 400,
            }
        );
    }

    const user: User = session.user as User;
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: "messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "messages" } } },
        ]);
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 500,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: user[0].messages,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Unexpected error occured.",
            },
            {
                status: 500,
            }
        );
    }
};
