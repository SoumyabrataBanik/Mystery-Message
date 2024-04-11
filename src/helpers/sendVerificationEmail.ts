import { resend } from "@/lib/resend";
import VerficationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Mystery Message | Verification Code",
            react: VerficationEmail({ userName, otp: verifyCode }),
        });

        return {
            success: true,
            message: "Verification Email sent successfully",
        };
    } catch (emailError) {
        console.error("Error while sending email!", emailError);
        return {
            success: false,
            message:
                (emailError as Error)?.message ||
                "Error while sending verification email",
        };
    }
}
