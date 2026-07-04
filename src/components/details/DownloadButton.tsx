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