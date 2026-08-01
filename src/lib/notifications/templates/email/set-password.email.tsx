import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout } from "./layout";
import { normalStyles } from "./styles";
import { getEmailTranslator, type EmailTranslator } from "@/lib/notifications/templates/email/get-email-translator";

export interface SetPasswordEmailProps {
    t: EmailTranslator;
    locale: string;
    userName: string;
    isNewAccount: boolean;
    link: string;
}

export function SetPasswordEmail({
    t,
    locale,
    userName,
    isNewAccount,
    link,
}: SetPasswordEmailProps) {
    const preview = isNewAccount
        ? t("setPassword.previewNewAccount")
        : t("setPassword.previewReset");

    const heading = isNewAccount
        ? t("setPassword.headingNewAccount")
        : t("setPassword.headingReset");

    const greeting = isNewAccount
        ? t("setPassword.greetingNewAccount", { name: userName })
        : t("setPassword.greetingReset", { name: userName });

    const body = isNewAccount
        ? t("setPassword.bodyNewAccount")
        : t("setPassword.bodyReset");

    const buttonLabel = isNewAccount
        ? t("setPassword.buttonNewAccount")
        : t("setPassword.buttonReset");

    return (
        <EmailLayout preview={preview} locale={locale} t={t}>
            <Heading style={normalStyles.heading}>{heading}</Heading>
            <Text style={normalStyles.greeting}>{greeting}</Text>
            <Text>{body}</Text>
            <Button href={link} style={normalStyles.button}>
                {buttonLabel}
            </Button>
        </EmailLayout>
    );
}

export default SetPasswordEmail;

SetPasswordEmail.defaultProps = {
    t: await getEmailTranslator("es"),
    locale: "es",
    userName: "Lucas",
    isNewAccount: false,
    link: "https://tuapp.com/set-password",
} satisfies SetPasswordEmailProps;