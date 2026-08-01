import { Button, Heading, Row, Column, Section, Text } from "@react-email/components";
import { getEmailTranslator, type EmailTranslator } from "@/lib/notifications/templates/email/get-email-translator";


import { EmailLayout } from "./layout";
import { normalStyles } from "./styles";

interface PaymentStatusEmailBaseProps {
    t: EmailTranslator;
    locale: string;
    userName: string;
    paymentNumber: string;
    amount: number;
    currency: string;
    projectName: string;
    paymentUrl: string;
}

export type PaymentStatusEmailProps = PaymentStatusEmailBaseProps &
    (
        | { status: "approved" }
        | { status: "rejected"; rejectionReason?: string }
    );

export function PaymentStatusEmail(props: PaymentStatusEmailProps) {
    const { t, locale, userName, paymentNumber, amount, currency, projectName, paymentUrl, status } = props;
    const isApproved = status === "approved";

    return (
        <EmailLayout
            preview={t(isApproved ? "paymentStatus.previewApproved" : "paymentStatus.previewRejected", { number: paymentNumber })}
            locale={locale}
            t={t}
        >
            <Heading style={normalStyles.heading}>
                {t(isApproved ? "paymentStatus.headingApproved" : "paymentStatus.headingRejected")}
            </Heading>

            <Text style={normalStyles.greeting}>
                {t(isApproved ? "paymentStatus.greetingApproved" : "paymentStatus.greetingRejected", { name: userName })}
            </Text>

            <Section style={normalStyles.card}>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("paymentStatus.number")}</Column>
                    <Column style={normalStyles.value}>#{paymentNumber}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("paymentStatus.amount")}</Column>
                    <Column style={normalStyles.value}>{amount}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("paymentStatus.currency")}</Column>
                    <Column style={normalStyles.value}>{currency}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>{t("paymentStatus.project")}</Column>
                    <Column style={normalStyles.value}>{projectName}</Column>
                </Row>
                {!isApproved && props.rejectionReason && (
                    <Row style={normalStyles.row}>
                        <Column style={normalStyles.label}>{t("paymentStatus.rejectionReason")}</Column>
                        <Column style={normalStyles.value}>{props.rejectionReason}</Column>
                    </Row>
                )}
            </Section>

            <Button href={paymentUrl} style={normalStyles.button}>
                {t("paymentStatus.viewPayment")}
            </Button>
        </EmailLayout>
    );
}

export default PaymentStatusEmail;

PaymentStatusEmail.defaultProps = {
    t: await getEmailTranslator("es"),
    locale: "es",
    userName: "Lucas",
    paymentNumber: "0042",
    amount: 1500,
    currency: "USD",
    projectName: "Proyecto Ejemplo",
    paymentUrl: "https://tuapp.com/payments/0042",
    status: "rejected",
    rejectionReason: "El comprobante adjunto no es legible.",
} satisfies PaymentStatusEmailProps;