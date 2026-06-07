import styled from "styled-components";

import Icon from "./icons/Icon";

const FileItem = ({ file, remove }: { file: File, remove: () => void }) => {

    return (
        <FileItemWrapper>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <Icon icon="page" size={24} iconColor="var(--Components-Buttons-button-brand-bg)"/>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <FileTitle>{file.name}</FileTitle>
                    <FileSize>{(file.size / 1024).toFixed(2)} KB</FileSize>
                </div>
            </div>

            <Icon icon="cancel" size={20} iconColor="var(--Components-Buttons-button-brand-bg)" onClick={remove} />
        </FileItemWrapper>
    )
}

export default FileItem;

const FileItemWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    border: 1px solid var(--Components-Buttons-button-brand-bg);
    border-radius: 0.5rem;
    background: var(--Background-Colors-bg-secondary);
`;

const FileTitle = styled.p`
    font-size: 0.9rem;
    color: var(--Components-Buttons-button-brand-bg);
    font-weight: 500;
`;

const FileSize = styled.p`
    font-size: 0.8rem;
    color: var(--Components-Buttons-button-brand-bg);
    font-weight: 400;
`;

export const DetectedCard = ({text}: {text: string}) => {

    return(
        <DetectedDataWrapper>
            <Icon icon="sparks" size={20} iconColor="var(--Components-Buttons-button-brand-bg)" />
            <DetectedDataText>{text}</DetectedDataText>
        </DetectedDataWrapper>
    )
}

const DetectedDataWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background: var(--Background-Colors-bg-secondary);
`;

const DetectedDataText = styled.p`
    font-size: 0.9rem;
    color: var(--Text-text-primary);
    font-weight: 400;
`;

