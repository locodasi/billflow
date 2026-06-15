import styled from "styled-components";

const InfoSection = ({title, useBorder = true, children}: {title: string, useBorder?: boolean, children: React.ReactNode}) => {

    return(
        <InfoSectionWrapper $useBorder={useBorder}>
            <InfoTitle>{title}</InfoTitle>
            {children}
        </InfoSectionWrapper>
    )
}

export default InfoSection;

const InfoSectionWrapper = styled.div<{$useBorder?: boolean}>`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    border-bottom: ${({ $useBorder }) => $useBorder ? '1px solid var(--Border-Colors-border-secondary)' : 'none'};

`;

const InfoTitle = styled.p`
    color: var(--Text-text-secondary, #344051);
    font-size: 1rem;
    font-weight: 500;
`;

export const TwoRowData = ({leftText, rightText, rightTextColor = "var(--Text-text-primary, #344051)"}: {rightText: string, leftText: string, rightTextColor?: string}) => {

    return(
        <div style={{display: "flex", justifyContent: "space-between", alignItems:"center"}}>
            <p style={{fontSize: '0.875rem', fontWeight: 500, color: "var(--Text-text-secondary, #344051)"}}>{leftText}</p>
            <p style={{color: rightTextColor, fontSize: '0.875rem', fontWeight: 500}}>{rightText}</p>
        </div>
    )
}