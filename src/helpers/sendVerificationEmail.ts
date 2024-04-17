import { resend } from "@/lib/resend";
import VerficationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string
): Promise<ApiResponse> {
    let data;
    try {
        data = await resend.emails.send({
            from: "OTP <onboarding@resend.dev>",
            to: email,
            subject: "Mystery Message | Verification Code",
            react: VerficationEmail({ userName, otp: verifyCode }),
        });

        console.log(data);

        return {
            success: true,
            message: "Verification Email sent successfully",
        };
    } catch (emailError) {
        return {
            success: false,
            message:
                (emailError as Error)?.message ||
                "Error while sending verification email",
        };
    }
}
