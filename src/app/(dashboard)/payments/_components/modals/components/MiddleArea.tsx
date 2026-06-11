import { Children, Fragment, type ReactNode } from "react";
import styled from "styled-components";

const MiddleArea = ({ children }: { children: ReactNode }) => {
    const childrenArray = Children.toArray(children);

    return(
        <Wrapper>
            {childrenArray.map((child, index) => (
                <Fragment key={index}>
                    <Side>{child}</Side>
                    {index < childrenArray.length - 1 && <Separator />}
                </Fragment>
            ))}
        </Wrapper>
    )
}

export default MiddleArea;

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    min-height: 0;
`;

const Separator = styled.div`
    width: 1px;
    align-self: stretch;
    background-color: var(--Border-Colors-border-primary);
`;

export const Side = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`; 