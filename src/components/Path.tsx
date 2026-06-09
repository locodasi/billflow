
import styled from "styled-components";

import { useRouter } from "next/navigation";

import React from "react";

export const PathWrapper = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;

    color: var(--Text-text-tertiary);
`;

export const RedirectPath = ({path, label}: {path: string, label: string}) => {

    const router = useRouter();

    return(
        <p onClick={() => router.push(path)} style={{ cursor: "pointer" }}>{label}</p>
    )
}

const Path = ({children}: {children: React.ReactNode}) => {
    const items = React.Children.toArray(children)

    return(
        <PathWrapper>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {item}
                    {index < items.length - 1 && <span>&gt;</span>}
                </React.Fragment>
            ))}
        </PathWrapper>
    )
}

export default Path;
