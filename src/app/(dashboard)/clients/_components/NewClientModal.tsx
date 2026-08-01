
import {useTranslations} from "next-intl";

import { useState } from "react";

import { createClient_action } from "@/app/(dashboard)/clients/actions";

import Modal, { HeaderModal, WrapperModal } from "@/components/modals/Modal";

import TextInput from "@/components/inputs/TextInput";
import Button from "@/components/Button";
import NormalSelect, {Option} from "@/components/Select";

import { useLanguageOptions } from "@/hooks/useLanguagesOptions";

import { Client } from "../_types/types";


const NewClientModal = ({ onClose, addClient }: { onClose: () => void, addClient: (client: Client) => void }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [language, setLanguage] = useState("es");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const LANGUAGE_OPTIONS = useLanguageOptions();

    const t = useTranslations("clients.new-client-modal");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!name || !email || !language) {
                setError(t("errors.required-all"));
                return;
            }

            const response = await createClient_action(name, email, language);
            if (!response.success) {
                setError(t("errors.error", { error: response.error.message }));
                return;
            }
            addClient({
                client_id: response.data.id,
                name,
                email,
                project_count: 0,
                invoice_count: 0,
                total_invoiced_usd: 0,
            });
            
            onClose();
        } catch (err) {
            setError(err instanceof Error ? t("errors.error", { error: err.message }) : t("errors.error", { error: "Error al crear cliente" }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <WrapperModal>
                <HeaderModal title={t("title")} onClose={onClose} />

                <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                    <TextInput label={t("name-label")} value={name} onChange={setName} placeholder={t("name-placeholder")}/>
                    <TextInput label={t("email-label")} value={email} onChange={setEmail} placeholder={t("email-placeholder")} />
                    {/* selector de idioma */}

                    <NormalSelect 
                        title={t("language-label")}
                        options={LANGUAGE_OPTIONS}
                        value={LANGUAGE_OPTIONS.find(option => option.value === language) || null}
                        onChange={(selectedOption) => setLanguage(selectedOption.value)}
                    />
                    

                    <div style={{display: "flex", gap: "0.5rem", justifyContent: "flex-end"}}>
                        <Button text={t("cancel-button")} onClick={onClose}/>
                        <Button text={t("create-button")} buttonType="submit" disabled={loading} onClick={handleSubmit}/>
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </WrapperModal>
        </Modal>
    )
}

export default NewClientModal;