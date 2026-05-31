import { useState } from "react";

import { createClient_action } from "@/app/(dashboard)/clients/actions";

import Modal, { HeaderModal, WrapperModal } from "@/components/modals/Modal";

import TextInput from "@/components/inputs/TextInput";
import Button from "@/components/Button";
import NormalSelect, {Option} from "@/components/Select";

import { Client } from "../_types/types";

const LANGUAGE_OPTIONS: Option[] = [
    { value: "es", label: "Español" },
    { value: "en", label: "Inglés" },
];

const NewClientModal = ({ onClose, addClient }: { onClose: () => void, addClient: (client: Client) => void }) => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [language, setLanguage] = useState("es");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!name || !email || !language) {
                setError("Todos los campos son obligatorios");
                return;
            }

            const response = await createClient_action(name, email, language);
            if (!response.success) {
                setError(response.error.message);
                return;
            }
            addClient({
                client_id: response.data.id,
                name,
                email,
                project_count: 0,
                total_invoiced: 0,
                total_paid: 0,
                total_pending: 0,
            });
            
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al crear cliente");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal onClose={onClose}>
            <WrapperModal>
                <HeaderModal title="Nuevo cliente" onClose={onClose} />

                <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                    <TextInput label="Nombre" value={name} onChange={setName} />
                    <TextInput label="Email" value={email} onChange={setEmail} />
                    {/* selector de idioma */}

                    <NormalSelect 
                        title="Idioma"
                        options={LANGUAGE_OPTIONS}
                        value={LANGUAGE_OPTIONS.find(option => option.value === language) || null}
                        onChange={(selectedOption) => setLanguage(selectedOption.value)}
                        placeholder="Selecciona un idioma"
                    />
                    

                    <div style={{display: "flex", gap: "0.5rem", justifyContent: "flex-end"}}>
                        <Button text="Cancelar" onClick={onClose}/>
                        <Button text="Crear cliente" buttonType="submit" disabled={loading} onClick={handleSubmit}/>
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </form>
            </WrapperModal>
        </Modal>
    )
}

export default NewClientModal;