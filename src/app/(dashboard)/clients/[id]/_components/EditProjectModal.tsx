// src/app/(dashboard)/clients/[id]/_components/EditProjectModal.tsx
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
import { updateProjectAction } from "../actions";


type EditProjectModalProps = {
    project_id: string;
    name: string;
    currency: string;
    bill_address: string | null;
    onClose: () => void;
    onUpdate: (project_id: string, projectUpdated: Partial<Project>) => void;
}

const CURRENCIES: Option[] = [
    { value: "USD", label: "Dólar estadounidense (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "ARS", label: "Peso argentino (ARS)" },
    { value: "GBP", label: "Libra esterlina (GBP)" },
    { value: "BRL", label: "Real brasileño (BRL)" },
    { value: "UYU", label: "Peso uruguayo (UYU)" },
];

const EditProjectModal = ({ project_id, name, currency, bill_address, onClose, onUpdate }: EditProjectModalProps) => {
    const [nameState, setName] = useState(name);
    const [currencyState, setCurrency] = useState(currency);
    const [billAddress, setBillAddress] = useState(bill_address || "");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateProject = useProjectsStore(state => state.updateProject);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const result = await updateProjectAction(project_id, nameState, currencyState, billAddress);

        console.log("Result:", result);
        if (!result.success) {
            setErrors({ [result.error.field]: result.error.message });
            setLoading(false);
            return;
        }

        updateProject(project_id, { name: nameState, currency: currencyState, bill_address: billAddress });
        onUpdate(project_id, { name: nameState, currency: currencyState, bill_address: billAddress });
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <WrapperModal>
                <HeaderModal title="Editar proyecto" onClose={onClose} />

                <form onSubmit={handleSubmit}>
                    <Fields>
                        <TextInput
                            label="Nombre"
                            value={nameState}
                            onChange={setName}
                            placeholder="Plataforma web"
                            error={errors.name}
                        />

                        <NormalSelect
                            title="Moneda"
                            options={CURRENCIES}
                            value={CURRENCIES.find(c => c.value === currencyState) || null}
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
                            <Button text="Editar proyecto" buttonType="submit" disabled={loading} onClick={handleSubmit} />
                        </div>
                        {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
                    </Fields>

                </form>
            </WrapperModal>
        </Modal>
    );
}

export default EditProjectModal;

const Fields = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;