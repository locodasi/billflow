"use client";

import styled from "styled-components";

import {useTranslations} from "next-intl";

import { useState, useEffect } from "react";

import { supabase } from "@/lib/supabase";

import Header from "@/components/Header";
import SearchInput from "@/components/inputs/SearchInput";

import NewClientModal from "./_components/NewClientModal";
import ClientCard from "./_components/ClientCard";

import { Client } from "./_types/types";

const ClientsPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [search, setSearch] = useState("");

    const t = useTranslations("clients");

    useEffect(() => {
        const fetchClients = async () => {
            const { data } = await supabase
                .from("client_stats")  // ← la view en vez de clients
                .select("*");

            if (!data) return;

            setClients(data); // ya viene mapeado con los stats
        };

        fetchClients();
    }, []);

    const filtered = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {isModalOpen && <NewClientModal onClose={() => setIsModalOpen(false)} addClient={(client) => setClients([...clients, client])} />}

            <Header title={t("header")} showButton={true} buttontext={t("new-client-button")} buttonIcon="plus" onButtonClick={() => setIsModalOpen(true)} />

            <Wrapper>
                <SearchInput onSearch={setSearch} placeholder={t("search-placeholder")} />

                <ClientsContainer>
                    {
                        filtered.map(client => (
                            <ClientCard key={client.client_id} client={client} />
                        ))
                    }
                </ClientsContainer>
            </Wrapper>
        </>
    )
}

export default ClientsPage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const ClientsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
`;