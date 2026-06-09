
import { supabase } from "@/lib/supabase";

import {useState, useEffect} from "react";

const PDF = ({ path, width, height }: { path: string, width?: string, height?: string }) => {

    const [url, setUrl] = useState<string>("")

    useEffect(() => {

        const fetchUrl = async () => {
            const { data } = await supabase.storage
                .from("documents")
                .createSignedUrl(path, 60 * 60) // 1 hora

            const url = data?.signedUrl
            if (url) setUrl(url)
            console.log(url)
        }

        fetchUrl()
    }, [path])

    return (
        <iframe
            src={url}
            style={{ width: width || '50vh', height: height || '80vh', border: 'none' }}
            title="Documento"
        />
    )
}

export default PDF;