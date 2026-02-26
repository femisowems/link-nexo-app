import * as React from "react";

interface Props {
    verifyUrl: string;
}

export function VerificationEmail({ verifyUrl }: Props) {
    return (
        <html>
            <body style={{ fontFamily: "Inter, Arial, sans-serif", background: "#f8fafc", margin: 0, padding: 0 }}>
                <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: "#f8fafc", padding: "40px 0" }}>
                    <tr>
                        <td align="center">
                            <table width="480" cellPadding={0} cellSpacing={0} style={{ background: "#ffffff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                                {/* Header */}
                                <tr>
                                    <td style={{ background: "#0f172a", padding: "28px 40px", textAlign: "center" }}>
                                        <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px" }}>
                                            🔗 Link Nexo
                                        </span>
                                    </td>
                                </tr>
                                {/* Body */}
                                <tr>
                                    <td style={{ padding: "40px 40px 32px" }}>
                                        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 12px" }}>
                                            Verify your email
                                        </h1>
                                        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.6, margin: "0 0 28px" }}>
                                            Welcome to Link Nexo! Click the button below to confirm your email address and activate your account. This link expires in <strong>24 hours</strong>.
                                        </p>
                                        <a
                                            href={verifyUrl}
                                            style={{
                                                display: "inline-block",
                                                background: "#0f172a",
                                                color: "#ffffff",
                                                padding: "14px 28px",
                                                borderRadius: 10,
                                                fontSize: 15,
                                                fontWeight: 600,
                                                textDecoration: "none",
                                            }}
                                        >
                                            Verify Email →
                                        </a>
                                        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 28, lineHeight: 1.5 }}>
                                            If you didn&apos;t create a Link Nexo account, you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>
                                {/* Footer */}
                                <tr>
                                    <td style={{ background: "#f1f5f9", padding: "16px 40px", textAlign: "center" }}>
                                        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                                            Link Nexo · or copy this link: <br />
                                            <span style={{ wordBreak: "break-all", color: "#64748b" }}>{verifyUrl}</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    );
}
