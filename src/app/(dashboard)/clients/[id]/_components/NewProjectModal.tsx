// src/app/(dashboard)/clients/[id]/_components/NewProjectModal.tsx
'use client'

import styled from "styled-components";

import { useState } from "react";

import { useTranslations } from "next-intl";

import {useProjectsStore} from "@/stores/projectStore";

import Modal, { HeaderModal, WrapperModal } from "@/components/modals/Modal";
import TextInput from "@/components/inputs/TextInput";
import NormalSelect, { Option } from "@/components/Select";
import Button from "@/components/Button";
import TextArea from "@/components/inputs/Textarea";

import { useCurrencyOptions } from "@/hooks/useCurrencyOptions";

import { Project } from "../../_types/types";
import { createProjectAction } from "../actions";


type NewProjectModalProps = {
    clientId: string;
    onClose: () => void;
    onCreated: (project: Project) => void;
}

const NewProjectModal = ({ clientId, onClose, onCreated }: NewProjectModalProps) => {
    const t = useTranslations("clients");
    
    const CURRENCIES = useCurrencyOptions();
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
        
        onCreated({...result.data, total_invoiced: 0, total_pending: 0, invoice_count: 0, total_collected: 0});
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <WrapperModal>
                <HeaderModal title={t("project-modal.new.title")} onClose={onClose} />

                <form onSubmit={handleSubmit}>
                    <Fields>
                        <TextInput
                            label={t("project-modal.name-label")}
                            value={name}
                            onChange={setName}
                            placeholder={t("project-modal.name-placeholder")}
                            error={errors.name}
                        />

                        <NormalSelect
                            title={t("project-modal.currency-label")}
                            options={CURRENCIES}
                            value={CURRENCIES.find(c => c.value === currency) || null}
                            onChange={(option) => setCurrency(option.value)}
                        />

                        <TextArea
                            label={t("project-modal.address-label")}
                            value={billAddress}
                            onChange={setBillAddress}
                            placeholder={t("project-modal.address-placeholder")}
                            error={errors.bill_address}
                        />

                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                            <Button text={t("project-modal.cancel-button")} onClick={onClose} />
                            <Button text={t("project-modal.new.button")} buttonType="submit" disabled={loading} onClick={handleSubmit} />
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