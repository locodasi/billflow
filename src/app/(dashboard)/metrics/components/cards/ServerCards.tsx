import { Period } from "@/lib/period";
import { getCardsValue } from "../../actions";
import ClientCards from "./ClientCards";

const ServerCards = async ({ period, offset }: { period: Period; offset: number }) => {
    const { invoiced, payed, totalInvoices, averagePerMonth, prevInvoiced, prevPayed, prevTotalInvoices } = await getCardsValue(period, offset);

    return (
        <ClientCards invoiced={invoiced} payed={payed} totalInvoices={totalInvoices} averagePerMonth={averagePerMonth} prevInvoiced={prevInvoiced} prevPayed={prevPayed} prevTotalInvoices={prevTotalInvoices} />
    );
};

export default ServerCards;