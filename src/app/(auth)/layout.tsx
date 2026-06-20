"use client";

import styled from "styled-components";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {



    return (
        <Wrapper>
            {children}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--Background-Colors-bg-primary);
`;