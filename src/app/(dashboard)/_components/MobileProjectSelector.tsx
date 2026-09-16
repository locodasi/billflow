"use client";

import styled from "styled-components";
import { useState } from "react";
import { useProjectsStore } from "@/stores/projectStore";
import { useTranslations } from "next-intl";

import Icon from "@/components/icons/Icon";
import Modal, {
    HeaderModal,
    WrapperModal,
} from "@/components/modals/Modal";

const MobileProjectSelector = () => {
    const projects = useProjectsStore(state => state.projects);
    const project = useProjectsStore(state => state.project);
    const setProject = useProjectsStore(state => state.setProject);

    const t = useTranslations("sidenav");

    const [showModal, setShowModal] = useState(false);

    const open = () => setShowModal(true);
    const close = () => setShowModal(false);

    const handleSelect = (projectId: string) => {
        const selectedProject = projects.find(
            p => p.id === projectId
        );

        if (!selectedProject) return;

        setProject(selectedProject);
        close();
    };

    return (
        <>
            <ProjectButton onClick={open}>
                <ProjectName>
                    {project
                        ? project.name
                        : "No project selected"}
                </ProjectName>

                <Icon
                    icon="nav-arrow-down"
                    size={16}
                    iconColor="var(--Icons-icon-400)"
                />
            </ProjectButton>

            {showModal && (
                <Modal onClose={close} zIndex={1000}>
                    <WrapperModal>
                        <HeaderModal
                            title={t("select_project")}
                            onClose={close}
                            closeIcon="cancel"
                        />

                        <ProjectsWrapper>
                            {projects.map(p => (
                                <ProjectOption
                                    key={p.id}
                                    $selected={p.id === project?.id}
                                    onClick={() => handleSelect(p.id)}
                                >
                                    <ProjectOptionName>
                                        {p.name}
                                    </ProjectOptionName>

                                    {p.id === project?.id && (
                                        <Icon
                                            icon="check"
                                            size={20}
                                            iconColor="var(--Icons-icon-400)"
                                        />
                                    )}
                                </ProjectOption>
                            ))}
                        </ProjectsWrapper>
                    </WrapperModal>
                </Modal>
            )}
        </>
    );
};

export default MobileProjectSelector;

const ProjectButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    min-width: 0;

    padding: 0;
    border: none;
    background: transparent;

    cursor: pointer;
`;

const ProjectName = styled.span`
    min-width: 0;

    color: var(--Text-text-primary);
    font-size: 0.875rem;
    font-weight: 500;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ProjectsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    overflow-y: auto;
`;

const ProjectOption = styled.button<{ $selected: boolean }>`
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;

    padding: 0.75rem;

    border: none;
    border-radius: 0.5rem;

    background-color: ${({ $selected }) =>
        $selected
            ? "var(--Background-Colors-bg-secondary)"
            : "transparent"};

    cursor: pointer;

    &:hover {
        background-color: var(--Background-Colors-bg-secondary_hover);
    }
`;

const ProjectOptionName = styled.span`
    color: var(--Text-text-primary);
    font-size: 0.875rem;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
