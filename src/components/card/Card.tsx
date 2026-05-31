import styled from "styled-components";

interface CardProps {
    onClick?: () => void;
    pointer?: boolean;
    direction?: "row" | "column";
    children?: React.ReactNode;
    cardStyles?: React.CSSProperties;
}

const Card = ({ direction = "column", children, pointer = true, onClick, cardStyles }: CardProps) => {

    return (
        <Wrapper $direction={direction} $pointer={pointer} onClick={onClick ? onClick : undefined} style={cardStyles}>
            {children}
        </Wrapper>
    )
}

export default Card;

const Wrapper = styled.div<{ $direction: "row" | "column", $pointer: boolean }>`
    background: var(--Background-Colors-bg-secondary);
    border: 1px solid var(--Border-Colors-border-secondary);
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    flex-direction: ${props => props.$direction};
    gap: 0.5rem;
    cursor: ${props => (props.$pointer ? "pointer" : "default")};

    &:hover {
        border-color: ${props => (props.$pointer ? "var(--Border-Colors-border-tertiary)" : "var(--Border-Colors-border-secondary)")};
    }
`;

interface TwoRowDataProps {
    boldText: string | number;
    normalText: string | number;
    reverse?: boolean;
    background?: boolean;
}

export const TwoRowData = ({ boldText, normalText, reverse = false, background = false }: TwoRowDataProps) => {

    return (
        <TwoRowDataWrapper $background={background}>
            {reverse ? <NormalText>{normalText.toString()}</NormalText> : <BoldText>{boldText.toString()}</BoldText>}
            {reverse ? <BoldText>{boldText.toString()}</BoldText> : <NormalText>{normalText.toString()}</NormalText>}
        </TwoRowDataWrapper>
    )
}

const TwoRowDataWrapper = styled.div<{$background: boolean}>`
    display: flex;
    flex-direction: column;
    padding: ${props => (props.$background ? "0.5rem" : "0")};
    background: ${props => (props.$background ? "var(--Background-Colors-bg-primary)" : "transparent")};
    border-radius: 0.5rem;
`;

const BoldText = styled.p`
    color: var(--Text-text-primary);
    font-size: 0.875rem;
    font-weight: 500;
`;

const NormalText = styled.p`
    color: var(--Text-text-tertiary);
    font-size: 0.75rem;
    font-weight: 400;
`;