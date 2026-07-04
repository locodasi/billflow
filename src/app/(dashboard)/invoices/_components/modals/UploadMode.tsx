
import { useState } from "react";

import {useTranslations} from "next-intl";  

import { parseInvoice, createInvoice } from "../../actions";

import {useProjectsStore} from "@/stores/projectStore";

import { InputStylesConfig } from "@/components/inputs/types";
import FileItem, {DetectedCard} from "@/components/File";
import TextInput from "@/components/inputs/TextInput";
import TextArea from "@/components/inputs/Textarea";
import NumberInput from "@/components/inputs/NumberInput";
import FileInput from "@/components/inputs/FileInput";
import NormalSelect from "@/components/Select";
import Button from "@/components/Button";

import { InvoiceSummary } from "@/types/Invoice";

export interface UploadInvoice {
    invoiceNumber: {
        value: string;
        automatic: boolean;
    };
    amount: {
        value: number;
        automatic: boolean;
    };
    currency: {
        value: string;
        automatic: boolean;
    };
    notes: string;
    file: File | null;
    metadata: Record<string, string>;
}

const InitialState: UploadInvoice = {
    invoiceNumber: {
        value: "",
        automatic: false,
    },
    amount: {
        value: 0,
        automatic: false,
    },
    currency: {
        value: "USD",
        automatic: false,
    },
    notes: "",
    file: null,
    metadata: {},
}

import { useCurrencyOptions } from "@/hooks/useCurrencyOptions";
const UploadMode = ({close, addInvoice}: {close: () => void, addInvoice: (invoice: InvoiceSummary) => void}) => {

    const CURRENCIES = useCurrencyOptions();
    const [invoiceData, setInvoiceData] = useState<UploadInvoice>(InitialState);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const projectId = useProjectsStore(s => s.project?.id);

    const t = useTranslations("invoices.upload");

    const getAutoStyle = (automatic: boolean): InputStylesConfig | undefined => {
        if (automatic) {
            return {
                wrapper: { border: "1px solid var(--Components-Buttons-button-brand-bg)" },
                underText: { color: "var(--Components-Buttons-button-brand-bg)" }
            }
        }

        return undefined;
    }

    const hanldeFileSelect = async (files: File[]) => {
        const file = files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const parsedData = await parseInvoice(formData);

            setInvoiceData({
                ...invoiceData,
                invoiceNumber: {
                    value: `INV_${parsedData.invoiceNumber ?? ""}`,
                    automatic: !!parsedData.invoiceNumber,
                },
                amount: {
                    value: parsedData.amount ? parseFloat(parsedData.amount.replace(/,/g, '')) : 0,
                    automatic: !!parsedData.amount,
                },
                currency: {
                    value: parsedData.currency ?? "USD",
                    automatic: !!parsedData.currency,
                },
                file: file,
            });
        } catch (error) {
            console.error("Error al parsear el PDF:", error);
        }
    }

    const saveInvoice = async () => {
        try {
            if (!projectId) throw new Error("Project ID no disponible");

            setIsLoading(true);
            setError(null);
            const invoice = await createInvoice(invoiceData, projectId);
            addInvoice(invoice);
            close();
        } catch (error) {
            console.error("Error al crear la factura:", error);
            setError(error instanceof Error ? error.message : "Error desconocido");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            { invoiceData.file ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <FileItem file={invoiceData.file} remove={() => setInvoiceData({ ...invoiceData, file: null })} />
                    <DetectedCard text={t("pdf.detected")} />
                </div>
            ) : (
                <FileInput onFileSelect={hanldeFileSelect} accept=".pdf" />
            )}

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <TextInput
                    label={t("values.invoice_number")}
                    placeholder={t("values.invoice_number_placeholder")}
                    value={invoiceData.invoiceNumber.value}
                    onChange={(v) => setInvoiceData({ ...invoiceData, invoiceNumber: { automatic: false, value: v } })}
                    styles={getAutoStyle(invoiceData.invoiceNumber.automatic)}
                    underText={invoiceData.invoiceNumber.automatic ? t("values.from_pdf") : ""}
                />
                <NumberInput
                    label={t("values.amount")}
                    placeholder={t("values.amount_placeholder")}
                    value={invoiceData.amount.value}
                    onChange={(v) => setInvoiceData({ ...invoiceData, amount: { automatic: false, value: v } })}
                    styles={getAutoStyle(invoiceData.amount.automatic)}
                    underText={invoiceData.amount.automatic ? t("values.from_pdf") : ""}
                />
            </div>

            <NormalSelect
                title={t("values.currency")}
                placeholder={t("values.currency_placeholder")}
                options={CURRENCIES}
                value={CURRENCIES.find(currency => currency.value === invoiceData.currency.value) || null}
                onChange={(v) => setInvoiceData({ ...invoiceData, currency: { automatic: false, value: v.value } })}
                underText={invoiceData.currency.automatic ? t("values.from_pdf") : ""}
                styles={getAutoStyle(invoiceData.currency.automatic)}

            />

            <TextArea value={invoiceData.notes} onChange={(v) => setInvoiceData({ ...invoiceData, notes: v })} label={t("values.notes")} placeholder={t("values.notes_placeholder")} minLines={5} />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "flex", gap: "0.5rem", alignSelf: "flex-end" }}>
                <Button text={t("buttons.cancel")} onClick={close} size="small"/>
                <Button text={t("buttons.save")} onClick={saveInvoice} type="primary" style="filled" size="small" disabled={!invoiceData.file || isLoading}/>
            </div>
        </div>
    )
}

export default UploadMode;
