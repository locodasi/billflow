import {
    Button,
    Heading,
    Row,
    Column,
    Section,
    Text,
} from "@react-email/components";

import { getEmailTranslator, type EmailTranslator } from "@/lib/notifications/templates/email/get-email-translator";

import { EmailLayout } from "./layout";
import { normalStyles } from "./styles";

export interface InvoiceUploadedEmailProps {
    t: EmailTranslator;
    locale: string;
    userName: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    projectName: string;
    invoiceUrl: string;
}

export function InvoiceUploadedEmail({
    t,
    locale,
    userName,
    invoiceNumber,
    amount,
    currency,
    projectName,
    invoiceUrl,
}: InvoiceUploadedEmailProps) {
    return (
        <EmailLayout preview={t("invoiceUploaded.preview", { number: invoiceNumber })} locale={locale} t={t}>

            <Heading style={normalStyles.heading}>
                {t("invoiceUploaded.subject")}
            </Heading>

            <Text style={normalStyles.greeting}>
                {t("invoiceUploaded.greeting", { name: userName })}
            </Text>

            {/* Tabla de datos de la factura */}
            <Section style={normalStyles.card}>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("invoiceUploaded.number")}</Column>
                    <Column style={normalStyles.value}>#{invoiceNumber}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("invoiceUploaded.amount")}</Column>
                    <Column style={normalStyles.value}>{amount}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("invoiceUploaded.currency")}</Column>
                    <Column style={normalStyles.value}>{currency}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("invoiceUploaded.project")}</Column>
                    <Column style={normalStyles.value}>{projectName}</Column>
                </Row>
            </Section>

            <Button href={invoiceUrl} style={normalStyles.button}>
                {t("invoiceUploaded.viewInvoice")}
            </Button>

        </EmailLayout>
    );
}

// Necesario para el preview server
export default InvoiceUploadedEmail;

// Preview server: t resuelto de forma sincrónica con el locale por defecto
InvoiceUploadedEmail.defaultProps = {
    t: await getEmailTranslator("es"),
    locale: "es",
    userName: "Lucas",
    invoiceNumber: "0042",
    amount: 1500,
    currency: "USD",
    invoiceUrl: "https://tuapp.com/invoices/0042",
    projectName: "Proyecto Ejemplo",
} satisfies InvoiceUploadedEmailProps;

