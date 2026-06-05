// src/app/(dashboard)/clients/[id]/_components/NewProjectModal.tsx
'use client'

import styled from "styled-components";

import { useState } from "react";

import {useProjectsStore} from "@/stores/projectStore";

import Modal, { HeaderModal, WrapperModal } from "@/components/modals/Modal";
import TextInput from "@/components/inputs/TextInput";
import NormalSelect, { Option } from "@/components/Select";
import Button from "@/components/Button";
import TextArea from "@/components/inputs/Textarea";

import { Project } from "../../_types/types";
import { createProjectAction } from "../actions";


type NewProjectModalProps = {
    clientId: string;
    onClose: () => void;
    onCreated: (project: Project) => void;
}

const CURRENCIES: Option[] = [
    { value: "USD", label: "Dólar estadounidense (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "ARS", label: "Peso argentino (ARS)" },
    { value: "GBP", label: "Libra esterlina (GBP)" },
    { value: "BRL", label: "Real brasileño (BRL)" },
    { value: "UYU", label: "Peso uruguayo (UYU)" },
];

const NewProjectModal = ({ clientId, onClose, onCreated }: NewProjectModalProps) => {
    const [name, setName] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [billAddress, setBillAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const addProject = useProjectsStore(state => state.addProject);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const result = await createProjectAction(clientId, name, currency, billAddress);

        console.log("Create project result:", result);

        if (!result.success) {
            setErrors({ [result.error.field]: result.error.message });
            setLoading(false);
            return;
        }

        addProject({bill_address: result.data.bill_address, client_id: result.data.client_id, currency: result.data.currency, name: result.data.name, id: result.data.project_id});
        
        onCreated({...result.data, total_invoiced: 0, total_pending: 0, total_paid: 0});
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <WrapperModal>
                <HeaderModal title="Nuevo proyecto" onClose={onClose} />

                <form onSubmit={handleSubmit}>
                    <Fields>
                        <TextInput
                            label="Nombre"
                            value={name}
                            onChange={setName}
                            placeholder="Plataforma web"
                            error={errors.name}
                        />

                        <NormalSelect
                            title="Moneda"
                            options={CURRENCIES}
                            value={CURRENCIES.find(c => c.value === currency) || null}
                            onChange={(option) => setCurrency(option.value)}
                        />

                        <TextArea
                            label="Dirección de facturación"
                            value={billAddress}
                            onChange={setBillAddress}
                            placeholder="Av. Corrientes 1234, CABA, Argentina"
                            error={errors.bill_address}
                        />

                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            <Button text="Cancelar" onClick={onClose} />
                            <Button text="Crear proyecto" buttonType="submit" disabled={loading} onClick={handleSubmit} />
                        </div>
                        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}
                    </Fields>

                </form>
            </WrapperModal>
        </Modal>
    );
}

export default NewProjectModal;

const Fields = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;


const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
`;