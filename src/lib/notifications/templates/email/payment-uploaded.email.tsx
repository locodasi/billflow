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

export interface PaymentUploadedEmailProps {
    t: EmailTranslator;
    locale: string;
    userName: string;
    paymentNumber: string;
    amount: number;
    currency: string;
    paymentUrl: string;
    projectName: string;
}


export function PaymentUploadedEmail({
    t,
    locale,
    userName,
    paymentNumber,
    amount,
    currency,
    projectName,
    paymentUrl,
}: PaymentUploadedEmailProps) {
    return (
        <EmailLayout preview={t("paymentUploaded.preview", { number: paymentNumber })} locale={locale} t={t}>
            <Heading style={normalStyles.heading}>
                {t("paymentUploaded.heading")}
            </Heading>

            <Text style={normalStyles.greeting}>
                {t("paymentUploaded.greeting", { name: userName })}
            </Text>

            <Section style={normalStyles.card}>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("paymentUploaded.number")}</Column>
                    <Column style={normalStyles.value}>#{paymentNumber}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("paymentUploaded.amount")}</Column>
                    <Column style={normalStyles.value}>{amount}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("paymentUploaded.currency")}</Column>
                    <Column style={normalStyles.value}>{currency}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("paymentUploaded.project")}</Column>
                    <Column style={normalStyles.value}>{projectName}</Column>
                </Row>
            </Section>

            <Button href={paymentUrl} style={normalStyles.button}>
                {t("paymentUploaded.viewPayment")}
            </Button>
        </EmailLayout>
    );
}

// Necesario para el preview server
export default PaymentUploadedEmail;

PaymentUploadedEmail.defaultProps = {
    t: await getEmailTranslator("es"),
    locale: "es",
    userName: "Lucas",
    paymentNumber: "0042",
    amount: 1500,
    currency: "USD",
    paymentUrl: "https://tuapp.com/payments/0042",
    projectName: "Proyecto Ejemplo",
} satisfies PaymentUploadedEmailProps;

