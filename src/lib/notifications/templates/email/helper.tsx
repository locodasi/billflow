import serverEnv from "@/lib/env.server";

import { EmailPayload } from "../../types";
import { renderEmail } from "./renderer";
import InvoiceUploadedEmail from "./invoice-uploaded.email";

interface InvoiceUploadedParams {
    recipient: {
        name: string;
        email: string;
    };
    invoiceNumber: string;
    amount: number;
    currency: string;
    invoiceId: string;
    projectName: string;
}

export async function invoiceUploadedEmailTemplate(
    params: InvoiceUploadedParams
): Promise<EmailPayload> {
    return renderEmail({
        recipient: params.recipient,
        subject: `Nueva factura cargada`,
        component: (
            <InvoiceUploadedEmail
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
    recipient: {
        name: string;
        email: string;
    };
    paymentNumber: string;
    amount: number;
    currency: string;
    paymentId: string;
    projectName: string;
}

export async function paymentsUploadedEmailTemplate(
    params: PaymentUploadedParams
): Promise<EmailPayload> {
    return renderEmail({
        recipient: params.recipient,
        subject: `Nuevo recibo cargado`,
        component: (
            <PaymentUploadedEmail
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