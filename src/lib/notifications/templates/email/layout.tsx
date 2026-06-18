// src/lib/notifications/templates/email/layout.tsx

import {
    Body,
    Container,
    Head,
    Html,
    Img,
    Hr,
    Text,
    Preview,
} from "@react-email/components";

interface EmailLayoutProps {
    preview: string;       // Texto que aparece en el inbox antes de abrir el email
    children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
    return (
        <Html lang="es">
            <Head />
            <Preview>{preview}</Preview>
            <Body style={styles.body}>
                <Container style={styles.container}>

                    {/* Header */}
                    {/* <Img
                        src="https://tuapp.com/logo.png"
                        alt="TuApp"
                        height={40}
                        style={styles.logo}
                    /> */}
                    <Hr style={styles.divider} />

                    {/* Contenido del template */}
                    <Container style={{ padding: "0 24px" }}>
                        {children}
                    </Container>

                    {/* Footer */}
                    <Hr style={styles.divider} />
                    <Text style={styles.footer}>
                        © 2025 Billflow. Todos los derechos reservados.
                    </Text>

                </Container>
            </Body>
        </Html>
    );
}

const styles = {
    body: {
        backgroundColor: "#f4f4f4",
        fontFamily: "sans-serif",
    },
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        padding: "0",
        borderRadius: "8px",
    },
    logo: {
        marginBottom: "16px",
    },
    divider: {
        borderColor: "#e5e5e5",
        margin: "24px 0",
    },
    footer: {
        fontSize: "12px",
        color: "#999999",
        textAlign: "center" as const,
    },
};