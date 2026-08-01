import serverEnv from "@/lib/env.server";

import { getEmailTranslator, type EmailTranslator } from "@/lib/notifications/templates/email/get-email-translator";

import { EmailPayload } from "../../types";
import { renderEmail } from "./renderer";
import InvoiceUploadedEmail from "./invoice-uploaded.email";

interface EmailRecipient {
    name: string;
    email: string;
}

interface InvoiceUploadedParams {
    locale: string;
    recipient: EmailRecipient
    invoiceNumber: string;
    amount: number;
    currency: string;
    invoiceId: string;
    projectName: string;
}

export async function invoiceUploadedEmailTemplate(
    params: InvoiceUploadedParams
): Promise<EmailPayload> {
    const t = await getEmailTranslator(params.locale);

    return renderEmail({
        recipient: params.recipient,
        subject: t("invoiceUploaded.subject"),
        component: (
            <InvoiceUploadedEmail
                t={t}
                locale={params.locale}
                userName={params.recipient.name}
                invoiceNumber={params.invoiceNumber}
                amount={params.amount}
                currency={params.currency}
                invoiceUrl={`${serverEnv.APP_URL}/invoices/${params.invoiceId}`}
                projectName={params.projectName}
            />
        ),
    });
}

import PaymentUploadedEmail from "./payment-uploaded.email";

interface PaymentUploadedParams {
    locale: string;
    recipient: EmailRecipient
    paymentNumber: string;
    amount: number;
    currency: string;
    paymentId: string;
    projectName: string;
}

export async function paymentsUploadedEmailTemplate(
    params: PaymentUploadedParams
): Promise<EmailPayload> {
    const t = await getEmailTranslator(params.locale);

    return renderEmail({
        recipient: params.recipient,
        subject: t("paymentUploaded.subject"),
        component: (
            <PaymentUploadedEmail
                t={t}
                locale={params.locale}
                userName={params.recipient.name}
                paymentNumber={params.paymentNumber}
                amount={params.amount}
                currency={params.currency}
                paymentUrl={`${serverEnv.APP_URL}/payments/${params.paymentId}`}
                projectName={params.projectName}
            />
        ),
    });
}

import SetPasswordEmail from "./set-password.email";

interface SetPasswordParams {
    locale: string;
    recipient: EmailRecipient
    isNewAccount: boolean;
    link: string;
}

export async function setPasswordEmailTemplate(
    params: SetPasswordParams
): Promise<EmailPayload> {
    const t = await getEmailTranslator(params.locale);

    return renderEmail({
        recipient: params.recipient,
        subject: params.isNewAccount
            ? t("setPassword.subjectNewAccount")
            : t("setPassword.subjectReset"),
        component: (
            <SetPasswordEmail
                t={t}
                locale={params.locale}
                userName={params.recipient.name}
                isNewAccount={params.isNewAccount}
                link={params.link}
            />
        ),
    });
}

import PaymentStatusEmail from "./payment-status-email";

type PaymentStatusParams = {
    recipient: EmailRecipient;
    locale: string;
    paymentNumber: string;
    amount: number;
    currency: string;
    projectName: string;
    paymentId: string;
} & (
        | { status: "approved" }
        | { status: "rejected"; rejectionReason?: string }
    );

export async function paymentStatusEmailTemplate(
    params: PaymentStatusParams
): Promise<EmailPayload> {
    const t = await getEmailTranslator(params.locale);
    const isApproved = params.status === "approved";

    return renderEmail({
        recipient: params.recipient,
        subject: t(isApproved ? "paymentStatus.subjectApproved" : "paymentStatus.subjectRejected"),
        component: (
            <PaymentStatusEmail
                t={t}
                locale={params.locale}
                userName={params.recipient.name}
                paymentNumber={params.paymentNumber}
                amount={params.amount}
                currency={params.currency}
                projectName={params.projectName}
                paymentUrl={`${serverEnv.APP_URL}/payments/${params.paymentId}`}
                {...(isApproved ? { status: "approved" } : { status: "rejected", rejectionReason: params.rejectionReason })}
            />
        ),
    });
}