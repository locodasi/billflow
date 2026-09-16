import styled from "styled-components";

import { Period } from "@/lib/period";

import { getChartsValue } from "../../actions";

import InvoicesPerClient from "./InvoicesPerClient";
import InvoicesVsPayments from "./InvoicesVsPayments";


const ServerCharts = async ({ period, offset }: { period: Period; offset: number }) => {
    const { barData, lineData } = await getChartsValue(period, offset);

    return (
        <ChartsWrapper>
            <InvoicesPerClient data={barData} />
            <InvoicesVsPayments data={lineData} />
        </ChartsWrapper>
    ); 
};

export default ServerCharts;

const ChartsWrapper = styled.div`
    display: flex;
    gap: 1rem;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;