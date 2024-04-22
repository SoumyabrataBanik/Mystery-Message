import connectDb from "@/lib/connectDb";
import { UserModel } from "@/models/User.model";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
    userName: userNameValidation,
});

export async function GET(request: Request) {
    await connectDb();

    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            userName: searchParams.get("userName"),
        };

        // Validate with zod
        const result = UserNameQuerySchema.safeParse(queryParam);

        if (!result.success) {
            const userNameErrors =
                result.error.format().userName?._errors || [];

            return Response.json(
                {
                    success: false,
                    message:
                        userNameErrors.length > 0
                            ? userNameErrors.join(", ")
                            : "Invalid query parameters",
                },
                {
                    status: 400,
                }
            );
        }

        const { userName } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            userName,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {
                    status: 400,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Username is unique",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error while checking username",
            },
            {
                status: 500,
            }
        );
    }
}
