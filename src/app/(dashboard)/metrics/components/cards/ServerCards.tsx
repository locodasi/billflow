import { Period } from "@/lib/period";
import { getCardsValue } from "../../actions";
import ClientCards from "./ClientCards";

const ServerCards = async ({ period }: { period: Period }) => {
    const { invoiced, payed, totalInvoices, averagePerMonth } = await getCardsValue(period);

    return (
        <ClientCards invoiced={invoiced} payed={payed} totalInvoices={totalInvoices} averagePerMonth={averagePerMonth} />
    );
};

export default ServerCards;