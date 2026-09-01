import { Period } from "@/lib/period";

import { getChartsValue } from "../../actions";

import InvoicesPerClient from "./InvoicesPerClient";
import InvoicesVsPayments from "./InvoicesVsPayments";


const ServerCharts = async ({ period, offset }: { period: Period; offset: number }) => {
    const { barData, lineData } = await getChartsValue(period, offset);

    console.log("ServerCharts", { barData, lineData });
    return (
        <div style={{ display: 'flex', gap: '1rem' }}>
            <InvoicesPerClient data={barData} />
            <InvoicesVsPayments data={lineData} />
        </div>
    );
};

export default ServerCharts;