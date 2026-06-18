import nodemailer from "nodemailer";

import type { EmailPayload, NotificationResult } from "../types";
import { BaseNotificationStrategy } from "./base.strategy";

export class EmailStrategy extends BaseNotificationStrategy<EmailPayload> {
    readonly channel = "email" as const;

    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    async send(payload: EmailPayload): Promise<NotificationResult> {
        try {
            const info = await this.transporter.sendMail({
                from: `"Billflow" <${process.env.GMAIL_USER}>`,
                to: payload.recipient.email,
                subject: payload.subject,
                html: payload.body,
            });

            return { success: true, channel: "email", messageId: info.messageId };
        } catch (err) {
            return {
                success: false,
                channel: "email",
                error: err instanceof Error ? err.message : "Unknown error",
            };
        }
    }
}