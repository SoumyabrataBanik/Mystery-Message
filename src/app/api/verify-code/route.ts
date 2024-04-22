import connectDb from "@/lib/connectDb";
import { UserModel } from "@/models/User.model";

export async function POST(request: Request) {
    await connectDb();

    try {
        const { userName, code } = await request.json();

        const decodedUsername = decodeURIComponent(userName);
        const user = await UserModel.findOne({ userName: decodedUsername });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User Not found",
                },
                {
                    status: 500,
                }
            );
        }

        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code expired",
                },
                {
                    status: 400,
                }
            );
        }
        const isCodeValid = user.verifyCode === code;
        if (!isCodeValid) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code did not match",
                },
                {
                    status: 400,
                }
            );
        }

        user.isVerified = true;
        await user.save();

        return Response.json(
            {
                success: true,
                message: "User verified successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error verifying code",
            },
            {
                status: 500,
            }
        );
    }
}
