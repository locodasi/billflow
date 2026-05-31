// src/app/(dashboard)/clients/[id]/_components/ClientView.tsx
'use client'

import styled from "styled-components";

import { useRouter } from "next/navigation";

import { useState } from "react";

import {useProjectsStore} from "@/stores/projectStore";

import Header from "@/components/Header";
import Card, { TwoRowData } from "@/components/card/Card";
import Button from "@/components/Button";

import ClientLogo from "../../_components/ClientLogo";
import { Client, Project } from "../../_types/types";

import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";

type ModalState = "new_project" | "edit_client" | "edit_project" | null;

const ClientView = ({ client, projects }: { client: Client, projects: Project[] }) => {

    const [clientState, setClientState] = useState(client);
    const [projectsList, setProjectsList] = useState<Project[]>(projects);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const updateProjectStore = useProjectsStore(state => state.updateProject);

    const [modal, setModal] = useState<ModalState>(null);

    const router = useRouter();

    const addProject = (project: Project) => {
        setProjectsList([...projectsList, project]);
        setClientState({ ...clientState, project_count: clientState.project_count + 1 });
    };

    const updateProject = (project_id: string, updatedData: Partial<Project>) => {
        setProjectsList(projectsList.map(p => p.project_id === project_id ? { ...p, ...updatedData } : p));
        updateProjectStore(project_id, updatedData);
    }

    return (
        <>
            <Header title="Clientes" showButton={false} />

            <Wrapper>
                <Path>
                    <p onClick={() => router.push("/clients")} style={{ cursor: "pointer" }}>Clientes</p> &gt; <span>{clientState.name}</span>
                </Path>

                <Card direction="row" cardStyles={{ justifyContent: "space-between" }} pointer={false}>
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <ClientLogo name={clientState.name} padding="1rem" />
                        <TwoRowData boldText={clientState.name} normalText={clientState.email} />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <TwoRowData boldText={clientState.project_count.toString()} normalText={"Proyectos"} reverse />
                        <TwoRowData boldText={clientState.total_invoiced.toString()} normalText={"Total Facturado"} reverse />
                        <TwoRowData boldText={clientState.total_pending.toString()} normalText={"Pendiente"} reverse />
                        <Button text="Editar" onClick={() => setModal("edit_client")} firstIcon={"edit-pencil"} style="outline" />
                    </div>
                </Card>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <ProjectTitle>Proyectos</ProjectTitle>
                    <Button text="Nuevo proyecto" onClick={() => setModal("new_project")} firstIcon={"plus"} style="outline" size="small" />
                </div>

                <ProjectContainer>
                    {
                        projectsList.map(project => (
                            <Card key={project.project_id} direction="column" onClick={() => {setSelectedProject(project); setModal("edit_project")}} pointer>
                                <TwoRowData boldText={project.name} normalText={project.currency} />

                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <TwoRowData boldText={project.total_invoiced} normalText={"Facturado"} reverse background />
                                    <TwoRowData boldText={project.total_paid} normalText={"Cobrado"} reverse background />
                                    <TwoRowData boldText={project.total_pending} normalText={"Pendiente"} reverse background />
                                </div>
                            </Card>
                        ))
                    }
                </ProjectContainer>

                {modal === "new_project" && <NewProjectModal clientId={clientState.client_id} onClose={() => setModal(null)} onCreated={addProject} />}
                {modal === "edit_project" && selectedProject && <EditProjectModal project_id={selectedProject.project_id} name={selectedProject.name} currency={selectedProject.currency} bill_address={selectedProject.bill_address} onClose={() => setModal(null)} onUpdate={updateProject} />}
                {/* {modal === "new_project" && <NewProjectModal clientId={clientState.client_id} onClose={() => setModal(null)} onCreated={addProject} />} */}
            </Wrapper>
        </>
    );
}

export default ClientView;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const Path = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;

    color: var(--Text-text-tertiary);

    span {
        color: var(--Text-text-primary);
    }
`;

const ProjectTitle = styled.p`
    color: var(--Text-text-primary);
    font-size: 1.25rem;
    font-weight: 500;
`;

const ProjectContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
`;