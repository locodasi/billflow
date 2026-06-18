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

export interface InvoiceUploadedEmailProps {
    userName: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    projectName: string;
    invoiceUrl: string;
}

// Valores por defecto para el preview
export const InvoiceUploadedEmailDefaultProps: InvoiceUploadedEmailProps = {
    userName: "Lucas",
    invoiceNumber: "0042",
    amount: 1500,
    currency: "USD",
    invoiceUrl: "https://tuapp.com/invoices/0042",
    projectName: "Proyecto Ejemplo",
};

export function InvoiceUploadedEmail({
    userName,
    invoiceNumber,
    amount,
    currency,
    projectName,
    invoiceUrl,
}: InvoiceUploadedEmailProps) {
    return (
        <EmailLayout preview={`Nueva factura #${invoiceNumber} cargada`}>

            <Heading style={normalStyles.heading}>
                Nueva factura cargada
            </Heading>

            <Text style={normalStyles.greeting}>
                Hola {userName}, se cargó una nueva factura con los siguientes datos:
            </Text>

            {/* Tabla de datos de la factura */}
            <Section style={normalStyles.card}>
                <Row style={normalStyles.row}>
                    <Column style={normalStyles.label}>Número</Column>
                    <Column style={normalStyles.value}>#{invoiceNumber}</Column>
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

            <Button href={invoiceUrl} style={normalStyles.button}>
                Ver factura
            </Button>

        </EmailLayout>
    );
}

// Necesario para el preview server
export default InvoiceUploadedEmail;
InvoiceUploadedEmail.defaultProps = InvoiceUploadedEmailDefaultProps;

