import styled from "styled-components";

import Button from "@/components/Button";

const Footer = ({ onClose, onSave, enableSave }: { onClose: () => void, onSave: () => void, enableSave: boolean }) => {

    return (
        <FooterWraper>
            <Button text="Cancelar" onClick={onClose} size="small" />
            <Button text="Guardar" onClick={onSave} type="primary" style="filled" size="small" disabled={!enableSave} />
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