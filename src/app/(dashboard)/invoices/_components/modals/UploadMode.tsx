
import { useState } from "react";

// import { analyzeInvoicePdfAction } from "../../actions";

import { InputStylesConfig } from "@/components/inputs/types";

import TextInput from "@/components/inputs/TextInput";
import TextArea from "@/components/inputs/Textarea";
import NumberInput from "@/components/inputs/NumberInput";
import FileInput from "@/components/inputs/FileInput";
import NormalSelect from "@/components/Select";

const CURRENCIES = [
    { value: "USD", label: "Dólar estadounidense (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "Libra esterlina (GBP)" },
    { value: "JPY", label: "Yen japonés (JPY)" },
    { value: "ARS", label: "Peso argentino (ARS)" },
    { value: "BRL", label: "Real brasileño (BRL)" },
    { value: "CAD", label: "Dólar canadiense (CAD)" },
    { value: "CHF", label: "Franco suizo (CHF)" },
];

interface UploadInvoice {
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

const UploadMode = () => {

    const [invoiceData, setInvoiceData] = useState<UploadInvoice>(InitialState);


    const getAutoStyle = (automatic: boolean): InputStylesConfig | undefined => {
        if (automatic) {
            return {
                wrapper: { border: "1px solid var(--Components-Buttons-button-brand-bg)" },
                underText: { color: "var(--Components-Buttons-button-brand-bg)" }
            }
        }

        return undefined;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <FileInput onFileSelect={()=>{}} accept=".pdf" />

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <TextInput
                    label="Número de factura"
                    placeholder="Ej. 001-001-0000001"
                    value={invoiceData.invoiceNumber.value}
                    onChange={() => { }}
                    styles={getAutoStyle(invoiceData.invoiceNumber.automatic)}
                    underText={invoiceData.invoiceNumber.automatic ? "Detectado del PDF" : ""}
                />
                <NumberInput
                    label="Monto"
                    placeholder="Ej. 1000"
                    value={invoiceData.amount.value}
                    onChange={() => { }}
                    styles={getAutoStyle(invoiceData.amount.automatic)}
                    underText={invoiceData.amount.automatic ? "Detectado del PDF" : ""}
                />
            </div>

            <NormalSelect
                title="Moneda"
                placeholder="Selecciona un proveedor"
                options={CURRENCIES}
                value={CURRENCIES.find(currency => currency.value === invoiceData.currency.value) || null}
                onChange={() => { }}
                underText={invoiceData.currency.automatic ? "Detectado del PDF" : ""}
                styles={getAutoStyle(invoiceData.currency.automatic)}

            />

            <TextArea value={invoiceData.notes} onChange={() => { }} label="Notas" placeholder="Opcional" minLines={5} />

            <div style={{ display: "flex", gap: "0.5rem" }}></div>
        </div>
    )
}

export default UploadMode;

import * as pdfjsLib from "pdfjs-dist"
