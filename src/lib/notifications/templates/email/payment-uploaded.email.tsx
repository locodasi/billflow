import {
    Button,
    Heading,
    Row,
    Column,
    Section,
    Text,
} from "@react-email/components";
import { EmailLayout } from "./layout";
import { normalStyles } from "./styles";

export interface PaymentUploadedEmailProps {
    userName: string;
    paymentNumber: string;
    amount: number;
    currency: string;
    paymentUrl: string;
    projectName: string;
}

// Valores por defecto para el preview
export const PaymentUploadedEmailDefaultProps: PaymentUploadedEmailProps = {
    userName: "Lucas",
    paymentNumber: "0042",
    amount: 1500,
    currency: "USD",
    paymentUrl: "https://tuapp.com/payments/0042",
    projectName: "Proyecto Ejemplo",
};

export function PaymentUploadedEmail({
    userName,
    paymentNumber,
    amount,
    currency,
    projectName,
    paymentUrl,
}: PaymentUploadedEmailProps) {
    return (
        <EmailLayout preview={`Nuevo recibo #${paymentNumber} cargado`}>

            <Heading style={normalStyles.heading}>
                Nuevo recibo cargado
            </Heading>

            <Text style={normalStyles.greeting}>
                Hola {userName}, se cargó un nuevo recibo con los siguientes datos:
            </Text>

            {/* Tabla de datos del recibo */}
            <Section style={normalStyles.card}>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>Número</Column>
                    <Column style={normalStyles.value}>#{paymentNumber}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>Monto</Column>
                    <Column style={normalStyles.value}>{amount}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>Moneda</Column>
                    <Column style={normalStyles.value}>{currency}</Column>
                </Row>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>Projecto</Column>
                    <Column style={normalStyles.value}>{projectName}</Column>
                </Row>
            </Section>

            <Button href={paymentUrl} style={normalStyles.button}>
                Ver recibo
            </Button>

        </EmailLayout>
    );
}

// Necesario para el preview server
export default PaymentUploadedEmail;
PaymentUploadedEmail.defaultProps = PaymentUploadedEmailDefaultProps;

