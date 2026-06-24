import styled from "styled-components";

interface ChipsProps {
    items: {text: string, value:string}[];
    selected: string;
    onClick: (value: string) => void;
}

const Chips = ({items, selected, onClick}: ChipsProps) => {

    return(
        <Wrapper>
            {items.map(item => (
                <Chip key={item.value} text={item.text} value={item.value} selected={item.value === selected} onClick={onClick} />
            ))}
        </Wrapper>
    )
}

export default Chips;

const Wrapper = styled.div`
    display: flex;
    gap: 0.5rem;
`;

interface ChipProps {
    text: string;
    value: string;
    selected: boolean;
    onClick: (value: string) => void;
}

export const Chip = ({text, value, selected, onClick}: ChipProps) => {

    return(
        <ChipWrapper $selected={selected} onClick={() => onClick(value)}>
            {text}
        </ChipWrapper>
    )
}

const ChipWrapper = styled.div<{$selected: boolean}>`
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background: var(--Background-Colors-bg-secondary);
    border: 1px solid ${({$selected}) => $selected ? 'var(--Components-Buttons-button-brand-bg)' : 'var(--Border-Colors-border-secondary)'};
    cursor: pointer;

    font-size: 0.875rem;
    font-weight: 500;
    color: ${({$selected}) => $selected ? 'var(--Components-Buttons-button-brand-secondary-content)' : 'var(--Text-text-primary)'};

    &:hover {
        background: ${({$selected}) => $selected ? 'var(--Components-Buttons-button-brand-bg_hover)' : 'var(--Border-Colors-border-secondary_hover)'};
    }
`;

import { useTranslation } from "react-i18next"

export const StatusChip = ({type, status, style}: {type: "invoice" | "payment", status: string, style?: React.CSSProperties}) => {

    const { t } = useTranslation(type)


    return(
        <StatusChipWrapper $status={status} style={style}>
            {t(`status.${status.toLowerCase()}`, {count: 1})}
        </StatusChipWrapper>
    )
}

const StatusChipWrapper = styled.div<{$status: string}>`
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background: ${({$status}) => `var(--status-${$status}-bg)`};
    border: 1px solid ${({$status}) => `var(--status-${$status}-border)`};

    font-size: 0.75rem;
    font-weight: 500;
    color: ${({$status}) => `var(--status-${$status}-text)`};
`;