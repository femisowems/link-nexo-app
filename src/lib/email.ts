import { Resend } from "resend";
import { render } from "@react-email/render";
import { PasswordResetEmail } from "@/emails/PasswordResetEmail";
import { VerificationEmail } from "@/emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Link Nexo <noreply@email.starterdev.com>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;
    const html = await render(PasswordResetEmail({ resetUrl }));
    return resend.emails.send({
        from: FROM,
        to,
        subject: "Reset your Link Nexo password",
        html,
    });
}

export async function sendVerificationEmail(to: string, token: string) {
    const verifyUrl = `${APP_URL}/verify-email?token=${token}`;
    const html = await render(VerificationEmail({ verifyUrl }));
    return resend.emails.send({
        from: FROM,
        to,
        subject: "Verify your Link Nexo email",
        html,
    });
}

