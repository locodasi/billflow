import styled from "styled-components";

import { useTranslations } from "next-intl";

import { useState } from "react";

import { useProjectsStore } from "@/stores/projectStore";

import Icon from "@/components/icons/Icon";

import SidenavButton from "./SidenavButton";

const SelectProject = ({ isExpanded }: { isExpanded: boolean }) => {
    const project = useProjectsStore(state => state.project);
    const t = useTranslations("sidenav")

    const [showModal, setShowModal] = useState(false)

    const open = () => setShowModal(true)
    const close = () => setShowModal(false)

    if (!isExpanded) {
        return (
            <>
                <SidenavButton isExpanded={false} text={t("projects")} icon="folder" onClick={open} />
                {showModal && <Projects close={close} />}
            </>
        )
    }

    return (
        <div style={{ width: "100%" }}>
            <ProjectWrapper onClick={open}>
                <ProjectTitle>{project ? project.name : "No project selected"}</ProjectTitle>
            </ProjectWrapper>

            {showModal && <Projects close={close} />}
        </div>
    )
}

export default SelectProject;

const ProjectWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.5rem;
    width: calc(100% - 1rem);
    cursor: pointer;

    &:hover {
        background-color: var(--Background-Colors-bg-primary);
    }
`;

const ProjectTitle = styled.h2`
    color: var(--Text-text-primary);
    font-size: 0.875rem;
    padding: 0.5rem;
    border-radius: 0.5rem;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

import Modal from "@/components/modals/Modal";

const Projects = ({ close }: { close: () => void }) => {
    const projects = useProjectsStore(state => state.projects);
    const project = useProjectsStore(state => state.project);
    const setProject = useProjectsStore(state => state.setProject);

    const t = useTranslations("sidenav")
    const handleClose = (projectId: string) => {
        setProject(projects.find(p => p.id === projectId)!);
        close();
    }

    return (
        <Modal onClose={close} zIndex={1000}>
            <ModalWrapper>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: "1rem", color: "var(--Text-text-primary)" }}>{t("select_project")}</p>
                    <Icon icon="cancel" onClick={close} size={20} />
                </div>
                <ProjectsWrapper>
                    {projects.filter(p => p.id !== project?.id).map(p => (
                        <ProjectWrapperElement key={p.id}>
                            <ProjectTitle onClick={() => handleClose(p.id)}>
                                {p.name}
                            </ProjectTitle>
                        </ProjectWrapperElement>
                    ))}
                </ProjectsWrapper>
            </ModalWrapper>
        </Modal>
    )
}

const ModalWrapper = styled.div`
    padding: 2rem;
    min-width: 50%;
    border-radius: 0.5rem;
    background: var(--Background-Colors-bg-primary);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
`;

const ProjectsWrapper = styled.div`
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background-color: var(--Background-Colors-bg-primary);
    border-radius: 0.5rem;
    overflow: auto;
`;

const ProjectWrapperElement = styled.div`
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
        background-color: var(--Background-Colors-bg-secondary);
    }
`;