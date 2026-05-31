import styled from "styled-components";

const ClientLogo = ({name, padding = "2rem"}: {name: string, padding?: string}) => {
    return (
        <Wrapper $padding={padding}>
            <Text>{name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()}</Text>
        </Wrapper>
    )
}

export default ClientLogo;

const Wrapper = styled.div<{$padding: string}>`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${({ $padding }) => $padding};
    background: var(--Background-Colors-bg-primary);
    border-radius: 0.5rem;
`;

const Text = styled.p`
    color: var(--Text-text-primary);
    font-size: 0.875rem;
    font-weight: 500;
`;