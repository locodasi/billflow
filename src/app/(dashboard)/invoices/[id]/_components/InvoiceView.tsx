"use client"

import styled from "styled-components";

import { InvoiceSummary } from "@/types/Invoice";

import {HeaderWrapper} from "@/components/Header";
import Path, {RedirectPath} from "@/components/Path";

import Title from "@/components/details/Title";
import DownloadButton from "@/components/details/DownloadButton";
import InvoiceDetail from "@/components/details/InvoiceDetail";

const InvoiceView = ({ invoice }: { invoice: InvoiceSummary }) => {

    return (
        <>
            <HeaderWrapper>
                <Path>
                    <RedirectPath path="/invoices" label="Facturas" />
                    <Title text={invoice.invoice_number} status={invoice.status} />
                </Path>

                <DownloadButton file_title={invoice.invoice_number} path={invoice.pdf_path} />
            </HeaderWrapper>

            <Wrapper>
                <InvoiceDetail invoice={invoice} pdfHeight="100%" pdfWidth="80%"/>
            </Wrapper>
        </>
    )
}

export default InvoiceView;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
`;
