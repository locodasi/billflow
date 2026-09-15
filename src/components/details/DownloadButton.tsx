import {useTranslations} from "next-intl";
import { supabase } from "@/lib/supabase";

import Button from "@/components/Button";

const DownloadButton = ({ path, file_title }: { path: string, file_title: string }) => {
    const t = useTranslations('common');

    const handleDownload = async () => {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(path)

        if (error || !data) return

        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `${file_title}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Button text={t('download')} size="small" onClick={handleDownload} firstIcon={"download"} />
    )
}

export default DownloadButton;

import styled from "styled-components";

import { ClickTooltip } from "@/components/Tooltip";

import Icon from "../icons/Icon";
import IconButton from "../IconButton";

interface InvoiceActionsProps {
    file_title: string;
    path: string;
}

export const MobileActions = ({
    file_title,
    path,
}: InvoiceActionsProps) => {

    const t = useTranslations('common');

    const handleViewPdf = async () => {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(path)

        if (error || !data) return

        const url = URL.createObjectURL(data)
        console.log(url)

        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handleDownload = async () => {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(path)

        if (error || !data) return

        const url = URL.createObjectURL(data)
        const a = document.createElement('a')
        a.href = url
        a.download = `${file_title}.pdf`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <ClickTooltip
            position="bottom-end"
            offset={[0, 8]}
            content={(close) => (
                <Menu>
                    <MenuItem
                        onClick={() => {
                            handleViewPdf();
                            close();
                        }}
                    >
                        <Icon icon="eye-alt" grab/>
                        <span>{t("show")}</span>
                    </MenuItem>

                    <MenuItem
                        onClick={async () => {
                            await handleDownload();
                            close();
                        }}
                    >
                        <Icon icon="download" grab/>
                        <span>{t("download")}</span>
                    </MenuItem>
                </Menu>
            )}
        >
            <Icon icon="more-vert" grab size={30}/>
        </ClickTooltip>
    );
};


const Menu = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const MenuItem = styled.button`
    display: flex;
    align-items: center;
    gap: 0.75rem;

    width: 100%;

    border: none;
    border-radius: 5px;

    background: transparent;
    color: var(--Text-text-primary);

    font-size: 14px;
    text-align: left;

    cursor: pointer;

    // &:hover {
    //     background: var(--Background-Colors-bg-primary);
    // }
`;
