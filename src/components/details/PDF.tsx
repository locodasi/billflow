import styled from "styled-components";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const PDF = ({ path }: { path: string }) => {
    const [url, setUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchUrl = async () => {
            const { data } = await supabase.storage
                .from("documents")
                .createSignedUrl(path, 60 * 60);

            if (data?.signedUrl) {
                setUrl(data.signedUrl);
            }
        };

        fetchUrl();
    }, [path]);

    return (
        <PDFFrame
            src={url || undefined}
            title="Documento"
        />
    );
};

export default PDF;

const PDFFrame = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
    display: block;
`;
