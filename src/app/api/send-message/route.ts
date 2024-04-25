import { UserModel } from "@/models/User.model";
import connectDb from "@/lib/connectDb";
import { MessageModel } from "@/models/User.model";
import { IMessage } from "@/models/User.model";

export const POST = async function (request: Request) {
    await connectDb();

    const { userName, content } = await request.json();

    try {
        const user = await UserModel.findOne({ userName });

        if (!user) {
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

        // Is user accepting messages?
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages",
                },
                {
                    status: 401,
                }
            );
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as IMessage);
        const message = await MessageModel.create(newMessage); // TODO: If problems arise, delete. Added by me.
        await user.save();
        await message.save(); // TODO: If problems arise, delete. Added By Me.

        return Response.json(
            {
                success: true,
                message: "Message sent successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: true,
                message: "Message could not be sent",
            },
            {
                status: 500,
            }
        );
    }
};
