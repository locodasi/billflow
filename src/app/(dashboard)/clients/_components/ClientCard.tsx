import styled from "styled-components";

import {useRouter} from "next/navigation";

import {useTranslations} from "next-intl";

import {Client} from "../_types/types";

import Card, {TwoRowData} from "@/components/card/Card";


const ClientCard = ({client}: {client: Client}) => {

    const t = useTranslations("clients");

    const router = useRouter();

    const handleClick = () => router.push(`/clients/${client.client_id}`);

    return (
        <Card onClick={handleClick} direction="column" pointer>

            <div style={{width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "var(--Background-Colors-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <Name>{client.name.split(" ").slice(0,2).map(n => n[0]).join("").toUpperCase()}</Name>
            </div>

            <TwoRowData boldText={client.name} normalText={client.email} />
            
            <div style={{display: "flex"}}>
                <div style={{display: "flex", flexDirection: "column", paddingRight: "0.5rem", borderRight: "1px solid var(--Border-Colors-border-secondary)"}}>
                    <TwoRowData boldText={client.project_count.toString()} normalText={t("projects")} />
                </div>
                <div style={{display: "flex", flexDirection: "column", paddingLeft: "0.5rem"}}>
                    <TwoRowData boldText={`$${client.total_invoiced_usd}`} normalText={t("total-amount")} />
                </div>
            </div>
        </Card>
    )
}

export default ClientCard;

const Name = styled.p`
    color: var(--Text-text-primary);
    font-size: 0.875rem;
    font-weight: 500;
`;

