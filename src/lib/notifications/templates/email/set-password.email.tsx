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

export interface SetPasswordEmailProps {
    userName: string;
    isNewAccount: boolean; 
    link: string;
}

// Valores por defecto para el preview
export const SetPasswordEmailDefaultProps: SetPasswordEmailProps = {
    userName: "Lucas",
    isNewAccount: false,
    link: "https://tuapp.com/set-password",
};

export function SetPasswordEmail({
    userName,
    isNewAccount,
    link,
}: SetPasswordEmailProps) {

    const body = isNewAccount
        ? "Tu cuenta fue creada. Hacé click en el botón para configurar tu contraseña y empezar a usar la plataforma."
        : "Recibimos una solicitud para restablecer tu contraseña. Hacé click en el botón para crear una nueva.";

    return (
        <EmailLayout preview={isNewAccount ? "Bienvenido a Billflow, configura tu contraseña" : "Restablece tu contraseña en Billflow"}>

            <Heading style={normalStyles.heading}>
                {isNewAccount ? "Bienvenido a Billflow" : "Restablece tu contraseña"}
            </Heading>

            <Text style={normalStyles.greeting}>
                Hola {userName}, {isNewAccount ? "configura tu contraseña para comenzar a usar Billflow" : "puedes restablecer tu contraseña usando el siguiente enlace"}:
            </Text>

            <Text>
                {body}
            </Text> 

            <Button href={link} style={normalStyles.button}>
                {isNewAccount ? "Configurar contraseña" : "Restablecer contraseña"}
            </Button>

        </EmailLayout>
    );
}

// Necesario para el preview server
export default SetPasswordEmail;
SetPasswordEmail.defaultProps = SetPasswordEmailDefaultProps;

