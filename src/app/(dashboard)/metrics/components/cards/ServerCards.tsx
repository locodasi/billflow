import { Period } from "@/lib/period";
import { getCardsValue } from "../../actions";

const ServerCards = async ({ period }: { period: Period }) => {
    const { invoiced, payed, totalInvoices, averagePerMonth } = await getCardsValue(period);

    return (
        <div style={{ display: 'flex', gap: '1rem', flexDirection: "column" }}>
            <p>Period: {period}</p>
            <p>Invoiced: {invoiced}</p>
            <p>Payed: {payed}</p>
            <p>Total Invoices: {totalInvoices}</p>
            <p>Average Per Month: {averagePerMonth}</p>
        </div>
    );
};

export default ServerCards;