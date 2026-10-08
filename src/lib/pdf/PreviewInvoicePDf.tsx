'use client';

import { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import styled from 'styled-components';

import Modal, {HeaderModal, WrapperModal} from '@/components/modals/Modal';

import Button from '@/components/Button';

import {
    InvoiceData,
} from './TestInvoice'

import { TestInvoice } from '@/lib/pdf/TestInvoice';

interface PreviewInvoicePdfProps {
    data: InvoiceData;
    onClose: () => void;
    onUpload: (file: Blob) => Promise<void>;
}

const PreviewInvoicePdf = ({
    data,
    onClose,
    onUpload,
}: PreviewInvoicePdfProps) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(
        null,
    );

    const [pdfBlob, setPdfBlob] = useState<Blob | null>(
        null,
    );

    const [isGenerating, setIsGenerating] =
        useState(true);

    const [isUploading, setIsUploading] =
        useState(false);

    const [error, setError] = useState<string | null>(
        null,
    );

    useEffect(() => {
        let objectUrl: string | null = null;
        let cancelled = false;

        const generatePdf = async () => {
            try {
                setIsGenerating(true);
                setError(null);

                const blob = await pdf(
                    <TestInvoice data={data} />,
                ).toBlob();

                if (cancelled) {
                    return;
                }

                objectUrl = URL.createObjectURL(blob);

                setPdfBlob(blob);
                setPdfUrl(objectUrl);
            } catch (error) {
                console.error(
                    'Error generating invoice PDF:',
                    error,
                );

                if (!cancelled) {
                    setError(
                        'Could not generate the invoice preview.',
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsGenerating(false);
                }
            }
        };

        generatePdf();

        return () => {
            cancelled = true;

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [data]);

    const handleUpload = async () => {
        if (!pdfBlob) {
            return;
        }

        try {
            setIsUploading(true);
            setError(null);

            await onUpload(pdfBlob);
        } catch (error) {
            console.error(
                'Error uploading invoice PDF:',
                error,
            );

            setError(
                'Could not upload the invoice. Please try again.',
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal onClose={isUploading ? () => {} : onClose}>
            <WrapperModal variant={'large'}>
                <HeaderModal
                    title="Preview invoice"
                    onClose={
                        isUploading
                            ? () => {}
                            : onClose
                    }
                />

                <Content>
                    {isGenerating && (
                        <LoadingContainer>
                            <Spinner />

                            <LoadingTitle>
                                Generating invoice...
                            </LoadingTitle>

                            <LoadingText>
                                Please wait while we prepare
                                your PDF preview.
                            </LoadingText>
                        </LoadingContainer>
                    )}

                    {!isGenerating && error && (
                        <ErrorContainer>
                            <ErrorTitle>
                                Something went wrong
                            </ErrorTitle>

                            <ErrorText>
                                {error}
                            </ErrorText>
                        </ErrorContainer>
                    )}

                    {!isGenerating &&
                        !error &&
                        pdfUrl && (
                            <PdfPreview>
                                <iframe
                                    src={pdfUrl}
                                    title="Invoice preview"
                                />
                            </PdfPreview>
                        )}
                </Content>

                <Footer>
                    <Button
                        text="Cancel"
                        onClick={onClose}
                        disabled={isUploading}
                        type="default"
                        style="outline"
                        size="small"
                    />

                    <Button
                        text={
                            isUploading
                                ? 'Uploading...'
                                : 'Upload invoice'
                        }
                        onClick={handleUpload}
                        disabled={
                            isGenerating ||
                            !pdfBlob ||
                            isUploading ||
                            !!error
                        }
                        type="primary"
                        style="filled"
                        size="small"
                    />
                </Footer>
            </WrapperModal>
        </Modal>
    );
};

export default PreviewInvoicePdf;

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */
const Content = styled.div`
    flex: 1;
    min-height: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
`;

const PdfPreview = styled.div`
    width: 100%;
    height: 100%;

    overflow: hidden;

    border: 1px solid
        var(--Border-Colors-border-primary);
    border-radius: 0.5rem;

    background: #e5e7eb;

    iframe {
        display: block;
        width: 100%;
        height: 100%;
        border: none;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 0.75rem;

    width: 100%;
    height: 100%;
`;

const Spinner = styled.div`
    width: 32px;
    height: 32px;

    border: 3px solid
        var(--Border-Colors-border-primary);

    border-top-color:
        var(--Text-text-primary);

    border-radius: 50%;

    animation: spin 0.8s linear infinite;

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

const LoadingTitle = styled.div`
    color: var(--Text-text-primary);
    font-size: 16px;
    font-weight: 600;
`;

const LoadingText = styled.div`
    color: var(--Text-text-tertiary);
    font-size: 13px;
`;

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 0.5rem;

    width: 100%;
    height: 100%;
`;

const ErrorTitle = styled.div`
    color: var(--Text-text-primary);
    font-size: 16px;
    font-weight: 600;
`;

const ErrorText = styled.div`
    color: var(--Text-text-tertiary);
    font-size: 14px;
    text-align: center;
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    gap: 0.75rem;

    padding-top: 0.25rem;
`;