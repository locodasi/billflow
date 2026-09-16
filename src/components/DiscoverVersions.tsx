import styled from "styled-components";

export const DesktopComponent = styled.div`
    display: block;

    @media (max-width: 768px) {
        display: none;
    }
`;

export const MobileComponent = styled.div`
    display: none;

    @media (max-width: 768px) {
        display: block;
    }
`;