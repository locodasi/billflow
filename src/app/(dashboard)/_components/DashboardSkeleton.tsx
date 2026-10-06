import styled from "styled-components";

import Skeleton from "@/components/Skeleton";

const NAV_ITEMS = 4; // invoices, payments, metrics, settings (los items de admin se ignoran: el rol todavía no se conoce)


function SidenavSkeleton() {
    const items = Array.from({ length: NAV_ITEMS }, (_, index) => (
        <Skeleton key={index} customStyles={{ height: "1.75rem", borderRadius: "0.5rem" }} />
    ));

    return (
        <SidenavWrapper>
            <SidenavHeader>
                <Skeleton customStyles={{ height: "2.5rem", borderRadius: "0.5rem", flex: 1 }} />
            </SidenavHeader>

            <NavList>{items}</NavList>

            <UserSlot>
                <Skeleton customStyles={{ height: "3rem", borderRadius: "0.5rem" }} />
            </UserSlot>
        </SidenavWrapper>
    );
}


function MobileHeaderSkeleton() {
    return (
        <MobileWrapper>
            <MobileLeft>
                <Skeleton customStyles={{ height: "1.5rem", width: "1.5rem", borderRadius: "0.375rem" }} />
                <Skeleton customStyles={{ height: "1.25rem", width: "8rem" }} />
            </MobileLeft>

            <Skeleton customStyles={{ height: "1.5rem", width: "1.5rem", borderRadius: "50%" }} />
        </MobileWrapper>
    );
}


export function DashboardSkeleton() {
    return (
        <Container>
            <SidenavSkeleton />
            <MobileHeaderSkeleton />
            <Main />
        </Container>
    );
}


const Container = styled.div`
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Main = styled.main`
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;

    background-color: var(--Background-Colors-bg-primary);
`;

const SidenavWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    height: 100%;
    width: 250px;
    padding: 1rem;

    background-color: var(--Background-Colors-bg-secondary);
    border: 1px solid var(--Border-Colors-border-secondary);

    @media (max-width: 768px) {
        display: none;
    }
`;

const SidenavHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
`;

const NavList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const UserSlot = styled.div`
    margin-top: auto;
`;

const MobileWrapper = styled.header`
    display: none;

    @media (max-width: 768px) {
        display: flex;
        align-items: center;
        justify-content: space-between;

        height: 56px;
        width: 100%;
        flex-shrink: 0;

        padding: 0 1rem;

        background-color: var(--Background-Colors-bg-secondary);
        border-bottom: 1px solid var(--Border-Colors-border-secondary);
    }
`;

const MobileLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;