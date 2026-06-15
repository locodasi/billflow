
import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";

import { parsePayment, createPayload } from "../../actions";

import { useProjectsStore } from "@/stores/projectStore";

import { InputStylesConfig } from "@/components/inputs/types";
import FileItem, { DetectedCard } from "@/components/File";
import TextInput from "@/components/inputs/TextInput";
import TextArea from "@/components/inputs/Textarea";
import NumberInput from "@/components/inputs/NumberInput";
import FileInput from "@/components/inputs/FileInput";
import NormalSelect from "@/components/Select";
import Icon from "@/components/icons/Icon";

import { Payment } from "@/types/payment";

import { NewPaymentMode } from "./NewPaymentModal";

import Footer from "./components/Footer";
import MiddleArea from "./components/MiddleArea";
import SelectMode from "./components/SelectMode";
import InvoicesToPaid from "./components/InvoicesToPaid";

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

export interface UploadPayload {
    paymentNumber: {
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
    payment_method: string;
    invoicesToPay: InvoiceSummary[];
}

const InitialState: UploadPayload = {
    paymentNumber: {
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
    payment_method: "manual",
    invoicesToPay: [],
}

const InvoicesTotal = (invoices: InvoiceSummary[]) => {
    return invoices.reduce((total, invoice) => total + invoice.outstanding_amount, 0);
}

export interface UploadModeProps {
    close: () => void;
    addPayment: (payment: Payment) => void;
    mode: NewPaymentMode;
    setMode: (mode: NewPaymentMode) => void;
}
const UploadMode = ({ close, addPayment, mode, setMode }: UploadModeProps) => {

    const [paymentData, setPaymentData] = useState<UploadPayload>(InitialState);

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const projectId = useProjectsStore(s => s.project?.id);

    useEffect(() => {
        const fechLastInvoiceNumber = async () => {
            const { data, error } = await supabase
                .from('payments')
                .select('payment_number')
                .eq('project_id', projectId)
                .order('payment_number', { ascending: false })
                .range(0, 1)

            if (error) return

            let paymentNumber = "PAY_0001";

            if (data && data.length > 0) {
                paymentNumber = `PAY_${String(parseInt(data[0].payment_number.replace("PAY_", "")) + 1).padStart(4, "0")}`;
            }

            setPaymentData(prev => ({
                ...prev,
                paymentNumber: {
                    value: paymentNumber,
                    automatic: false,
                }
            }));
        }

        fechLastInvoiceNumber();
    }, [projectId])

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
            const parsedData = await parsePayment(formData);

            // console.log("Datos parseados del PDF:", parsedData);

            setPaymentData({
                ...paymentData,
                paymentNumber: {
                    value: parsedData.paymentNumber ? `PAY_${parsedData.paymentNumber}` : paymentData.paymentNumber.value,
                    automatic: !!parsedData.paymentNumber,
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

    const savePayment = async () => {
        try {
            if (!projectId) throw new Error("Project ID no disponible");

            setIsLoading(true);
            setError(null);
            const payment = await createPayload(paymentData, projectId);
            addPayment(payment);
            close();
        } catch (error) {
            console.error("Error al crear el pago:", error);
            setError(error instanceof Error ? error.message : "Error desconocido");
        } finally {
            setIsLoading(false);
        }
    }

    const onSelectInvoice = (invoice: InvoiceSummary) => {
        const isSelected = paymentData.invoicesToPay.some(inv => inv.id === invoice.id);
        if (isSelected) {
            setPaymentData({
                ...paymentData,
                invoicesToPay: paymentData.invoicesToPay.filter(inv => inv.id !== invoice.id)
            });
        } else {
            setPaymentData({
                ...paymentData,
                invoicesToPay: [...paymentData.invoicesToPay, invoice]
            });
        }
    }

    return (
        <>

            <MiddleArea>

                <>
                    <SelectMode mode={mode} setMode={setMode} />

                    {paymentData.file ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <FileItem file={paymentData.file} remove={() => setPaymentData({ ...paymentData, file: null })} />
                            <DetectedCard text="Datos detectados automaticamente. Revisa y corrige si es necesario." />
                        </div>
                    ) : (
                        <FileInput onFileSelect={hanldeFileSelect} accept=".pdf" />
                    )}

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <TextInput
                            label="Número de pago"
                            placeholder="Ej. PAY_001-001-0000001"
                            value={paymentData.paymentNumber.value}
                            onChange={(v) => setPaymentData({ ...paymentData, paymentNumber: { automatic: false, value: v } })}
                            styles={getAutoStyle(paymentData.paymentNumber.automatic)}
                            underText={paymentData.paymentNumber.automatic ? "Detectado del PDF" : ""}
                        />
                        <NumberInput
                            label="Monto"
                            placeholder="Ej. 1000"
                            value={paymentData.amount.value}
                            onChange={(v) => setPaymentData({ ...paymentData, amount: { automatic: false, value: v } })}
                            styles={getAutoStyle(paymentData.amount.automatic)}
                            underText={paymentData.amount.automatic ? "Detectado del PDF" : ""}
                        />
                    </div>

                    <NormalSelect
                        title="Moneda"
                        placeholder="Selecciona un proveedor"
                        options={CURRENCIES}
                        value={CURRENCIES.find(currency => currency.value === paymentData.currency.value) || null}
                        onChange={(v) => setPaymentData({ ...paymentData, currency: { automatic: false, value: v.value } })}
                        underText={paymentData.currency.automatic ? "Detectado del PDF" : ""}
                        styles={getAutoStyle(paymentData.currency.automatic)}

                    />

                    <TextArea value={paymentData.notes} onChange={(v) => setPaymentData({ ...paymentData, notes: v })} label="Notas" placeholder="Opcional" minLines={5} maxLines={10} />

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </>

                <>
                    <InvoicesToPaid invoicesSelected={paymentData.invoicesToPay.map(invoice => invoice.id)} onSelectInvoice={onSelectInvoice} />

                    <InfoText />

                    <Area>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Info>Monto del recibo</Info>
                            <Info style={{ fontWeight: "bold", color: "var(--Text-text-primary)" }}>{paymentData.amount.value} {paymentData.currency.value}</Info>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Info>Facturas seleccionadas </Info>
                            <Info style={{ fontWeight: "bold", color: "var(--Text-text-primary)" }}>
                                {paymentData.invoicesToPay.length} - {InvoicesTotal(paymentData.invoicesToPay)} {paymentData.invoicesToPay[0]?.currency || paymentData.currency.value}
                            </Info>
                        </div>

                        <Line />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Info>Diferencia</Info>
                            <Info style={{ fontWeight: "bold", color: InvoicesTotal(paymentData.invoicesToPay) > paymentData.amount.value ? "var(--Error-700)" : "var(--Success-700)" }}>
                                {paymentData.amount.value - InvoicesTotal(paymentData.invoicesToPay)} {paymentData.currency.value}
                            </Info>
                        </div>
                    </Area>
                </>

            </MiddleArea>

            <Footer onClose={close} onSave={savePayment} enableSave={!!paymentData.file && paymentData.invoicesToPay.length > 0 && !isLoading} />
        </>
    )
}

export default UploadMode;

import styled from "styled-components";
import { InvoiceSummary } from "@/types/Invoice";
import Line from "@/components/Line";

const Area = styled.div`
    padding: 0.5rem;
    background-color: var(--Background-Colors-bg-secondary);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    width: 400px;
`;

const InfoText = () => {
    return (
        <Area>
            <div style={{ display: "flex", gap: "0.25rem" }}>
                <Icon icon="warning-circle" size={24} iconColor="var(--Icons-icon-300)" />
                <Info>El monto se distribuirá automáticamente de la factura más vieja a la más nueva.</Info>
            </div>
        </Area>
    );
}

const Info = styled.p`
    font-size: 0.875rem;
    color: var(--Text-text-tertiary);
    font-weight: 400;
`;