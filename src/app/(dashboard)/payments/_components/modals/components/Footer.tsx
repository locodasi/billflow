import styled from "styled-components";

import { useTranslations } from "next-intl";

import Button from "@/components/Button";

const Footer = ({ onClose, onSave, enableSave }: { onClose: () => void, onSave: () => void, enableSave: boolean }) => {

    const t = useTranslations('payments.upload.buttons');

    return (
        <FooterWraper>
            <Button text={t('cancel')} onClick={onClose} size="small" />
            <Button text={t('save')} onClick={onSave} type="primary" style="filled" size="small" disabled={!enableSave} />
        </FooterWraper>
    )
}

export default Footer;

const FooterWraper = styled.div`
    padding: 1rem;
    border-top: 1px solid var(--Border-Colors-border-primary);
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
`;