"use client";

import {useState} from "react";

import { supabase } from "@/lib/supabase";

import { useProjectsStore } from "@/stores/projectStore";
import { useUserStore } from "@/stores/userStore";

import Header from "@/components/Header";

import NewInvoiceModal from "./_components/modals/NewInvoiceModal";

const Invoices = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const projectName = useProjectsStore(s => s.project?.name);
    const role = useUserStore(s => s.role);

    const a = async () => {
        const { data, error } = await supabase.storage
            .from("documents")
            .list(`ad7206ba-cc54-4534-9738-75f26f06ae9e/invoices`);

        console.log(data, error);

        const { data: userData } = await supabase.auth.getUser();

        console.log(userData.user?.id);

        const { data:a, error:b } = await supabase
            .from("projects")
            .select("id")
            .limit(1);

        console.log(a,b)
    }

    a();
    return (
        <>
            {isModalOpen && <NewInvoiceModal onClose={() => setIsModalOpen(false)} />}

            <Header title={`Facturas -- ${projectName}`} showButton={role === 'admin'} buttontext="Nueva factura" buttonIcon="plus" onButtonClick={() => setIsModalOpen(true)} />
        </>
    )
}

export default Invoices;